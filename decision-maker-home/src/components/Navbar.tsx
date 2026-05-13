'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/categories', label: 'Danh mục' },
  { href: '/wheels', label: 'Vòng quay' },
  { href: '/stats', label: 'Streak' },
  { href: '/about', label: 'Giới thiệu' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200/50 group-hover:shadow-red-300/50 group-hover:scale-110 transition-all duration-300">
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
  const [scrolled, setScrolled] = useState(false);

  // Navbar blur on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/85 backdrop-blur-xl shadow-sm border-b border-slate-100/50'
        : 'bg-white/90 backdrop-blur-xl border-b border-slate-100/80'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-animated relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-red-600 bg-red-50 active'
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
                  <Button type="primary" size="large" className="!rounded-full !font-bold !px-6 !bg-red-500 !border-red-500 hover:!bg-red-600 hover:!shadow-lg hover:!shadow-red-200/50 !transition-all !duration-300">
                    Quay ngay
                  </Button>
                </Link>
                <Dropdown
                  menu={{
                    items: [
                      { key: 'user', label: <span className="font-bold">{user.name}</span>, disabled: true },
                      { type: 'divider' },
                      { key: 'profile', icon: <ProfileOutlined />, label: 'Hồ sơ & Streak' },
                      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
                    ],
                    onClick: ({ key }) => {
                      if (key === 'profile') router.push('/profile');
                      else if (key === 'logout') { logout(); router.push('/'); }
                    },
                  }}
                  placement="bottomRight"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black text-sm cursor-pointer hover:shadow-lg hover:shadow-red-200/50 hover:scale-110 transition-all duration-300">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Dropdown>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button size="large" className="!rounded-full !font-semibold hover:!border-red-300 hover:!text-red-500 !transition-all !duration-300">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" size="large" className="!rounded-full !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600 hover:!shadow-lg hover:!shadow-red-200/50 !transition-all !duration-300">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <CloseOutlined className="text-lg text-red-500 transition-transform duration-300" />
                : <MenuOutlined className="text-lg text-slate-600 transition-transform duration-300" />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[400px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-slate-100 pt-4 space-y-1 list-stagger">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
                  <Button block size="large" className="!rounded-xl !font-semibold">Đăng nhập</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button type="primary" block size="large" className="!rounded-xl !font-bold !bg-red-500 !border-red-500">Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
