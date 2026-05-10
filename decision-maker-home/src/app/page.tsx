'use client';

import Link from 'next/link';
import { Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 font-sans text-slate-900 flex flex-col">
      {/* NAVBAR */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v10" />
                  <path d="M18 12h-6" />
                  <path d="M12 22v-10" />
                  <path d="M6 12h6" />
                </svg>
              </div>
              <span className="text-lg font-black text-slate-800 tracking-tight">
                Decision Maker
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/categories" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
                Danh mục
              </Link>
              <Link href="/wheels" className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors">
                Vòng quay
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/wheels">
                    <Button type="primary" size="large" className="!rounded-full !font-bold !px-6">
                      Quay ngay
                    </Button>
                  </Link>
                  <Dropdown
                    menu={{
                      items: [
                        { key: 'user', label: user.name, disabled: true },
                        { type: 'divider' },
                        { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
                      ],
                      onClick: ({ key }) => {
                        if (key === 'logout') {
                          logout();
                          router.push('/');
                        }
                      },
                    }}
                    placement="bottomRight"
                  >
                    <Button shape="circle" icon={<UserOutlined />} size="large" />
                  </Dropdown>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="large" className="!rounded-full !font-semibold">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button type="primary" size="large" className="!rounded-full !font-bold">
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <main className="flex-grow">
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
            Không biết ch��n gì? Để Decision Maker giúp bạn! Quay vòng quay, nhận kết quả ngẫu nhiên
            và bắt đầu hành động ngay. Đơn giản, nhanh chóng, thú vị.
          </p>

          {/* 2 NÚT LỚN - theo user flow */}
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
      </main>

      {/* FOOTER */}
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
                tạo thói quen tích c��c thông qua gamification.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-300">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">Danh mục</Link></li>
                <li><Link href="/wheels" className="hover:text-white transition-colors">Vòng quay</Link></li>
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
    </div>
  );
}
