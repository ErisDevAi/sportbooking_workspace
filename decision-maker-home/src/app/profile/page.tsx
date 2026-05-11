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
        <Spin size="large" />
      </div>
    );
  }

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
      </div>
    </div>
  );
}
