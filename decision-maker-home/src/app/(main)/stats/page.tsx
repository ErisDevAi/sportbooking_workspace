'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Select, Spin, App, Empty, Modal } from 'antd';
import {
  FireOutlined,
  FireFilled,
  TrophyOutlined,
  TrophyFilled,
  ThunderboltOutlined,
  ThunderboltFilled,
  CheckCircleOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  ClockCircleOutlined,
  FrownOutlined,
  StarFilled,
  SmileOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { spinHistoryApi } from '@/api/spin-histories';
import { categoriesApi } from '@/api/categories';
import { UserOutlined } from '@ant-design/icons';
import SplashScreen from '@/components/SplashScreen';
import type { Streak, SpinHistory } from '@/types/spin-histories';
import type { Category } from '@/types/category';

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);
  return days;
}

function formatMonth(year: number, month: number) {
  return new Date(year, month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
}

export default function StatsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const { message } = App.useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [histories, setHistories] = useState<SpinHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  // Day detail modal
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [token, router, pathname]);

  useEffect(() => {
    if (!token) return;
    const fetchInitial = async () => {
      try {
        const [catRes, streakRes, historyRes] = await Promise.all([
          categoriesApi.getAll(),
          spinHistoryApi.getStreak().catch(() => ({ data: { data: [] } })),
          spinHistoryApi.getAll({ limit: 200 }).catch(() => ({ data: { data: [] } })),
        ]);
        setCategories(catRes.data.data);
        setStreaks(streakRes.data.data);
        setHistories(historyRes.data.data);
      } catch {
        message.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [token]);

  const dateSpinMap = useMemo(() => {
    const map: Record<string, { total: number; verified: number }> = {};
    const filtered = selectedCategory
      ? histories.filter((h) => h.categoryId === selectedCategory)
      : histories;
    filtered.forEach((h) => {
      const day = h.createdAt.slice(0, 10);
      if (!map[day]) map[day] = { total: 0, verified: 0 };
      map[day].total += 1;
      if (h.isVerified) map[day].verified += 1;
    });
    return map;
  }, [histories, selectedCategory]);

  const filteredStreaks = selectedCategory
    ? streaks.filter((s) => s.categoryId?._id === selectedCategory)
    : streaks;

  const totalSpins = filteredStreaks.reduce((sum, s) => sum + s.totalSpins, 0);
  const bestStreak = filteredStreaks.reduce((max, s) => Math.max(max, s.maxStreak), 0);
  const currentBest = filteredStreaks.reduce((max, s) => Math.max(max, s.currentStreak), 0);
  const activeDays = Object.keys(dateSpinMap).length;

  const calendarDays = getCalendarDays(calYear, calMonth);
  const today = now.toISOString().slice(0, 10);

  const earliestDate = useMemo(() => {
    if (histories.length === 0) return null;
    const dates = histories.map((h) => h.createdAt.slice(0, 10)).sort();
    return dates[0];
  }, [histories]);

  // Histories for selected date
  const selectedDateHistories = useMemo(() => {
    if (!selectedDate) return [];
    return histories
      .filter((h) => h.createdAt.slice(0, 10) === selectedDate)
      .filter((h) => !selectedCategory || h.categoryId === selectedCategory);
  }, [selectedDate, histories, selectedCategory]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0); }
    else setCalMonth(calMonth + 1);
  };

  const formatDateVN = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (!token) return null;

  return (
    <>
    <SplashScreen ready={!loading} />
    <div className="px-4 py-6 text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-red-200/50 shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center justify-center sm:justify-start gap-2">
                <FireFilled className="text-orange-500" />
                Streak & Thống kê
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">{user?.name} &middot; {user?.email}</p>
              {user?.createdAt && (
                <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <UserOutlined className="text-red-400" />
                  Thành viên từ {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  <span className="text-slate-300 mx-1">|</span>
                  {(() => {
                    const diff = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                    if (diff === 0) return 'Hôm nay';
                    if (diff === 1) return '1 ngày trước';
                    return `${diff} ngày trước`;
                  })()}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <Select
                placeholder="Tất cả danh mục"
                allowClear
                onChange={(val) => setSelectedCategory(val || null)}
                value={selectedCategory || undefined}
                size="large"
                className="w-48"
              >
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 shadow-sm p-4 text-center">
            <FireFilled className="text-orange-500 text-2xl mb-1" />
            <div className="text-2xl font-black text-orange-500">{currentBest}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Streak hiện tại</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 shadow-sm p-4 text-center">
            <TrophyFilled className="text-yellow-500 text-2xl mb-1" />
            <div className="text-2xl font-black text-yellow-500">{bestStreak}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Kỷ lục</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 shadow-sm p-4 text-center">
            <ThunderboltFilled className="text-emerald-500 text-2xl mb-1" />
            <div className="text-2xl font-black text-emerald-500">{totalSpins}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Tổng lượt quay</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm p-4 text-center">
            <CalendarOutlined className="text-blue-500 text-2xl mb-1" />
            <div className="text-2xl font-black text-blue-500">{activeDays}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Ngày hoạt động</div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 shadow-sm p-4 text-center col-span-2 sm:col-span-1">
            <UserOutlined className="text-rose-500 text-2xl mb-1" />
            <div className="text-2xl font-black text-rose-500">
              {user?.createdAt
                ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24) + 1)
                : 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Ngày tham gia</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 mb-8">
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-5">
            <button type="button" onClick={prevMonth} className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors text-lg font-bold">
              &lsaquo;
            </button>
            <h2 className="text-base font-black text-slate-800 capitalize flex items-center gap-2">
              <CalendarOutlined className="text-red-500" /> {formatMonth(calYear, calMonth)}
            </h2>
            <button type="button" onClick={nextMonth} className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors text-lg font-bold">
              &rsaquo;
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;

              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const data = dateSpinMap[dateStr];
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const hasActivity = data && data.total > 0;
              const hasVerified = data && data.verified > 0;
              const isMissedDay = !isFuture && !hasActivity && earliestDate !== null && dateStr > earliestDate && dateStr < today;
              const isClickable = hasActivity || isMissedDay;

              let bgClass = 'bg-slate-50 text-slate-500';
              let icon: React.ReactNode = null;

              if (isFuture) {
                bgClass = 'bg-slate-50/50 text-slate-300';
              } else if (hasVerified && data.verified >= 3) {
                bgClass = 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-sm shadow-red-200/50';
                icon = <FireFilled className="text-[11px]" />;
              } else if (hasVerified) {
                bgClass = 'bg-gradient-to-br from-red-400 to-orange-400 text-white';
                icon = <CheckCircleFilled className="text-[11px]" />;
              } else if (hasActivity && data.total >= 3) {
                bgClass = 'bg-red-100 text-red-700';
                icon = <RocketOutlined className="text-[11px]" />;
              } else if (hasActivity) {
                bgClass = 'bg-red-50 text-red-600';
                icon = <ThunderboltOutlined className="text-[11px]" />;
              } else if (isMissedDay) {
                bgClass = 'bg-slate-100 text-slate-400';
                icon = <FrownOutlined className="text-[11px] text-slate-300" />;
              }

              return (
                <div
                  key={dateStr}
                  onClick={() => isClickable && setSelectedDate(dateStr)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${bgClass} ${isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''} ${isClickable ? 'cursor-pointer hover:scale-110 hover:shadow-md' : ''}`}
                  title={
                    data
                      ? `${data.total} lượt quay, ${data.verified} xác nhận`
                      : isMissedDay
                        ? 'Ngày không hoạt động'
                        : ''
                  }
                >
                  {icon && <span className="leading-none">{icon}</span>}
                  <span className={icon ? 'text-[10px] leading-none' : ''}>{day}</span>
                  {hasActivity && (
                    <span className="text-[8px] font-black leading-none opacity-75">
                      {data.total}x
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-5 pt-3 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
              <FrownOutlined className="text-slate-300 text-xs" />
              <span className="text-[10px] text-slate-400">Bỏ lỡ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThunderboltOutlined className="text-red-400 text-xs" />
              <span className="text-[10px] text-slate-400">Đã quay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RocketOutlined className="text-red-600 text-xs" />
              <span className="text-[10px] text-slate-400">3+ lượt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircleFilled className="text-red-400 text-xs" />
              <span className="text-[10px] text-slate-400">Xác nhận</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FireFilled className="text-red-500 text-xs" />
              <span className="text-[10px] text-slate-400">3+ xác nhận</span>
            </div>
          </div>
        </div>

        {/* Streak by category */}
        {filteredStreaks.length > 0 ? (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 mb-8">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FireOutlined className="text-orange-500" /> Streak theo danh mục
            </h2>
            <div className="space-y-3">
              {filteredStreaks.map((streak) => (
                <div key={streak.categoryId?._id || 'unknown'} className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shadow-sm">
                      {streak.categoryId?.icon || '📁'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{streak.categoryId?.name || 'Danh mục'}</p>
                      <p className="text-[11px] text-slate-400">
                        Lần cuối: {streak.lastSpinDate ? new Date(streak.lastSpinDate).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-center">
                    <div>
                      <div className="text-lg font-black text-orange-500 flex items-center gap-1">
                        {streak.currentStreak} <FireFilled className="text-xs text-orange-400" />
                      </div>
                      <div className="text-[10px] text-slate-400">Streak</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-yellow-500 flex items-center gap-1">
                        {streak.maxStreak} <TrophyFilled className="text-xs text-yellow-400" />
                      </div>
                      <div className="text-[10px] text-slate-400">Kỷ lục</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-emerald-500 flex items-center gap-1">
                        {streak.totalSpins} <ThunderboltFilled className="text-xs text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-slate-400">Quay</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-8 text-center mb-8">
            <SmileOutlined className="text-4xl text-slate-200 mb-3" />
            <p className="font-bold text-slate-700">Chưa có dữ liệu streak</p>
            <p className="text-sm text-slate-400 mt-1">Quay vòng quay và xác nhận hoàn thành để bắt đầu xây dựng streak!</p>
          </div>
        )}

        {/* Recent verified history */}
        {histories.filter((h) => h.isVerified && (!selectedCategory || h.categoryId === selectedCategory)).length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircleOutlined className="text-green-500" /> Đã hoàn thành gần đây
            </h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {histories
                .filter((h) => h.isVerified && (!selectedCategory || h.categoryId === selectedCategory))
                .slice(0, 20)
                .map((h) => {
                  const cat = categories.find((c) => c._id === h.categoryId);
                  return (
                    <div key={h._id} className="flex items-center justify-between rounded-xl bg-green-50/40 border border-green-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-sm">
                          {cat?.icon || '🎯'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{h.selectedLabel}</p>
                          <p className="text-[11px] text-slate-400">
                            {cat?.name} &middot; {new Date(h.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      {h.rating !== undefined && h.rating > 0 && (
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 rounded-full px-2.5 py-1 flex items-center gap-0.5">
                          <StarFilled /> {h.rating}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Day detail modal */}
      <Modal
        open={!!selectedDate}
        onCancel={() => setSelectedDate(null)}
        footer={null}
        centered
        width={480}
        title={null}
      >
        {selectedDate && (
          <div className="py-2">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <CalendarOutlined className="text-red-500 text-2xl" />
              </div>
              <h2 className="text-lg font-black text-slate-800 capitalize">{formatDateVN(selectedDate)}</h2>
              {selectedDateHistories.length > 0 ? (
                <p className="text-sm text-slate-400 mt-1">
                  {selectedDateHistories.length} lượt quay &middot; {selectedDateHistories.filter((h) => h.isVerified).length} xác nhận
                </p>
              ) : (
                <p className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                  <FrownOutlined className="text-slate-300" /> Không có hoạt động trong ngày này
                </p>
              )}
            </div>

            {selectedDateHistories.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {selectedDateHistories.map((h) => {
                  const cat = categories.find((c) => c._id === h.categoryId);
                  return (
                    <div
                      key={h._id}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                        h.isVerified
                          ? 'bg-green-50/50 border-green-100'
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${h.isVerified ? 'bg-green-100' : 'bg-red-50'}`}>
                          {cat?.icon || '🎯'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{h.selectedLabel}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-slate-400">{cat?.name}</span>
                            <span className="text-slate-200">|</span>
                            <span className="text-[11px] text-slate-400">
                              <ClockCircleOutlined className="mr-0.5" />
                              {new Date(h.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {h.isVerified && (
                              <>
                                <span className="text-slate-200">|</span>
                                <span className="text-[11px] text-green-600 font-semibold flex items-center gap-0.5">
                                  <CheckCircleFilled className="text-[10px]" /> Đã xác nhận
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                        {h.rating !== undefined && h.rating > 0 && (
                          <span className="text-xs font-bold text-yellow-600 bg-yellow-50 rounded-full px-2 py-0.5 flex items-center gap-0.5">
                            <StarFilled className="text-[10px]" /> {h.rating}
                          </span>
                        )}
                        {h.currentStreak > 0 && (
                          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 rounded-full px-2 py-0.5 flex items-center gap-0.5">
                            <FireFilled className="text-[9px]" /> {h.currentStreak}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FrownOutlined className="text-4xl text-slate-200 mb-3" />
                <p className="text-slate-500 text-sm font-medium">Bạn đã bỏ lỡ ngày này</p>
                <p className="text-slate-400 text-xs mt-1">Hãy cố gắng duy trì streak mỗi ngày nhé!</p>
              </div>
            )}

          </div>
        )}
      </Modal>
    </div>
    </>
  );
}
