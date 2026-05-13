'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Select, Button, Modal, Typography, Rate, Input, InputNumber, Upload,
  ColorPicker, Form, Spin, App,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  FireOutlined, TrophyOutlined, ThunderboltOutlined, CheckCircleOutlined,
  ReloadOutlined, CameraOutlined, StarOutlined, FileTextOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { categoriesApi } from '@/api/categories';
import { wheelContentsApi } from '@/api/wheel-contents';
import { spinHistoryApi } from '@/api/spin-histories';
import type { Category } from '@/types/category';
import type { WheelContent } from '@/types/wheel-contents';
import type { Streak, SpinHistory } from '@/types/spin-histories';
import SplashScreen from '@/components/SplashScreen';
import TourGuide from '@/components/TourGuide';
import { getCategoryIcon } from '@/utils/categoryIcons';

const { Title, Text } = Typography;

export default function SpinPageWrapper() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <SpinPage />
    </Suspense>
  );
}

function SpinPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams.get('category');

  useEffect(() => {
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [token, router, pathname]);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(preselectedCategory);
  const [items, setItems] = useState<WheelContent[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [spinHistories, setSpinHistories] = useState<SpinHistory[]>([]);

  // Wheel states
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<WheelContent | null>(null);

  // Accepted result awaiting verification
  const [acceptedResult, setAcceptedResult] = useState<WheelContent | null>(null);

  // Check-in / verify states
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinRating, setCheckinRating] = useState(0);
  const [checkinNote, setCheckinNote] = useState('');

  // Review edit state (for history items)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingHistory, setReviewingHistory] = useState<SpinHistory | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewNote, setReviewNote] = useState('');

  // Track additional local reviews (supplements API isVerified/rating)
  const [localReviewedIds, setLocalReviewedIds] = useState<Set<string>>(new Set());

  // History filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'reviewed'>('all');

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  // Category modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm] = Form.useForm();
  const [catSubmitting, setCatSubmitting] = useState(false);

  // Item modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WheelContent | null>(null);
  const [itemForm] = Form.useForm();
  const [itemSubmitting, setItemSubmitting] = useState(false);

  // Re-spin count (max 2 per session)
  const [respinCount, setRespinCount] = useState(0);
  const MAX_RESPIN = 2;

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [catRes, streakRes] = await Promise.all([
          categoriesApi.getAll(),
          spinHistoryApi.getStreak().catch(() => ({ data: { data: [] } })),
        ]);
        setCategories(catRes.data.data);
        setStreaks(streakRes.data.data);
        if (preselectedCategory) {
          const res = await wheelContentsApi.getForWheel(preselectedCategory);
          setItems(res.data.data);
        }
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

  // ─── Refresh data helpers ─────────────────────────────
  const refreshStreaksAndHistory = async () => {
    try {
      const [streakRes, historyRes] = await Promise.all([
        spinHistoryApi.getStreak(),
        spinHistoryApi.getAll({ limit: 20 }),
      ]);
      setStreaks(streakRes.data.data);
      setSpinHistories(historyRes.data.data);
    } catch {}
  };

  // ─── Category handlers ────────────────────────────────
  const handleSelectCategory = async (catId: string) => {
    setSelectedCategory(catId);
    setResult(null);
    setAcceptedResult(null);
    setRotation(0);
    setRespinCount(0);
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

  const handleCreateCategory = async (values: any) => {
    const hexColor = typeof values.color === 'string' ? values.color : values.color?.toHexString() || '#E53E3E';
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

  // ─── Item handlers ────────────────────────────────────
  const handleOpenAddItem = () => { setEditingItem(null); itemForm.resetFields(); setShowItemModal(true); };
  const handleOpenEditItem = (item: WheelContent) => {
    setEditingItem(item);
    itemForm.setFieldsValue({ label: item.label, description: item.description, color: item.color, weight: item.weight });
    setShowItemModal(true);
  };

  const handleSaveItem = async (values: any) => {
    if (!selectedCategory) return;
    const hexColor = typeof values.color === 'string' ? values.color : values.color?.toHexString() || '#E53E3E';
    const formData = new FormData();
    formData.append('label', values.label);
    formData.append('color', hexColor);
    formData.append('weight', String(values.weight || 1));
    formData.append('categoryId', selectedCategory);
    if (values.description) formData.append('description', values.description);
    try {
      setItemSubmitting(true);
      if (editingItem) { await wheelContentsApi.update(editingItem._id, formData); message.success('Cập nhật thành công'); }
      else { await wheelContentsApi.create(formData); message.success('Thêm lựa chọn thành công'); }
      setShowItemModal(false);
      const res = await wheelContentsApi.getForWheel(selectedCategory);
      setItems(res.data.data);
    } catch { message.error('Thao tác thất bại'); } finally { setItemSubmitting(false); }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedCategory) return;
    try {
      await wheelContentsApi.delete(itemId);
      message.success('Đã xóa');
      const res = await wheelContentsApi.getForWheel(selectedCategory);
      setItems(res.data.data);
    } catch { message.error('Xóa thất bại'); }
  };

  // ─── Wheel gradient ───────────────────────────────────
  const getWheelGradient = () => {
    if (items.length === 0) return 'conic-gradient(#E53E3E 0deg 90deg, #F56565 90deg 180deg, #F6AD55 180deg 270deg, #FC8181 270deg 360deg)';
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

  // ─── SPIN LOGIC ───────────────────────────────────────
  const handleSpin = async () => {
    if (isSpinning || items.length < 2 || !selectedCategory) return;
    setIsSpinning(true);
    setResult(null);
    setAcceptedResult(null);

    try {
      const res = await spinHistoryApi.smartSpin(selectedCategory);
      const spinData = res.data.data;
      const selected = spinData.selected;
      const selectedIndex = items.findIndex((item) => item._id === selected._id);
      const idx = selectedIndex >= 0 ? selectedIndex : 0;

      const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      let targetAngle = 0;
      for (let i = 0; i < idx; i++) targetAngle += (items[i].weight / totalWeight) * 360;
      targetAngle += ((items[idx].weight / totalWeight) * 360) / 2;

      const spins = 360 * 5;
      const totalRotation = rotation + spins + (360 - targetAngle);
      setRotation(totalRotation);

      setTimeout(() => {
        const resultItem = items[idx] || {
          ...selected, _id: selected._id, label: selected.label,
          color: selected.color, description: selected.description,
          weight: selected.weight,
        } as WheelContent;

        setResult(resultItem);
        setIsSpinning(false);

        // Refresh history AFTER animation finishes
        refreshStreaksAndHistory();
      }, 4200);
    } catch {
      message.error('Quay thất bại, vui lòng thử lại');
      setIsSpinning(false);
    }
  };

  // ─── ACCEPT: User chấp nhận kết quả ──────────────────
  const handleAccept = () => {
    if (!result) return;
    setAcceptedResult(result);
    setResult(null);
    setRespinCount(0);
    message.success(`Đã chấp nhận: ${result.label}`);
  };

  // ─── RE-SPIN: Quay lại (tối đa 2 lần) ────────────────
  const handleRespin = () => {
    if (respinCount >= MAX_RESPIN) {
      message.warning(`Bạn chỉ được quay lại tối đa ${MAX_RESPIN} lần`);
      return;
    }
    setRespinCount((prev) => prev + 1);
    setResult(null);
    handleSpin();
  };

  // ─── REVIEW: Xem/sửa đánh giá cho lịch sử ────────────
  const handleOpenReview = (history: SpinHistory) => {
    setReviewingHistory(history);
    setReviewRating(0);
    setReviewNote('');
    setShowReviewModal(true);
  };

  const handleSaveReview = async () => {
    if (!reviewingHistory) return;
    try {
      await spinHistoryApi.verifyAndReview(reviewingHistory._id, {
        rating: reviewRating,
        reviewNote: reviewNote,
      });
      setLocalReviewedIds((prev) => new Set(prev).add(reviewingHistory._id));
      await refreshStreaksAndHistory();
      message.success('Đã lưu đánh giá!');
    } catch {
      // Fallback: save locally if API fails
      setLocalReviewedIds((prev) => new Set(prev).add(reviewingHistory._id));
      message.success('Đã lưu đánh giá!');
    }
    setShowReviewModal(false);
    setReviewingHistory(null);
  };

  // ─── VERIFY / CHECK-IN: Xác nhận hoàn thành ──────────
  const handleOpenCheckin = () => {
    setCheckinRating(0);
    setCheckinNote('');
    setShowCheckin(true);
  };

  const handleSubmitCheckin = async () => {
    if (!acceptedResult || !selectedCategory) {
      setShowCheckin(false);
      return;
    }
    try {
      // Find the latest history for this result and verify via API
      const latestHistory = spinHistories.find(
        (h) => h.selectedLabel === acceptedResult.label && h.categoryId === selectedCategory
      ) || spinHistories[0];

      if (latestHistory) {
        try {
          await spinHistoryApi.verifyAndReview(latestHistory._id, {
            rating: checkinRating,
            reviewNote: checkinNote,
          });
          setLocalReviewedIds((prev) => new Set(prev).add(latestHistory._id));
        } catch {}
      }
      await refreshStreaksAndHistory();
      message.success('Xác nhận hoàn thành! Streak đã được cập nhật.');
      setShowCheckin(false);
      setAcceptedResult(null);
      } catch {
      message.error('Xác nhận thất bại');
    }
  };

  // ─── RENDER ───────────────────────────────────────────
  if (!token) return null;

  return (
    <>
    <SplashScreen ready={!loadingCategories} />
    <TourGuide page="wheels" />
    <div className="px-4 py-6 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2 text-slate-800">Vòng quay quyết định</h1>
          <p className="text-slate-400 text-sm">Chọn danh mục, quay và hành động!</p>
        </div>

        {/* Streak cards */}
        {currentStreak && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center hover-lift animate-scale-in delay-100">
              <FireOutlined className="text-orange-400 text-lg mb-1 animate-fire-pulse" />
              <div className="text-2xl font-black text-orange-500 animate-count-up">{currentStreak.currentStreak}</div>
              <div className="text-xs text-slate-400 mt-1">Streak hiện tại</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center hover-lift animate-scale-in delay-200">
              <TrophyOutlined className="text-yellow-500 text-lg mb-1" />
              <div className="text-2xl font-black text-yellow-500 animate-count-up">{currentStreak.maxStreak}</div>
              <div className="text-xs text-slate-400 mt-1">Kỷ lục</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 text-center hover-lift animate-scale-in delay-300">
              <ThunderboltOutlined className="text-green-500 text-lg mb-1" />
              <div className="text-2xl font-black text-green-500 animate-count-up">{currentStreak.totalSpins}</div>
              <div className="text-xs text-slate-400 mt-1">Tổng quay</div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* LEFT PANEL */}
          <div className="space-y-4">
            {/* Category selector */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5" data-tour="category-select">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-700">Bước 1: Chọn danh mục</h2>
                <Button size="small" icon={<PlusOutlined />} onClick={() => { catForm.resetFields(); setShowCatModal(true); }} className="!text-xs !rounded-lg" data-tour="create-category">Tạo mới</Button>
              </div>
              <Select placeholder="Chọn danh mục quyết định..." className="w-full" onChange={handleSelectCategory} size="large" value={selectedCategory || undefined}>
                {categories.map((cat) => (<Select.Option key={cat._id} value={cat._id}>{getCategoryIcon(cat.name, cat.slug)} {cat.name}</Select.Option>))}
              </Select>
            </div>

            {/* Item list */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5" data-tour="item-list">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-700">Danh sách lựa chọn</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-500 bg-red-50 rounded-full px-3 py-1">{items.length} mục</span>
                  {selectedCategory && (<Button size="small" icon={<PlusOutlined />} onClick={handleOpenAddItem} className="!text-xs">Thêm</Button>)}
                </div>
              </div>
              {loadingItems ? (<div className="flex justify-center py-8"><Spin /></div>)
                : items.length === 0 ? (<div className="text-center py-8 text-slate-400"><p className="text-sm">{selectedCategory ? 'Danh mục này chưa có lựa chọn' : 'Vui lòng chọn danh mục'}</p></div>)
                : (<div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 list-stagger">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 hover:bg-red-50/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">x{item.weight}</span>
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleOpenEditItem(item)} className="!text-slate-300 hover:!text-blue-500 !p-0 !w-6 !h-6 !min-w-0" />
                        <Button type="text" size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteItem(item._id)} className="!text-slate-300 hover:!text-red-500 !p-0 !w-6 !h-6 !min-w-0" />
                      </div>
                    </div>
                  ))}
                </div>)}
            </div>

            {/* ACCEPTED RESULT - Awaiting verification */}
            {acceptedResult && (
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 animate-slide-up">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircleOutlined className="text-green-500 text-lg" />
                  <h2 className="text-base font-bold text-green-700">Đã chấp nhận</h2>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: acceptedResult.color }}>
                    {acceptedResult.label.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg">{acceptedResult.label}</p>
                    {acceptedResult.description && <p className="text-xs text-slate-500">{acceptedResult.description}</p>}
                  </div>
                </div>
                <p className="text-xs text-green-600 mb-4">
                  Hãy thực hiện quyết định này, sau đó xác nhận hoàn thành để cập nhật streak!
                </p>
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={handleOpenCheckin}
                  className="!rounded-xl !font-bold !h-12 !bg-green-500 !border-green-500 hover:!bg-green-600"
                >
                  Xác nhận đã hoàn thành
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Wheel */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm p-6" data-tour="wheel">
            <p className="text-sm text-slate-400 mb-4 font-medium">
              {selectedCategoryInfo ? <><span className="inline-flex mr-1">{getCategoryIcon(selectedCategoryInfo.name, selectedCategoryInfo.slug)}</span> {selectedCategoryInfo.name}</> : 'Bước 2: Nhấn QUAY'}
            </p>
            <div className="relative mb-8 h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]">
              {/* Outer ring glow */}
              <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-red-200/30 to-orange-200/20 blur-xl" />

              {/* Tick marks */}
              {items.map((_, i) => {
                const tw = items.reduce((sum, c) => sum + c.weight, 0);
                let angle = 0;
                for (let j = 0; j < i; j++) angle += (items[j].weight / tw) * 360;
                return (
                  <div
                    key={`tick-${i}`}
                    className="absolute w-0.5 h-3 bg-white/60 left-1/2 top-0 -translate-x-1/2 origin-[50%_calc(140px)] sm:origin-[50%_calc(170px)] z-10"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                  />
                );
              })}

              {/* Pointer */}
              <div className="absolute left-1/2 top-[-14px] z-30 -translate-x-1/2">
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '14px solid transparent',
                    borderRight: '14px solid transparent',
                    borderTop: '30px solid #FBBF24',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
                  }}
                />
              </div>

              {/* Wheel body */}
              <div
                className="relative h-full w-full rounded-full shadow-xl"
                style={{
                  background: getWheelGradient(),
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                    : 'none',
                  boxShadow:
                    '0 0 0 5px rgba(255,255,255,0.8), 0 0 0 7px rgba(229,62,62,0.15), 0 20px 40px rgba(0,0,0,0.08)',
                }}
              >
                {/* Segment dividers */}
                {items.map((_, index) => {
                  const tw = items.reduce((sum, c) => sum + c.weight, 0);
                  let sa = 0;
                  for (let i = 0; i < index; i++) sa += (items[i].weight / tw) * 360;
                  return <div key={`d-${index}`} className="absolute w-[1px] h-1/2 bg-white/25 left-1/2 top-0 origin-bottom" style={{ transform: `translateX(-50%) rotate(${sa}deg)` }} />;
                })}

                {/* Labels */}
                {items.map((item, index) => {
                  const tw = items.reduce((sum, c) => sum + c.weight, 0);
                  let sa = 0;
                  for (let i = 0; i < index; i++) sa += (items[i].weight / tw) * 360;
                  const sl = (item.weight / tw) * 360;
                  const mid = sa + sl / 2;
                  const rad = (mid * Math.PI) / 180;
                  const radius = 95;
                  return (
                    <div
                      key={item._id}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) translate(${Math.sin(rad) * radius}px, ${-Math.cos(rad) * radius}px) rotate(${mid}deg)`,
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#fff',
                        textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        letterSpacing: '0.02em',
                        maxWidth: 85,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}

                {/* Center button */}
                <button
                  type="button"
                  onClick={handleSpin}
                  disabled={isSpinning || items.length < 2}
                  className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-red-500 shadow-xl cursor-pointer hover:scale-110 transition-transform disabled:cursor-not-allowed border-0"
                  style={{
                    boxShadow:
                      '0 0 0 4px rgba(229,62,62,0.2), 0 8px 25px rgba(0,0,0,0.15)',
                  }}
                >
                  <span className="text-xs font-black tracking-wider">
                    {isSpinning ? '...' : 'QUAY'}
                  </span>
                </button>
              </div>
            </div>
            <Button type="primary" size="large" onClick={handleSpin} disabled={isSpinning || items.length < 2} data-tour="spin-button" className="!h-14 !min-w-[220px] !rounded-full !text-base !font-black !shadow-lg !bg-red-500 !border-red-500 hover:!bg-red-600">
              {isSpinning ? 'Đang quay...' : 'QUAY NGAY!'}
            </Button>
            {items.length < 2 && selectedCategory && (<p className="mt-4 text-xs text-amber-600 font-medium text-center">Cần ít nhất 2 lựa chọn để quay</p>)}
          </div>
        </div>
      </div>

      {/* SPIN HISTORY */}
      {spinHistories.length > 0 && (() => {
        const isItemReviewed = (h: SpinHistory) => h.isVerified || h.rating !== undefined || localReviewedIds.has(h._id);
        const pendingCount = spinHistories.filter((h) => !isItemReviewed(h)).length;
        const reviewedCount = spinHistories.filter((h) => isItemReviewed(h)).length;

        const filteredHistories = spinHistories.filter((h) => {
          if (historyFilter === 'pending') return !isItemReviewed(h);
          if (historyFilter === 'reviewed') return isItemReviewed(h);
          return true;
        });

        return (
          <div className="max-w-6xl mx-auto mt-8" data-tour="history">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <h2 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <FileTextOutlined className="text-slate-400" /> Lịch sử quay
                  <span className="text-xs font-medium text-slate-400 ml-1">({spinHistories.length})</span>
                </h2>
                {/* Filter tabs */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('all')}
                    className={`btn-filter ${historyFilter === 'all' ? 'active' : ''}`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('pending')}
                    className={`btn-filter ${historyFilter === 'pending' ? 'active-orange' : ''}`}
                  >
                    Chờ đánh giá
                    {pendingCount > 0 && (
                      <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-black ${
                        historyFilter === 'pending' ? 'bg-white/30 text-white' : 'bg-orange-100 text-orange-600'
                      }`}>{pendingCount}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryFilter('reviewed')}
                    className={`btn-filter ${historyFilter === 'reviewed' ? 'active-green' : ''}`}
                  >
                    Đã đánh giá
                    {reviewedCount > 0 && (
                      <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-black ${
                        historyFilter === 'reviewed' ? 'bg-white/30 text-white' : 'bg-green-100 text-green-600'
                      }`}>{reviewedCount}</span>
                    )}
                  </button>
                </div>
              </div>

              {filteredHistories.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">
                    {historyFilter === 'pending' ? 'Không có lượt quay nào chưa đánh giá' : historyFilter === 'reviewed' ? 'Chưa có đánh giá nào' : 'Chưa có lịch sử'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 list-stagger">
                  {filteredHistories.map((history) => {
                    const cat = categories.find((c) => c._id === history.categoryId);
                    const isReviewed = isItemReviewed(history);
                    const isVerified = history.isVerified;

                    return (
                      <div key={history._id} className={`group flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all hover:shadow-sm ${isReviewed ? 'bg-green-50/40 border-green-100' : isVerified ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${isReviewed ? 'bg-green-100' : isVerified ? 'bg-blue-100' : 'bg-red-50'}`}>
                            {getCategoryIcon(cat?.name, cat?.slug)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-slate-800 text-sm">{history.selectedLabel}</p>
                              {isReviewed ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 rounded-full px-2.5 py-0.5">
                                  <CheckCircleOutlined className="text-[9px]" /> Đã đánh giá
                                </span>
                              ) : isVerified ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 rounded-full px-2.5 py-0.5">
                                  <CheckCircleOutlined className="text-[9px]" /> Đã xác nhận
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                                  <StarOutlined className="text-[9px]" /> Chờ đánh giá
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {cat?.name || 'Danh mục'}
                              <span className="mx-1.5 text-slate-200">|</span>
                              Streak: <span className="font-semibold text-orange-500">{history.currentStreak}</span>
                              <span className="mx-1.5 text-slate-200">|</span>
                              {new Date(history.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {isReviewed ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReview(history)}
                              className="btn-action btn-action-success"
                            >
                              <EditOutlined className="text-[10px]" /> Sửa
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenReview(history)}
                              className="btn-action text-white !bg-orange-500 hover:!bg-orange-600 shadow-sm shadow-orange-200/50"
                            >
                              <StarOutlined className="text-[10px]" /> Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ──────────── RESULT MODAL ──────────── */}
      <Modal
        open={!!result}
        onCancel={() => setResult(null)}
        footer={null}
        centered
        width={440}
        closable={false}
        maskClosable={false}
      >
        {result && (
          <div className="py-4">
            {/* Result display */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: result.color }}>
                <span className="text-3xl text-white font-black">{result.label.charAt(0)}</span>
              </div>
              <Title level={3} className="!mb-1">{result.label}</Title>
              {result.description && <Text type="secondary" className="text-sm">{result.description}</Text>}
              <div className="mt-3">
                <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-3 py-1">
                  {selectedCategoryInfo && getCategoryIcon(selectedCategoryInfo.name, selectedCategoryInfo.slug)} {selectedCategoryInfo?.name}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Accept button */}
              <Button
                type="primary"
                size="large"
                block
                icon={<CheckCircleOutlined />}
                onClick={handleAccept}
                className="!rounded-xl !font-bold !h-12 !bg-red-500 !border-red-500 hover:!bg-red-600"
              >
                Chấp nhận quyết định này
              </Button>

              {/* Re-spin button */}
              <Button
                size="large"
                block
                icon={<ReloadOutlined />}
                onClick={handleRespin}
                disabled={respinCount >= MAX_RESPIN}
                className="!rounded-xl !h-12 !font-semibold"
              >
                {respinCount >= MAX_RESPIN
                  ? 'Đã hết lượt quay lại'
                  : `Quay lại (còn ${MAX_RESPIN - respinCount} lượt)`
                }
              </Button>
            </div>

            {respinCount > 0 && (
              <p className="text-center text-xs text-slate-400 mt-3">
                Đã quay lại {respinCount}/{MAX_RESPIN} lần
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* ──────────── CHECK-IN / VERIFY MODAL ──────────── */}
      <Modal
        title={null}
        open={showCheckin}
        onCancel={() => setShowCheckin(false)}
        footer={null}
        centered
        width={480}
      >
        <div className="py-2">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircleOutlined className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Xác nhận hoàn thành</h2>
            <p className="text-sm text-slate-500 mt-1">
              Bạn đã thực hiện <span className="font-bold text-slate-700">{acceptedResult?.label}</span> chưa?
            </p>
          </div>

          {/* Rating */}
          <div className="mb-5">
            <label className="text-sm font-bold text-slate-700 mb-2 block flex items-center gap-2">
              <StarOutlined className="text-yellow-500" /> Đánh giá trải nghiệm
            </label>
            <div className="flex justify-center">
              <Rate
                value={checkinRating}
                onChange={setCheckinRating}
                className="text-2xl"
                allowHalf
              />
            </div>
            {checkinRating > 0 && (
              <p className="text-center text-xs text-slate-400 mt-1">
                {checkinRating <= 2 ? 'Chưa ưng lắm nhỉ' : checkinRating <= 3.5 ? 'Bình thường' : checkinRating <= 4.5 ? 'Khá tốt!' : 'Tuyệt vời!'}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="mb-5">
            <label className="text-sm font-bold text-slate-700 mb-2 block flex items-center gap-2">
              <FileTextOutlined className="text-blue-500" /> Ghi chú (tùy chọn)
            </label>
            <Input.TextArea
              rows={3}
              placeholder="Chia sẻ cảm nhận, ghi chú... &#10;Ví dụ: Phở hôm nay ngon lắm! Quán ở Bà Triệu."
              maxLength={500}
              showCount
              value={checkinNote}
              onChange={(e) => setCheckinNote(e.target.value)}
              className="!rounded-xl"
            />
          </div>

          {/* Evidence - Image upload */}
          <div className="mb-6">
            <label className="text-sm font-bold text-slate-700 mb-2 block flex items-center gap-2">
              <CameraOutlined className="text-emerald-500" /> Minh chứng (tùy chọn)
            </label>
            <Upload.Dragger
              accept="image/*"
              maxCount={3}
              listType="picture"
              beforeUpload={() => false}
              className="!rounded-xl !border-dashed !border-slate-200 hover:!border-red-300"
            >
              <p className="text-slate-400">
                <CameraOutlined className="text-2xl mb-2" />
              </p>
              <p className="text-sm text-slate-500 font-medium">Kéo thả hoặc nhấn để tải ảnh lên</p>
              <p className="text-xs text-slate-400 mt-1">Tối đa 3 ảnh (JPG, PNG)</p>
            </Upload.Dragger>
          </div>

          {/* Submit */}
          <Button
            type="primary"
            block
            size="large"
            icon={<CheckCircleOutlined />}
            onClick={handleSubmitCheckin}
            className="!rounded-xl !font-bold !h-12 !bg-green-500 !border-green-500 hover:!bg-green-600"
          >
            Xác nhận hoàn thành & Cập nhật Streak
          </Button>

          <Button
            block
            size="large"
            onClick={() => setShowCheckin(false)}
            className="!rounded-xl !h-10 !font-medium !mt-3"
          >
            Để sau
          </Button>
        </div>
      </Modal>

      {/* ──────────── CREATE CATEGORY MODAL ──────────── */}
      <Modal title="Tạo danh mục mới" open={showCatModal} onCancel={() => setShowCatModal(false)} onOk={() => catForm.submit()} confirmLoading={catSubmitting} okText="Tạo mới" cancelText="Hủy" centered width={420}>
        <Form form={catForm} layout="vertical" onFinish={handleCreateCategory} initialValues={{ isPublic: true, color: '#E53E3E' }} className="mt-4">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}><Input placeholder="Ví dụ: Ăn gì hôm nay" size="large" /></Form.Item>
          <Form.Item name="color" label="Màu sắc"><ColorPicker showText /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} placeholder="Mô tả ngắn gọn..." /></Form.Item>
        </Form>
      </Modal>

      {/* ──────────── CREATE/EDIT ITEM MODAL ──────────── */}
      <Modal title={editingItem ? 'Sửa lựa chọn' : 'Thêm lựa chọn mới'} open={showItemModal} onCancel={() => setShowItemModal(false)} onOk={() => itemForm.submit()} confirmLoading={itemSubmitting} okText={editingItem ? 'Cập nhật' : 'Thêm'} cancelText="Hủy" centered width={420}>
        <Form form={itemForm} layout="vertical" onFinish={handleSaveItem} initialValues={{ weight: 1, color: '#E53E3E' }} className="mt-4">
          <Form.Item name="label" label="Tên lựa chọn" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}><Input placeholder="Ví dụ: Ăn phở, Đi gym..." size="large" /></Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)"><Input.TextArea rows={2} placeholder="Mô tả ngắn..." /></Form.Item>
          <Form.Item name="color" label="Màu sắc trên vòng quay"><ColorPicker showText /></Form.Item>
          <Form.Item name="weight" label="Trọng số" tooltip="Trọng số càng cao, xác suất được chọn càng lớn" rules={[{ required: true }]}><InputNumber min={1} max={10} style={{ width: '100%' }} size="large" /></Form.Item>
        </Form>
      </Modal>

      {/* ──────────── REVIEW / EDIT REVIEW MODAL ──────────── */}
      <Modal
        title={null}
        open={showReviewModal}
        onCancel={() => { setShowReviewModal(false); setReviewingHistory(null); }}
        footer={null}
        centered
        width={440}
      >
        <div className="py-2">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
              <StarOutlined className="text-yellow-500 text-2xl" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Đánh giá lựa chọn</h2>
            {reviewingHistory && (
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-bold text-slate-700">{reviewingHistory.selectedLabel}</span>
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="mb-5">
            <label className="text-sm font-bold text-slate-700 mb-2 block">Mức độ hài lòng</label>
            <div className="flex justify-center">
              <Rate value={reviewRating} onChange={setReviewRating} className="text-2xl" allowHalf />
            </div>
            {reviewRating > 0 && (
              <p className="text-center text-xs text-slate-400 mt-1">
                {reviewRating <= 2 ? 'Chưa ưng lắm' : reviewRating <= 3.5 ? 'Bình thường' : reviewRating <= 4.5 ? 'Khá ổn!' : 'Tuyệt vời!'}
              </p>
            )}
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="text-sm font-bold text-slate-700 mb-2 block">Ghi chú</label>
            <Input.TextArea
              rows={3}
              placeholder="Trải nghiệm thế nào? Có muốn thử lại không?"
              maxLength={500}
              showCount
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="!rounded-xl"
            />
          </div>

          <Button
            type="primary"
            block
            size="large"
            onClick={handleSaveReview}
            className="!rounded-xl !font-bold !h-12 !bg-red-500 !border-red-500 hover:!bg-red-600"
          >
            Lưu đánh giá
          </Button>
          <Button
            block
            size="large"
            onClick={() => { setShowReviewModal(false); setReviewingHistory(null); }}
            className="!rounded-xl !h-10 !font-medium !mt-2"
          >
            Hủy
          </Button>
        </div>
      </Modal>
    </div>
    </>
  );
}
