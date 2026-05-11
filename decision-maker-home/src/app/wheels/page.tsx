'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { categoriesApi } from '@/api/categories';
import { wheelContentsApi } from '@/api/wheel-contents';
import { spinHistoryApi } from '@/api/spin-histories';
import type { Category } from '@/types/category';
import type { WheelContent } from '@/types/wheel-contents';
import type { Streak, SpinHistory } from '@/types/spin-histories';

const { Title, Text } = Typography;

export default function SpinPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900"><Spin size="large" /></div>}>
      <SpinPage />
    </Suspense>
  );
}

function SpinPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get('category');

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(preselectedCategory);
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

  // Spin History
  const [spinHistories, setSpinHistories] = useState<SpinHistory[]>([]);

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

        // Load spin histories
        try {
          const historyRes = await spinHistoryApi.getAll({ limit: 20 });
          setSpinHistories(historyRes.data.data);
        } catch {}

      } catch {
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchInitial();
  }, [preselectedCategory]);

  const selectedCategoryInfo = categories.find((c) => c._id === selectedCategory);
  const currentStreak = streaks.find((s) => s.categoryId?._id === selectedCategory);

  const handleSelectCategory = async (catId: string) => {
    setSelectedCategory(catId);
    setResult(null);
    setRotation(0);
    setLoadingItems(true);
    try {
      const res = await wheelContentsApi.getForWheel(catId);
      setItems(res.data.data);
    } catch {
      message.error('Không thể tải lựa chọn');
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // ── Category CRUD handlers ──
  const handleCreateCategory = async (values: any) => {
    const hexColor =
      typeof values.color === 'string'
        ? values.color
        : values.color?.toHexString() || '#7C3AED';
    try {
      setCatSubmitting(true);
      const res = await categoriesApi.create({ ...values, color: hexColor });
      const newCat = res.data.data;
      setCategories((prev) => [...prev, newCat]);
      setSelectedCategory(newCat._id);
      handleSelectCategory(newCat._id);
      setShowCatModal(false);
      catForm.resetFields();
      message.success('Tạo danh mục thành công');
    } catch {
      message.error('Tạo danh mục thất bại');
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
      typeof values.color === 'string'
        ? values.color
        : values.color?.toHexString() || '#7C3AED';

    const formData = new FormData();
    formData.append('label', values.label);
    formData.append('color', hexColor);
    formData.append('weight', String(values.weight || 1));
    formData.append('categoryId', selectedCategory);
    if (values.description) formData.append('description', values.description);

    try {
      setItemSubmitting(true);
      if (editingItem) {
        await wheelContentsApi.update(editingItem._id, formData);
        message.success('Cập nhật thành công');
      } else {
        await wheelContentsApi.create(formData);
        message.success('Thêm lựa chọn thành công');
      }
      setShowItemModal(false);
      // Reload items
      const res = await wheelContentsApi.getForWheel(selectedCategory);
      setItems(res.data.data);
    } catch {
      message.error('Thao tác thất bại');
    } finally {
      setItemSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedCategory) return;
    try {
      await wheelContentsApi.delete(itemId);
      message.success('Đã xóa');
      const res = await wheelContentsApi.getForWheel(selectedCategory);
      setItems(res.data.data);
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const getWheelGradient = () => {
    if (items.length === 0) {
      return 'conic-gradient(#7C3AED 0deg 90deg, #EC4899 90deg 180deg, #F59E0B 180deg 270deg, #10B981 270deg 360deg)';
    }
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const parts: string[] = [];
    let current = 0;
    items.forEach((item) => {
      const angle = (item.weight / totalWeight) * 360;
      parts.push(`${item.color} ${current}deg ${current + angle}deg`);
      current += angle;
    });
    return `conic-gradient(${parts.join(', ')})`;
  };

  const handleSpin = async () => {
    if (isSpinning || items.length < 2 || !selectedCategory) return;
    setIsSpinning(true);
    setResult(null);

    try {
      // Smart Random: server chọn kết quả dựa trên thuật toán cooldown + boost
      const res = await spinHistoryApi.smartSpin(selectedCategory);
      const selected = res.data.data.selected;

      // Tìm index của kết quả trong danh sách items để xoay vòng quay đúng vị trí
      const selectedIndex = items.findIndex((item) => item._id === selected._id);
      const idx = selectedIndex >= 0 ? selectedIndex : 0;

      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let targetAngle = 0;
      for (let i = 0; i < idx; i++) {
        targetAngle += (items[i].weight / totalWeight) * 360;
      }
      targetAngle += ((items[idx].weight / totalWeight) * 360) / 2;

      const spins = 360 * 5;
      const stopAngle = 360 - targetAngle;
      const totalRotation = rotation + spins + stopAngle;
      setRotation(totalRotation);

      // Refresh streak & history ngay (server đã ghi)
      const [streakRes, historyRes] = await Promise.all([
        spinHistoryApi.getStreak(),
        spinHistoryApi.getAll({ limit: 20 }),
      ]);
      setStreaks(streakRes.data.data);
      setSpinHistories(historyRes.data.data);

      setTimeout(() => {
        setResult(items[idx] || { ...selected, _id: selected._id, label: selected.label, color: selected.color, description: selected.description, weight: selected.weight });
        setIsSpinning(false);
      }, 4200);
    } catch {
      message.error('Quay thất bại, vui lòng thử lại');
      setIsSpinning(false);
    }
  };

  const handleAccept = async () => {
    if (!result) return;
    message.success(`Đã chấp nhận: ${result.label}`);
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
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeftOutlined />
            <span className="text-sm font-medium">Trang chủ</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/categories" className="text-sm text-white/60 hover:text-white font-medium transition-colors">
              Quản lý danh mục
            </Link>
            {user && (
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="text-sm text-white/40 hover:text-white font-medium transition-colors"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Vòng quay quyết định</h1>
          <p className="text-white/50 text-sm">Chọn danh mục, quay và hành động!</p>
        </div>

        {/* Streak Stats */}
        {currentStreak && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 text-center">
              <div className="text-2xl font-black text-orange-400">{currentStreak.currentStreak}</div>
              <div className="text-xs text-white/50 mt-1">Streak hiện tại</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">{currentStreak.maxStreak}</div>
              <div className="text-xs text-white/50 mt-1">Kỷ lục</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 text-center">
              <div className="text-2xl font-black text-green-400">{currentStreak.totalSpins}</div>
              <div className="text-xs text-white/50 mt-1">Tổng quay</div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* LEFT - Category & Items */}
          <div className="space-y-4">
            {/* Category Selector */}
            <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-white/90">Bước 1: Chọn danh mục</h2>
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => { catForm.resetFields(); setShowCatModal(true); }}
                  className="!text-xs !border-white/20 !text-white/70 !bg-white/10"
                >
                  Tạo mới
                </Button>
              </div>
              <Select
                placeholder="Chọn danh mục quyết định..."
                className="w-full"
                onChange={handleSelectCategory}
                size="large"
                value={selectedCategory || undefined}
                styles={{ popup: { root: { borderRadius: 12 } } }}
              >
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Items List */}
            <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-white/90">Danh sách lựa chọn</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-300 bg-purple-500/20 rounded-full px-3 py-1">
                    {items.length} mục
                  </span>
                  {selectedCategory && (
                    <Button
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={handleOpenAddItem}
                      className="!text-xs !border-white/20 !text-white/70 !bg-white/10"
                    >
                      Thêm
                    </Button>
                  )}
                </div>
              </div>

              {loadingItems ? (
                <div className="flex justify-center py-8"><Spin /></div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <div className="text-3xl mb-2">🧭</div>
                  <p className="text-sm">{selectedCategory ? 'Danh mục này chưa có lựa chọn' : 'Vui lòng chọn danh mục'}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-semibold text-white/90 text-sm">{item.label}</p>
                          {item.description && <p className="text-xs text-white/40">{item.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white/40">x{item.weight}</span>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenEditItem(item)}
                          className="!text-white/30 hover:!text-blue-400 !p-0 !w-6 !h-6 !min-w-0"
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteItem(item._id)}
                          className="!text-white/30 hover:!text-red-400 !p-0 !w-6 !h-6 !min-w-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Wheel */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6">
            <p className="text-sm text-white/40 mb-4 font-medium">
              {selectedCategoryInfo
                ? `${selectedCategoryInfo.icon} ${selectedCategoryInfo.name}`
                : 'Bước 2: Nhấn QUAY'}
            </p>

            {/* Wheel */}
            <div className="relative mb-8 h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]">
              {/* Pointer */}
              <div
                className="absolute left-1/2 top-[-10px] z-20 -translate-x-1/2"
                style={{
                  width: 0, height: 0,
                  borderLeft: '14px solid transparent',
                  borderRight: '14px solid transparent',
                  borderTop: '28px solid #FACC15',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
              />
              <div
                className="relative h-full w-full rounded-full border-[6px] border-white/20 shadow-2xl"
                style={{
                  background: getWheelGradient(),
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
              >
                {/* Labels */}
                {items.map((item, index) => {
                  const totalWeight = items.reduce((sum, c) => sum + c.weight, 0);
                  let startAngle = 0;
                  for (let i = 0; i < index; i++) startAngle += (items[i].weight / totalWeight) * 360;
                  const sliceAngle = (item.weight / totalWeight) * 360;
                  const midAngle = startAngle + sliceAngle / 2;
                  const rad = (midAngle * Math.PI) / 180;
                  const radius = 100;
                  return (
                    <div
                      key={item._id}
                      style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: `translate(-50%, -50%) translate(${Math.sin(rad) * radius}px, ${-Math.cos(rad) * radius}px) rotate(${midAngle}deg)`,
                        fontSize: 11, fontWeight: 800, color: '#fff',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                        whiteSpace: 'nowrap', pointerEvents: 'none',
                        maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
                {/* Center */}
                <div className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-sm font-black text-white shadow-xl">
                  GO
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <Button
              type="primary"
              size="large"
              onClick={handleSpin}
              disabled={isSpinning || items.length < 2}
              className="!h-14 !min-w-[220px] !rounded-full !text-base !font-black !shadow-xl"
              style={{
                background: isSpinning ? undefined : 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                border: 'none',
              }}
            >
              {isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}
            </Button>

            {items.length < 2 && selectedCategory && (
              <p className="mt-4 text-xs text-yellow-400/80 font-medium text-center">
                Cần ít nhất 2 lựa chọn để quay vòng quay
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SPIN HISTORY */}
        {spinHistories.length > 0 && (
          <div className="max-w-6xl mx-auto mt-8">
            <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-5">
              <h2 className="text-base font-bold text-white/90 mb-4">Lịch sử quay</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {spinHistories.map((history) => {
                  const cat = categories.find((c) => c._id === history.categoryId);
                  return (
                    <div
                      key={history._id}
                      className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                          {cat?.icon || '🎯'}
                        </div>
                        <div>
                          <p className="font-semibold text-white/90 text-sm">{history.selectedLabel}</p>
                          <p className="text-xs text-white/40">
                            {cat?.name || 'Danh mục'} &middot; Streak: {history.currentStreak}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-white/30">
                        {new Date(history.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* RESULT MODAL */}
      <Modal open={!!result} onCancel={() => setResult(null)} footer={null} centered width={400}>
        {result && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: result.color }}>
              <span className="text-2xl text-white font-black">!</span>
            </div>
            <Title level={3} className="!mb-1">{result.label}</Title>
            {result.description && <Text type="secondary">{result.description}</Text>}
            <div className="mt-6 space-y-3">
              <Button type="primary" size="large" block onClick={handleAccept} className="!rounded-lg !font-bold !h-12">
                Chấp nhận quyết định
              </Button>
              <Button size="large" block onClick={() => setResult(null)} className="!rounded-lg !h-12">
                Bỏ qua, quay lại
              </Button>
              <Button
                type="link"
                block
                onClick={() => { setResult(null); setShowCheckin(true); }}
              >
                Check-in ngay
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CREATE CATEGORY MODAL */}
      <Modal
        title="Tạo danh mục mới"
        open={showCatModal}
        onCancel={() => setShowCatModal(false)}
        onOk={() => catForm.submit()}
        confirmLoading={catSubmitting}
        okText="Tạo mới"
        cancelText="Hủy"
        centered
        width={420}
      >
        <Form form={catForm} layout="vertical" onFinish={handleCreateCategory} initialValues={{ isPublic: true, color: '#7C3AED' }} className="mt-4">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="Ví dụ: Ăn gì hôm nay" size="large" />
          </Form.Item>
          <Form.Item name="icon" label="Biểu tượng (emoji)">
            <Input placeholder="Ví dụ: 🍔 🎯 📚" size="large" />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* CREATE/EDIT ITEM MODAL */}
      <Modal
        title={editingItem ? 'Sửa lựa chọn' : 'Thêm lựa chọn mới'}
        open={showItemModal}
        onCancel={() => setShowItemModal(false)}
        onOk={() => itemForm.submit()}
        confirmLoading={itemSubmitting}
        okText={editingItem ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        centered
        width={420}
      >
        <Form form={itemForm} layout="vertical" onFinish={handleSaveItem} initialValues={{ weight: 1, color: '#7C3AED' }} className="mt-4">
          <Form.Item name="label" label="Tên lựa chọn" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="Ví dụ: Ăn phở, Đi gym..." size="large" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn..." />
          </Form.Item>
          <Form.Item name="color" label="Màu sắc trên vòng quay">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item name="weight" label="Trọng số" tooltip="Trọng số càng cao, xác suất được chọn càng lớn" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} size="large" />
          </Form.Item>
        </Form>
      </Modal>

      {/* CHECKIN MODAL */}
      <Modal
        title="Check-in xác nhận hoàn thành"
        open={showCheckin}
        onCancel={() => setShowCheckin(false)}
        footer={null}
        centered
      >
        <div className="py-4">
          <p className="text-sm text-slate-500 mb-4">Xác nhận bạn đã thực hiện quyết định này</p>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Đánh giá trải nghiệm</p>
            <Rate />
          </div>
          <Input.TextArea
            rows={3}
            placeholder="Chia sẻ cảm nhận của bạn..."
            maxLength={500}
            showCount
            className="mt-4"
          />
          <Button
            type="primary"
            block
            size="large"
            className="mt-4 !rounded-lg !font-bold !h-12"
            onClick={async () => {
              if (!result || !selectedCategory) {
                setShowCheckin(false);
                return;
              }
              try {
                await spinHistoryApi.create({
                  categoryId: selectedCategory,
                  selectedContentId: result._id,
                });
                const streakRes = await spinHistoryApi.getStreak();
                setStreaks(streakRes.data.data);
                message.success('Check-in thành công!');
              } catch {
                message.error('Check-in thất bại, vui lòng thử lại');
              }
              setShowCheckin(false);
              setResult(null);
            }}
          >
            Hoàn thành Check-in
          </Button>
        </div>
      </Modal>
    </div>
  );
}
