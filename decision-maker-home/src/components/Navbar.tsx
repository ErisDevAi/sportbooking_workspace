'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

const navLinks = [
  { href: '/categories', label: 'Danh mục' },
  { href: '/wheels', label: 'Vòng quay' },
  { href: '/about', label: 'Giới thiệu' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? 'text-purple-600'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
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
  );
}
