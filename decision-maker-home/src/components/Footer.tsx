import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v10" />
                  <path d="M18 12h-6" />
                </svg>
              </div>
              <span className="text-lg font-black">Decision Maker</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Ứng dụng hỗ trợ đưa ra quyết định hàng ngày. Giảm suy nghĩ, tăng hành động,
              tạo thói quen tích cực thông qua gamification.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Danh mục</Link></li>
              <li><Link href="/wheels" className="hover:text-white transition-colors">Vòng quay</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Tài khoản</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Đăng nhập</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Đăng ký</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Decision Maker. HUMG - Hệ thống hỗ trợ đưa ra quyết định.
        </div>
      </div>
    </footer>
  );
}
