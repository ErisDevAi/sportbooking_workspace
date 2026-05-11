<<<<<<< HEAD
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
=======
'use client';

import { useEffect, useState } from 'react';
import { Spin, Empty, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { spinHistoryApi } from '@/api/spin-histories';
import type { Streak, SpinHistory } from '@/types/spin-histories';

export default function ProfilePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [histories, setHistories] = useState<SpinHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [streakRes, historyRes] = await Promise.all([
          spinHistoryApi.getStreak(),
          spinHistoryApi.getAll({ limit: 30 }),
        ]);
        setStreaks(streakRes.data.data);
        setHistories(historyRes.data.data);
      } catch {
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (!token) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900">
>>>>>>> origin/ErisDevAi
        <Spin size="large" />
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  // Totals
  const totalSpins = streaks.reduce((sum, s) => sum + s.totalSpins, 0);
  const bestStreak = streaks.reduce((max, s) => Math.max(max, s.maxStreak), 0);
  const currentBest = streaks.reduce((max, s) => Math.max(max, s.currentStreak), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 px-4 py-6 text-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeftOutlined />
            <span className="text-sm font-medium">Trang chủ</span>
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="text-sm text-white/40 hover:text-white font-medium transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl font-black mx-auto mb-4 shadow-xl shadow-purple-900/40">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-black">{user?.name || 'Người dùng'}</h1>
          <p className="text-white/50 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-5 text-center">
            <div className="text-3xl font-black text-orange-400">{currentBest}</div>
            <div className="text-xs text-white/50 mt-1">Streak hiện tại</div>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-5 text-center">
            <div className="text-3xl font-black text-yellow-400">{bestStreak}</div>
            <div className="text-xs text-white/50 mt-1">Kỷ lục cao nhất</div>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-5 text-center">
            <div className="text-3xl font-black text-green-400">{totalSpins}</div>
            <div className="text-xs text-white/50 mt-1">Tổng lượt quay</div>
          </div>
        </div>

        {/* Streaks by Category */}
        {streaks.length > 0 && (
          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5 mb-8">
            <h2 className="text-base font-bold text-white/90 mb-4">Streak theo danh mục</h2>
            <div className="space-y-3">
              {streaks.map((streak) => (
                <div
                  key={streak.categoryId?._id || 'unknown'}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-lg">
                      {streak.categoryId?.icon || '📁'}
                    </div>
                    <div>
                      <p className="font-semibold text-white/90 text-sm">{streak.categoryId?.name || 'Danh mục'}</p>
                      <p className="text-[11px] text-white/40">
                        Quay gần nhất: {streak.lastSpinDate ? new Date(streak.lastSpinDate).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-center">
                    <div>
                      <div className="text-lg font-black text-orange-400">{streak.currentStreak}</div>
                      <div className="text-[10px] text-white/30">Streak</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-yellow-400">{streak.maxStreak}</div>
                      <div className="text-[10px] text-white/30">Kỷ lục</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-green-400">{streak.totalSpins}</div>
                      <div className="text-[10px] text-white/30">Quay</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent History */}
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
          <h2 className="text-base font-bold text-white/90 mb-4">Lịch sử quay gần đây</h2>
          {histories.length === 0 ? (
            <div className="text-center py-8 text-white/40">
              <p className="text-3xl mb-2">🎯</p>
              <p className="text-sm">Chưa có lịch sử quay nào</p>
              <Link href="/wheels" className="text-purple-400 text-sm hover:text-purple-300 mt-2 inline-block">
                Quay ngay →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {histories.map((h) => (
                <div
                  key={h._id}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <div>
                      <p className="font-semibold text-white/90 text-sm">{h.selectedLabel}</p>
                      <p className="text-[11px] text-white/40">Streak: {h.currentStreak}</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/30">
                    {new Date(h.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/wheels"
            className="inline-block rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-purple-900/30 hover:shadow-2xl hover:scale-105 transition-all"
          >
            Quay vòng quay ngay
          </Link>
        </div>
>>>>>>> origin/ErisDevAi
      </div>
    </div>
  );
}
