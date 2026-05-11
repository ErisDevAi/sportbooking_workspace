'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center">
        <div className="inline-block mb-6 rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
          Hỗ trợ đưa ra quyết định thông minh
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
          Hôm nay bạn muốn{' '}
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            làm gì?
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 mb-12 leading-relaxed">
          Không biết chọn gì? Để Decision Maker giúp bạn! Quay vòng quay, nhận kết quả ngẫu nhiên
          và bắt đầu hành động ngay. Đơn giản, nhanh chóng, thú vị.
        </p>

        {/* 2 NÚT LỚN */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto mb-16">
          <Link href="/wheels" className="flex-1">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 p-8 text-white shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transition-all hover:scale-105 cursor-pointer">
              <div className="text-5xl mb-3">🍔</div>
              <h2 className="text-2xl font-black">Ăn gì?</h2>
              <p className="text-white/80 text-sm mt-1">Quay để tìm món ăn</p>
            </div>
          </Link>
          <Link href="/wheels" className="flex-1">
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 p-8 text-white shadow-xl shadow-violet-200 hover:shadow-2xl hover:shadow-violet-300 transition-all hover:scale-105 cursor-pointer">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-2xl font-black">Làm gì?</h2>
              <p className="text-white/80 text-sm mt-1">Quay để tìm hoạt động</p>
            </div>
          </Link>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Quyết định nhanh</h3>
            <p className="text-slate-500 text-sm">
              Giảm thời gian suy nghĩ, tăng hành động thực tế chỉ trong 3 bước
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🎮</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Gamify trải nghiệm</h3>
            <p className="text-slate-500 text-sm">
              Biến quyết định thành trò chơi với streak, level và thành tựu
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Cá nhân hóa</h3>
            <p className="text-slate-500 text-sm">
              Tạo danh mục riêng, thêm lựa chọn theo sở thích của bạn
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-t border-slate-100 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-black mb-12">Cách hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-black mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Chọn danh mục</h3>
              <p className="text-slate-500 text-sm">Chọn chủ đề bạn cần quyết định: ăn gì, làm gì, đi đâu...</p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-black mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Quay vòng quay</h3>
              <p className="text-slate-500 text-sm">Nhấn QUAY và để hệ thống chọn ngẫu nhiên cho bạn</p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-black mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Hành động!</h3>
              <p className="text-slate-500 text-sm">Chấp nhận kết quả, thực hiện và check-in để giữ streak</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
