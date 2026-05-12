import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                  <circle cx="12" cy="12" r="3" fill="white" />
                  <line x1="12" y1="3" x2="12" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="7" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-black">Decision<span className="text-red-400">Maker</span></span>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Smart Choices</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
              Ứng dụng hỗ trợ đưa ra quyết định hàng ngày. Giảm suy nghĩ, tăng hành động,
              tạo thói quen tích cực thông qua vòng quay thông minh và gamification.
            </p>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 px-5 py-2 text-sm font-bold text-white transition-all duration-300"
              >
                Bắt đầu miễn phí
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Sản phẩm</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Danh mục</Link></li>
              <li><Link href="/wheels" className="hover:text-white transition-colors">Vòng quay</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Khám phá</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Smart Random</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Tính năng</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Tài khoản</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Đăng nhập</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Đăng ký miễn phí</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Hồ sơ cá nhân</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Decision Maker. HUMG — Trường Đại học Mỏ - Địa chất Hà Nội.
          </p>
          <p className="text-xs text-slate-600">
            Made with <span className="text-red-400 animate-heartbeat">&#9829;</span> by HUMG Students
          </p>
        </div>
      </div>
    </footer>
  );
}
