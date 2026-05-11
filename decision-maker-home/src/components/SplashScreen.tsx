'use client';

import { useState, useEffect, useRef } from 'react';

const QUOTES = [
  'Quyết định tốt nhất là quyết định bạn thực sự hành động.',
  'Đừng sợ sai, hãy sợ không dám thử.',
  'Hôm nay ăn gì? Để vòng quay quyết định!',
  'Mỗi ngày một quyết định, mỗi ngày một trải nghiệm mới.',
  '3 bước đơn giản: Chọn — Quay — Hành động!',
  'Streak 7 ngày bắt đầu từ ngày đầu tiên.',
  'Không có lựa chọn sai, chỉ có trải nghiệm khác nhau.',
  'Giảm suy nghĩ, tăng hành động, sống vui hơn.',
];

const TIPS = [
  'Tạo danh mục riêng để cá nhân hóa vòng quay',
  'Check-in mỗi ngày để giữ chuỗi streak',
  'Điều chỉnh trọng số để món yêu thích xuất hiện nhiều hơn',
  'Chia sẻ kết quả với bạn bè để cùng thử thách',
  'Hệ thống sẽ tự giảm xác suất món bạn vừa chọn gần đây',
];

const MIN_DISPLAY_MS = 2000;

interface SplashScreenProps {
  /** Set to true when data is done loading. Splash stays visible for at least MIN_DISPLAY_MS. */
  ready?: boolean;
}

/**
 * Full-screen splash overlay.
 *
 * Usage:
 *   - No props (Suspense fallback): shows indefinitely until unmounted.
 *   - `ready={boolean}`: shows for at least 2s, then fades out when ready.
 */
export default function SplashScreen({ ready }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const mountTime = useRef(Date.now());
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [progress, setProgress] = useState(0);

  // Progress bar animation (0 → 90% in 2s, then jump to 100% when ready)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // When ready, complete progress and fade out after minimum display time
  useEffect(() => {
    if (ready === undefined) return; // Suspense mode: no auto-dismiss
    if (!ready) return;

    setProgress(100);
    const elapsed = Date.now() - mountTime.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const fadeTimer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 500); // fade-out duration
    }, remaining + 300); // +300ms so user sees 100% bar

    return () => clearTimeout(fadeTimer);
  }, [ready]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #fff 40%, #fef2f2 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute top-16 right-16 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-16 left-16 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-40" />

      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-[-12px] rounded-3xl bg-red-500/10 blur-2xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-300/40">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="animate-spin-slow">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="white" />
              <line x1="12" y1="3" x2="12" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="12" x2="7" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="17" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">
          Decision<span className="text-red-500">Maker</span>
        </h1>
        <p className="text-xs text-slate-400 font-semibold tracking-[0.2em] uppercase mb-8">
          Smart Choices
        </p>

        {/* Progress bar */}
        <div className="w-56 h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 font-medium mb-10">
          {progress < 100 ? 'Đang tải dữ liệu...' : 'Sẵn sàng!'}
        </p>

        {/* Quote */}
        <div className="text-center max-w-sm mb-6 px-4">
          <p className="text-slate-500 font-medium text-sm leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        {/* Tip */}
        <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-2xl px-6 py-3.5 max-w-xs shadow-sm">
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1.5">
            💡 Mẹo nhỏ
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}
