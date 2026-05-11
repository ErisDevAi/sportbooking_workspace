'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { useState } from 'react';

const navLinks = [
  { href: '/categories', label: 'Danh mục' },
  { href: '/wheels', label: 'Vòng quay' },
  { href: '/stats', label: 'Streak' },
  { href: '/about', label: 'Giới thiệu' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200/50 group-hover:shadow-red-300/50 transition-shadow">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="white" />
          <line x1="12" y1="3" x2="12" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="17" x2="12" y2="21" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="3" y1="12" x2="7" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="17" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-black text-slate-800 tracking-tight leading-tight">
          Decision<span className="text-red-500">Maker</span>
        </span>
        <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-tight">
          Smart Choices
        </span>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-slate-100/80 bg-white/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  pathname === link.href
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-600 hover:text-red-600 hover:bg-red-50/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth + Mobile toggle */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/wheels" className="hidden sm:block">
                  <Button type="primary" size="large" className="!rounded-full !font-bold !px-6 !bg-red-500 !border-red-500 hover:!bg-red-600">
                    Quay ngay
                  </Button>
                </Link>
                <Dropdown
                  menu={{
                    items: [
                      { key: 'user', label: user.name, disabled: true },
                      { type: 'divider' },
                      { key: 'profile', icon: <ProfileOutlined />, label: 'Hồ sơ & Streak' },
                      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
                    ],
                    onClick: ({ key }) => {
                      if (key === 'profile') {
                        router.push('/profile');
                      } else if (key === 'logout') {
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
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button size="large" className="!rounded-full !font-semibold">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" size="large" className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuOutlined className="text-lg text-slate-600" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-4 space-y-1 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? 'text-red-600 bg-red-50'
                    : 'text-slate-600 hover:text-red-600 hover:bg-red-50/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-3 pt-3 border-t border-slate-100 mt-3">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button block size="large" className="!rounded-lg !font-semibold">Đăng nhập</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button type="primary" block size="large" className="!rounded-lg !font-bold !bg-red-500 !border-red-500">Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
