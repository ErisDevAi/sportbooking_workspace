'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ThunderboltOutlined,
  TrophyOutlined,
  UserOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ArrowRightOutlined,
  StarOutlined,
  HeartOutlined,
  TeamOutlined,
  CoffeeOutlined,
  ReadOutlined,
  CarOutlined,
  ShareAltOutlined,
  SmileOutlined,
  CalendarOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';
import { categoriesApi } from '@/api/categories';
import { wheelContentsApi } from '@/api/wheel-contents';
import { spinHistoryApi } from '@/api/spin-histories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import type { Category } from '@/types/category';
import type { WheelContent } from '@/types/wheel-contents';

// Fallback data when not logged in
const FALLBACK_CATEGORIES = [
  {
    key: 'food',
    label: 'Ăn gì?',
    icon: <CoffeeOutlined />,
    items: [
      { label: 'Phở', color: '#E53E3E' },
      { label: 'Bún bò', color: '#F56565' },
      { label: 'Cơm tấm', color: '#DD6B20' },
      { label: 'Pizza', color: '#C53030' },
      { label: 'Sushi', color: '#E53E3E' },
      { label: 'Bánh mì', color: '#F6AD55' },
    ],
  },
  {
    key: 'activity',
    label: 'Làm gì?',
    icon: <RocketOutlined />,
    items: [
      { label: 'Đọc sách', color: '#E53E3E' },
      { label: 'Tập gym', color: '#C53030' },
      { label: 'Xem phim', color: '#F56565' },
      { label: 'Nấu ăn', color: '#DD6B20' },
      { label: 'Đi dạo', color: '#F6AD55' },
      { label: 'Chơi game', color: '#FC8181' },
    ],
  },
  {
    key: 'place',
    label: 'Đi đâu?',
    icon: <CarOutlined />,
    items: [
      { label: 'Café', color: '#C53030' },
      { label: 'Công viên', color: '#E53E3E' },
      { label: 'Rạp phim', color: '#F56565' },
      { label: 'Bảo tàng', color: '#DD6B20' },
      { label: 'Hồ Gươm', color: '#F6AD55' },
      { label: 'Mall', color: '#FC8181' },
    ],
  },
  {
    key: 'study',
    label: 'Học gì?',
    icon: <ReadOutlined />,
    items: [
      { label: 'JavaScript', color: '#E53E3E' },
      { label: 'Python', color: '#C53030' },
      { label: 'React', color: '#F56565' },
      { label: 'Design', color: '#DD6B20' },
      { label: 'English', color: '#F6AD55' },
      { label: 'Database', color: '#FC8181' },
    ],
  },
];

interface WheelCategory {
  key: string;
  label: string;
  icon: React.ReactNode;
  items: { label: string; color: string; weight?: number }[];
  _id?: string;
}

function DemoWheel() {
  const token = useAuthStore((s) => s.token);
  const [categories, setCategories] = useState<WheelCategory[]>(FALLBACK_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch real data from API if logged in
  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await categoriesApi.getAll();
        const apiCategories: Category[] = catRes.data.data;

        if (apiCategories.length === 0) return;

        // Fetch items for each category (max 6 categories)
        const limitedCats = apiCategories.slice(0, 6);
        const categoriesWithItems: WheelCategory[] = [];

        for (const cat of limitedCats) {
          try {
            const itemRes = await wheelContentsApi.getForWheel(cat._id);
            const apiItems: WheelContent[] = itemRes.data.data;
            if (apiItems.length >= 2) {
              categoriesWithItems.push({
                key: cat._id,
                label: cat.name,
                icon: getCategoryIcon(cat.name, cat.slug),
                items: apiItems.map((item) => ({
                  label: item.label,
                  color: item.color,
                  weight: item.weight,
                })),
                _id: cat._id,
              });
            }
          } catch {}
        }

        if (categoriesWithItems.length > 0) {
          setCategories(categoriesWithItems);
          setActiveCategory(0);
        }
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const currentItems = categories[activeCategory]?.items || [];

  const spin = () => {
    if (spinning || currentItems.length < 2) return;
    setSpinning(true);
    setResult(null);

    // Use weighted random if weights are available
    const hasWeights = currentItems.some((item) => item.weight && item.weight > 0);
    let idx: number;

    if (hasWeights) {
      const totalWeight = currentItems.reduce((sum, item) => sum + (item.weight || 1), 0);
      let rand = Math.random() * totalWeight;
      idx = 0;
      for (let i = 0; i < currentItems.length; i++) {
        rand -= (currentItems[i].weight || 1);
        if (rand <= 0) { idx = i; break; }
      }
    } else {
      idx = Math.floor(Math.random() * currentItems.length);
    }

    // Calculate target angle based on weights
    const totalWeight = currentItems.reduce((sum, item) => sum + (item.weight || 1), 0);
    let targetAngle = 0;
    for (let i = 0; i < idx; i++) {
      targetAngle += ((currentItems[i].weight || 1) / totalWeight) * 360;
    }
    targetAngle += (((currentItems[idx].weight || 1) / totalWeight) * 360) / 2;

    const target = 360 - targetAngle;
    const newRotation = rotation + 360 * 5 + target;
    setRotation(newRotation);
    setTimeout(() => {
      setResult(currentItems[idx].label);
      setSpinning(false);
    }, 4200);
  };

  const handleCategoryChange = (idx: number) => {
    if (spinning) return;
    setActiveCategory(idx);
    setResult(null);
    setRotation(0);
  };

  // Build gradient based on weights
  const gradient = (() => {
    if (currentItems.length === 0) return '#E53E3E';
    const totalWeight = currentItems.reduce((sum, item) => sum + (item.weight || 1), 0);
    const parts: string[] = [];
    let current = 0;
    currentItems.forEach((item) => {
      const angle = ((item.weight || 1) / totalWeight) * 360;
      parts.push(`${item.color} ${current}deg ${current + angle}deg`);
      current += angle;
    });
    return parts.join(', ');
  })();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Category tabs */}
      <div className="flex gap-2 mb-8 flex-wrap justify-center">
        {categories.map((cat, i) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(i)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === i
                ? 'bg-red-500 text-white shadow-lg shadow-red-200/50'
                : 'bg-white/80 text-slate-500 hover:bg-red-50 hover:text-red-500 border border-slate-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Wheel */}
      <div className="relative h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]">
        {/* Outer ring glow */}
        <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-red-200/30 to-orange-200/20 blur-xl" />

        {/* Tick marks */}
        {currentItems.map((_, i) => {
          const tw = currentItems.reduce((sum, c) => sum + (c.weight || 1), 0);
          let angle = 0;
          for (let j = 0; j < i; j++) angle += ((currentItems[j].weight || 1) / tw) * 360;
          return (
            <div
              key={i}
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
            background: `conic-gradient(${gradient})`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
            boxShadow:
              '0 0 0 5px rgba(255,255,255,0.8), 0 0 0 7px rgba(229,62,62,0.15), 0 20px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Segment dividers */}
          {currentItems.map((_, i) => {
            const tw = currentItems.reduce((sum, c) => sum + (c.weight || 1), 0);
            let sa = 0;
            for (let j = 0; j < i; j++) sa += ((currentItems[j].weight || 1) / tw) * 360;
            return (
              <div
                key={`div-${i}`}
                className="absolute w-[1px] h-1/2 bg-white/25 left-1/2 top-0 origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${sa}deg)` }}
              />
            );
          })}

          {/* Labels */}
          {currentItems.map((item, index) => {
            const tw = currentItems.reduce((sum, c) => sum + (c.weight || 1), 0);
            let sa = 0;
            for (let i = 0; i < index; i++) sa += ((currentItems[i].weight || 1) / tw) * 360;
            const sl = ((item.weight || 1) / tw) * 360;
            const mid = sa + sl / 2;
            const rad = (mid * Math.PI) / 180;
            const radius = 95;
            return (
              <div
                key={index}
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
            onClick={spin}
            disabled={spinning || currentItems.length < 2}
            className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-red-500 shadow-xl cursor-pointer hover:scale-110 transition-transform disabled:cursor-not-allowed border-0"
            style={{
              boxShadow:
                '0 0 0 4px rgba(229,62,62,0.2), 0 8px 25px rgba(0,0,0,0.15)',
            }}
          >
            <span className="text-xs font-black tracking-wider">
              {spinning ? '...' : 'QUAY'}
            </span>
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 rounded-2xl bg-white border border-slate-100 px-6 py-4 text-center shadow-lg animate-slide-up">
          <p className="text-slate-800 font-black text-lg flex items-center justify-center gap-2">
            <CheckCircleOutlined className="text-green-500" /> {result}
          </p>
          <p className="text-slate-400 text-xs mt-1">Kết quả ngẫu nhiên cho bạn</p>
        </div>
      )}

      {!result && !spinning && (
        <p className="mt-6 text-slate-400 text-sm font-medium">
          Nhấn <span className="text-red-500 font-bold">QUAY</span> ở giữa vòng quay
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-50 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-red-50 border border-red-100 px-4 py-2 text-sm font-bold text-red-600">
                <FireOutlined /> Quyết định thông minh, hành động ngay
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight mb-6 leading-[1.1]">
                Không biết{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
                    chọn gì?
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5Q50 1 100 4.5T199 3" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
                <br />
                Để chúng tôi giúp bạn!
              </h1>

              <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                Decision Maker giúp bạn đưa ra quyết định trong vài giây. Quay vòng quay, nhận
                gợi ý thông minh và hành động ngay. Không còn phân vân, chỉ còn hành động.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/wheels"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-white font-bold shadow-xl shadow-red-200/50 hover:shadow-2xl hover:shadow-red-300/50 hover:scale-105 transition-all text-base"
                >
                  <ThunderboltOutlined /> Bắt đầu ngay
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-8 py-4 text-slate-700 font-bold hover:border-red-200 hover:text-red-600 transition-all text-base"
                >
                  Tìm hiểu thêm <ArrowRightOutlined />
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-2xl font-black text-slate-800">3 bước</p>
                  <p className="text-xs text-slate-400 font-medium">Ra quyết định</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-2xl font-black text-red-500">Smart</p>
                  <p className="text-xs text-slate-400 font-medium">Gợi ý thông minh</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-2xl font-black text-slate-800">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Miễn phí</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <DemoWheel />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CTA CARDS */}
      <section className="mx-auto max-w-6xl px-4 pb-20 relative z-10  ">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto  ">
          <Link href="/wheels">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-7 text-white shadow-xl shadow-red-200/30 hover:shadow-2xl hover:shadow-red-300/40 transition-all hover:scale-[1.02] cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <StarOutlined className="text-3xl mb-3 opacity-90" />
              <h2 className="text-xl font-black">Hôm nay ăn gì?</h2>
              <p className="text-white/80 text-sm mt-1">Quay vòng quay tìm món ăn ngay</p>
              <ArrowRightOutlined className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <Link href="/wheels">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-7 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border border-slate-700/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <RocketOutlined className="text-3xl mb-3 text-red-400" />
              <h2 className="text-xl font-black">Hôm nay làm gì?</h2>
              <p className="text-slate-400 text-sm mt-1">Tìm hoạt động thú vị cho bạn</p>
              <ArrowRightOutlined className="mt-3 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <Link href="/wheels">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-7 text-white shadow-xl shadow-red-200/30 hover:shadow-2xl hover:shadow-red-300/40 transition-all hover:scale-[1.02] cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <StarOutlined className="text-3xl mb-3 opacity-90" />
              <h2 className="text-xl font-black">Hôm nay chơi gì?</h2>
              <p className="text-white/80 text-sm mt-1">Quay vòng quay tìm trò chơi ngay</p>
              <ArrowRightOutlined className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
        <div className="mx-auto max-w-5xl px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Tính năng</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">Tại sao chọn Decision Maker?</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">Giải pháp đơn giản cho việc ra quyết định hàng ngày</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-2xl bg-white border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
                <ThunderboltOutlined className="text-red-500 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Nhanh chóng & đơn giản</h3>
              <p className="text-slate-500 leading-relaxed">
                Chỉ cần 3 bước: chọn chủ đề, quay vòng quay, nhận kết quả. Không còn mất hàng giờ suy nghĩ &ldquo;ăn gì hôm nay&rdquo;.
              </p>
            </div>
            <div className="group rounded-2xl bg-white border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                <SmileOutlined className="text-orange-500 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Gợi ý thông minh</h3>
              <p className="text-slate-500 leading-relaxed">
                Hệ thống nhớ những gì bạn đã chọn gần đây và ưu tiên gợi ý những món mới, giúp bạn khám phá nhiều hơn.
              </p>
            </div>
            <div className="group rounded-2xl bg-white border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                <UserOutlined className="text-emerald-500 text-2xl" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Hoàn toàn cá nhân hóa</h3>
              <p className="text-slate-500 leading-relaxed">
                Tự tạo danh mục và lựa chọn riêng theo sở thích. Điều chỉnh trọng số để món yêu thích xuất hiện nhiều hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Hướng dẫn</span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-800">Bắt đầu trong 30 giây</h2>
            <p className="text-slate-500 text-lg">Đơn giản đến mức không cần đọc hướng dẫn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Chọn chủ đề', desc: 'Ăn gì, làm gì, đi đâu, học gì... hoặc tạo chủ đề riêng của bạn.' },
              { step: '02', title: 'Quay vòng quay', desc: 'Nhấn nút QUAY và hệ thống sẽ chọn ra kết quả phù hợp nhất cho bạn.' },
              { step: '03', title: 'Hành động ngay!', desc: 'Nhận kết quả, thực hiện và check-in để giữ chuỗi ngày liên tiếp.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-red-200 z-0" />
                )}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200/50 group-hover:shadow-xl group-hover:shadow-red-300/50 transition-shadow">
                  <span className="text-2xl font-black">{item.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-800">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STREAK & GAMIFICATION */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Streak & Thử thách</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6">
                Biến quyết định thành{' '}
                <span className="text-red-500">thói quen tích cực</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Hệ thống Streak giúp bạn duy trì động lực mỗi ngày. Quay, hành động, check-in và xây dựng chuỗi ngày liên tiếp. Càng dài streak, bạn càng tự hào!
              </p>
              <div className="space-y-4">
                {[
                  { icon: <FireOutlined className="text-orange-500" />, label: 'Chuỗi ngày (Streak)', desc: 'Quay và check-in mỗi ngày để xây dựng chuỗi liên tiếp. Bỏ lỡ 1 ngày, streak reset về 0!' },
                  { icon: <TrophyOutlined className="text-yellow-500" />, label: 'Kỷ lục cá nhân', desc: 'Theo dõi streak dài nhất của bạn theo từng danh mục. Thử phá kỷ lục bản thân!' },
                  { icon: <CalendarOutlined className="text-blue-500" />, label: 'Check-in hàng ngày', desc: 'Sau khi thực hiện quyết định, check-in để xác nhận. Hệ thống ghi nhận và cập nhật streak.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.label}</p>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl" />
              <div className="relative rounded-3xl border border-orange-100 p-8 bg-white/80 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-200/50">
                    <FireOutlined className="text-white text-2xl" />
                  </div>
                  <p className="text-4xl font-black text-slate-800">7 ngày</p>
                  <p className="text-sm text-slate-400">Chuỗi streak hiện tại</p>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                    <div key={day} className="text-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1 text-xs font-bold ${i < 7 ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <CheckCircleOutlined />
                      </div>
                      <span className="text-[10px] text-slate-400">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <div><span className="font-black text-yellow-500">12</span> <span className="text-slate-400">Kỷ lục</span></div>
                  <div><span className="font-black text-green-500">45</span> <span className="text-slate-400">Tổng quay</span></div>
                  <div><span className="font-black text-red-500">3</span> <span className="text-slate-400">Danh mục</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHARING & FRIENDS */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-red-50 rounded-3xl" />
              <div className="relative rounded-3xl border border-blue-100 p-8 bg-white/80 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-black text-red-500">A</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Anh quay được: <span className="text-red-500">Phở</span></p>
                      <p className="text-xs text-slate-400">2 phút trước</p>
                    </div>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1"><FireOutlined /> 5 ngày</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-500">B</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Bình quay được: <span className="text-red-500">Đi gym</span></p>
                      <p className="text-xs text-slate-400">10 phút trước</p>
                    </div>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1"><FireOutlined /> 12 ngày</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-black text-green-500">C</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">Chi quay được: <span className="text-red-500">Xem phim</span></p>
                      <p className="text-xs text-slate-400">30 phút trước</p>
                    </div>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1"><FireOutlined /> 3 ngày</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-500 mb-3">Kết nối</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6">
                Quay cùng bạn bè,{' '}
                <span className="text-red-500">vui gấp đôi</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Chia sẻ kết quả quay với bạn bè, so sánh streak và cùng nhau thử thách. Quyết định cùng nhóm trở nên dễ dàng hơn bao giờ hết!
              </p>
              <div className="space-y-4">
                {[
                  { icon: <ShareAltOutlined className="text-blue-500" />, label: 'Chia sẻ kết quả', desc: 'Chia sẻ kết quả quay lên mạng xã hội hoặc gửi cho bạn bè để cùng thực hiện.' },
                  { icon: <TeamOutlined className="text-emerald-500" />, label: 'Quay nhóm', desc: 'Cả nhóm cùng sử dụng một danh mục, ai cũng quay và cùng hành động theo kết quả.' },
                  { icon: <TrophyOutlined className="text-yellow-500" />, label: 'So sánh streak', desc: 'Xem ai trong nhóm có streak dài nhất. Tạo động lực để duy trì thói quen tích cực.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.label}</p>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Người dùng</span>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Dành cho tất cả mọi người</h2>
            <p className="text-slate-600 text-lg">Dù bạn là ai, Decision Maker đều hữu ích</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <UserOutlined />, title: 'Cá nhân', desc: 'Ăn gì, mặc gì, đi đâu hôm nay', gradient: 'from-red-500/20 to-red-600/10' },
              { icon: <TeamOutlined />, title: 'Nhóm bạn', desc: 'Cùng quay và thử thách nhau', gradient: 'from-orange-500/20 to-orange-600/10' },
              { icon: <HeartOutlined />, title: 'Cặp đôi', desc: 'Hẹn hò đi đâu, ăn gì', gradient: 'from-pink-500/20 to-pink-600/10' },
              { icon: <RocketOutlined />, title: 'Team lead', desc: 'Ra quyết định nhanh cho nhóm', gradient: 'from-amber-500/20 to-amber-600/10' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl bg-gradient-to-b ${item.gradient} border border-white/10 p-6 text-center hover:border-red-500/30 hover:scale-105 transition-all cursor-default`}>
                <div className="text-3xl mb-4 text-red-400">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-700/30 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl px-4 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white">Sẵn sàng ra quyết định?</h2>
          <p className="text-white/80 mb-10 text-lg max-w-lg mx-auto">
            Đăng ký miễn phí ngay hôm nay. Không cần thẻ tín dụng. Không giới hạn lượt quay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-red-600 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <ThunderboltOutlined /> Bắt đầu miễn phí
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-10 py-4 text-white font-bold text-lg hover:bg-white/10 transition-all"
            >
              Tìm hiểu thêm <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
