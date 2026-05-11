"use client";

import { useState, useEffect } from "react";
import { authApi } from "@/api/auth";
import { useSearchParams } from "next/navigation";
import {
  Select,
  Button,
  Modal,
  Typography,
  Rate,
  Input,
  InputNumber,
  ColorPicker,
  Form,
  Spin,
  App,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { categoriesApi } from "@/api/categories";
import { wheelContentsApi } from "@/api/wheel-contents";
import { spinHistoryApi } from "@/api/spin-histories";
import type { Category } from "@/types/category";
import type { WheelContent } from "@/types/wheel-contents";
import type { Streak } from "@/types/spin-histories";

const { Title, Text } = Typography;

export default function SpinPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    preselectedCategory,
  );
  const [items, setItems] = useState<WheelContent[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<WheelContent | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  // Category CRUD
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm] = Form.useForm();
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Item CRUD
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WheelContent | null>(null);
  const [itemForm] = Form.useForm();
  const [itemSubmitting, setItemSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [catRes, streakRes] = await Promise.all([
          categoriesApi.getAll(),
          spinHistoryApi.getStreak().catch(() => ({ data: { data: [] } })),
        ]);
        setCategories(catRes.data.data);
        setStreaks(streakRes.data.data);

        // Auto-load items if category preselected
        if (preselectedCategory) {
          const res = await wheelContentsApi.getForWheel(preselectedCategory);
          setItems(res.data.data);
        }
      } catch {
        message.error("Không thể tải dữ liệu");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchInitial();
  }, [preselectedCategory]);

  const selectedCategoryInfo = categories.find(
    (c) => c._id === selectedCategory,
  );
  const currentStreak = streaks.find(
    (s) => s.categoryId?._id === selectedCategory,
  );

  const handleSelectCategory = async (catId: string) => {
    setSelectedCategory(catId);
    setResult(null);
    setRotation(0);
    setLoadingItems(true);
    try {
      const res = await wheelContentsApi.getForWheel(catId);
      setItems(res.data.data);
    } catch {
      message.error("Không thể tải lựa chọn");
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // ── Category CRUD handlers ──
  const handleCreateCategory = async (values: any) => {
    const hexColor =
      typeof values.color === "string"
        ? values.color
        : values.color?.toHexString() || "#7C3AED";
    try {
      setCatSubmitting(true);
      const res = await categoriesApi.create({ ...values, color: hexColor });
      const newCat = res.data.data;
      setCategories((prev) => [...prev, newCat]);
      setSelectedCategory(newCat._id);
      handleSelectCategory(newCat._id);
      setShowCatModal(false);
      catForm.resetFields();
      message.success("Tạo danh mục thành công");
    } catch {
      message.error("Tạo danh mục thất bại");
    } finally {
      setCatSubmitting(false);
    }
  };

  // ── Item CRUD handlers ──
  const handleOpenAddItem = () => {
    setEditingItem(null);
    itemForm.resetFields();
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: WheelContent) => {
    setEditingItem(item);
    itemForm.setFieldsValue({
      label: item.label,
      description: item.description,
      color: item.color,
      weight: item.weight,
    });
    setShowItemModal(true);
  };

  const handleSaveItem = async (values: any) => {
    if (!selectedCategory) return;
    const hexColor =
      typeof values.color === "string"
        ? values.color
        : values.color?.toHexString() || "#7C3AED";

    const formData = new FormData();
    formData.append("label", values.label);
    formData.append("color", hexColor);
    formData.append("weight", String(values.weight || 1));
    formData.append("categoryId", selectedCategory);
    if (values.description) formData.append("description", values.description);

    try {
      setItemSubmitting(true);
      if (editingItem) {
        await wheelContentsApi.update(editingItem._id, formData);
        message.success("Cập nhật thành công");
      } else {
        await wheelContentsApi.create(formData);
        message.success("Thêm lựa chọn thành công");
      }
      setShowItemModal(false);
      // Reload items
      const res = await wheelContentsApi.getForWheel(selectedCategory);
      setItems(res.data.data);
    } catch {
      message.error("Thao tác thất bại");
    } finally {
      setItemSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedCategory) return;
    try {
      await wheelContentsApi.delete(itemId);
      message.success("Đã xóa");
      const res = await wheelContentsApi.getForWheel(selectedCategory);
      setItems(res.data.data);
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const getWheelGradient = () => {
    if (items.length === 0) {
      return "conic-gradient(#7C3AED 0deg 90deg, #EC4899 90deg 180deg, #F59E0B 180deg 270deg, #10B981 270deg 360deg)";
    }
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const parts: string[] = [];
    let current = 0;
    items.forEach((item) => {
      const angle = (item.weight / totalWeight) * 360;
      parts.push(`${item.color} ${current}deg ${current + angle}deg`);
      current += angle;
    });
    return `conic-gradient(${parts.join(", ")})`;
  };

  const handleSpin = () => {
    if (isSpinning || items.length < 2) return;
    setIsSpinning(true);
    setResult(null);

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    let selectedIndex = 0;
    for (let i = 0; i < items.length; i++) {
      rand -= items[i].weight;
      if (rand <= 0) {
        selectedIndex = i;
        break;
      }
    }

    let targetAngle = 0;
    for (let i = 0; i < selectedIndex; i++) {
      targetAngle += (items[i].weight / totalWeight) * 360;
    }
    targetAngle += ((items[selectedIndex].weight / totalWeight) * 360) / 2;

    const spins = 360 * 5;
    const stopAngle = 360 - targetAngle;
    const totalRotation = rotation + spins + stopAngle;
    setRotation(totalRotation);

    setTimeout(() => {
      setResult(items[selectedIndex]);
      setIsSpinning(false);
    }, 4200);
  };

  const handleAccept = async () => {
    if (!result || !selectedCategory) return;
    try {
      await spinHistoryApi.create({
        categoryId: selectedCategory,
        selectedContentId: result._id,
      });
      // Refresh streak
      const streakRes = await spinHistoryApi.getStreak();
      setStreaks(streakRes.data.data);
      message.success(`Đã chấp nhận: ${result.label}`);
    } catch {
      message.error("Lưu kết quả thất bại, vui lòng thử lại");
    }
    setResult(null);
  };

  if (loadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 px-4 py-6 text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeftOutlined />
            <span className="text-sm font-medium">Trang chủ</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm text-white/60 hover:text-white font-medium transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/categories"
              className="text-sm text-white/60 hover:text-white font-medium transition-colors"
            >
              Quản lý danh mục
            </Link>
            {user && (
              <Button
                danger
                type="primary"
                size="small"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Đăng xuất
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Cá nhân</h1>
          <p className="text-white/50 text-sm">
            Xem lại lịch sử, theo dõi thành tích và quản lý thông tin cá nhân
          </p>
        </div>
        {user && (
          <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 max-w-md mx-auto text-left space-y-3">
            <div>
              <span className="text-white/60 text-sm">Tên</span>
              <p className="font-semibold text-lg">{user.name}</p>
            </div>

            <div>
              <span className="text-white/60 text-sm">Email</span>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <span className="text-white/60 text-sm">Role</span>
              <p className="font-semibold capitalize">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
