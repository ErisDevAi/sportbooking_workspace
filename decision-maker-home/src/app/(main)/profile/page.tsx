'use client';

import { useEffect, useState } from 'react';
import { App } from 'antd';
import {
  FireOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { spinHistoryApi } from '@/api/spin-histories';
import SplashScreen from '@/components/SplashScreen';
import { getCategoryIcon } from '@/utils/categoryIcons';
import type { Streak, SpinHistory } from '@/types/spin-histories';

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { message } = App.useApp();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [histories, setHistories] = useState<SpinHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.replace(`/login?redirect=${encodeURIComponent(pathname)}`); return; }
    const fetchData = async () => {
      try {
        const [streakRes, historyRes] = await Promise.all([
          spinHistoryApi.getStreak(),
          spinHistoryApi.getAll({ limit: 30 }),
        ]);
        setStreaks(streakRes.data.data);
        setHistories(historyRes.data.data);
      } catch { message.error('Không thể tải dữ liệu'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  if (!token) return null;

  const totalSpins = streaks.reduce((sum, s) => sum + s.totalSpins, 0);
  const bestStreak = streaks.reduce((max, s) => Math.max(max, s.maxStreak), 0);
  const currentBest = streaks.reduce((max, s) => Math.max(max, s.currentStreak), 0);

  return (
    <>
    <SplashScreen ready={!loading} />
    <div className="px-4 py-6 text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-3xl font-black text-white mx-auto mb-4 shadow-lg shadow-red-200/50">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-black text-slate-800">{user?.name || 'Người dùng'}</h1>
          <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 text-center hover-lift animate-scale-in delay-100">
            <FireOutlined className="text-orange-500 text-xl mb-2 animate-fire-pulse" />
            <div className="text-3xl font-black text-orange-500 animate-count-up">{currentBest}</div>
            <div className="text-xs text-slate-400 mt-1">Streak hiện tại</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 text-center hover-lift animate-scale-in delay-200">
            <TrophyOutlined className="text-yellow-500 text-xl mb-2" />
            <div className="text-3xl font-black text-yellow-500 animate-count-up">{bestStreak}</div>
            <div className="text-xs text-slate-400 mt-1">Kỷ lục cao nhất</div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 text-center hover-lift animate-scale-in delay-300">
            <ThunderboltOutlined className="text-green-500 text-xl mb-2" />
            <div className="text-3xl font-black text-green-500 animate-count-up">{totalSpins}</div>
            <div className="text-xs text-slate-400 mt-1">Tổng lượt quay</div>
          </div>
        </div>

        {/* Streaks by Category */}
        {streaks.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 mb-8">
            <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <FireOutlined className="text-orange-500" /> Streak theo danh mục
            </h2>
            <div className="space-y-3">
              {streaks.map((streak) => (
                <div key={streak.categoryId?._id || 'unknown'} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-lg">{getCategoryIcon(streak.categoryId?.name)}</div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{streak.categoryId?.name || 'Danh mục'}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <ClockCircleOutlined /> Quay gần nhất: {streak.lastSpinDate ? new Date(streak.lastSpinDate).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-center">
                    <div><div className="text-lg font-black text-orange-500">{streak.currentStreak}</div><div className="text-[10px] text-slate-400">Streak</div></div>
                    <div><div className="text-lg font-black text-yellow-500">{streak.maxStreak}</div><div className="text-[10px] text-slate-400">Kỷ lục</div></div>
                    <div><div className="text-lg font-black text-green-500">{streak.totalSpins}</div><div className="text-[10px] text-slate-400">Quay</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent History */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <ClockCircleOutlined className="text-red-400" /> Lịch sử quay gần đây
          </h2>
          {histories.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ThunderboltOutlined className="text-4xl mb-3 text-red-200" />
              <p className="text-sm">Chưa có lịch sử quay nào</p>
              <Link href="/wheels" className="text-red-500 text-sm hover:text-red-600 mt-2 inline-flex items-center gap-1">Quay ngay <RightOutlined className="text-[10px]" /></Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {histories.map((h) => (
                <div key={h._id} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{h.selectedLabel}</p>
                      <p className="text-[11px] text-slate-400">Streak: {h.currentStreak}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(h.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 mb-12">
          <Link href="/wheels" className="inline-block rounded-full bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-red-200/50 hover:shadow-xl hover:scale-105 transition-all">
            Quay vòng quay ngay
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
