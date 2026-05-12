'use client';

import { useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  ApiOutlined,
  CloudServerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/admin/users', icon: <UserOutlined />, label: 'Người dùng' },
  { key: '/admin/roles', icon: <SafetyCertificateOutlined />, label: 'Vai trò' },
  { key: '/admin/permissions', icon: <KeyOutlined />, label: 'Quyền hạn' },
  { type: 'divider' as const },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Danh mục' },
  { key: '/admin/wheel-contents', icon: <PieChartOutlined />, label: 'Nội dung vòng quay' },
  { key: '/admin/spin-histories', icon: <HistoryOutlined />, label: 'Lịch sử quay' },
  { key: '/admin/backup', icon: <CloudServerOutlined />, label: 'Sao lưu' },
  { type: 'divider' as const },
  { key: '/admin/api-docs', icon: <ApiOutlined />, label: 'API Docs' },
];

const WheelLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v10" />
    <path d="M18 12h-6" />
    <path d="M12 22v-10" />
    <path d="M6 12h6" />
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) return null;

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const currentPage = menuItems.find((m) => 'key' in m && m.key === pathname);

  return (
    <Layout className="min-h-screen">
      {/* SIDEBAR */}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        className="fixed left-0 top-0 bottom-0 z-20"
        width={260}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #2a1a2e 50%, #1a1a2e 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center border-b border-white/10 px-5">
          {sidebarCollapsed ? (
            <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-900/40 flex items-center justify-center">
              <WheelLogo size={18} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-900/40 flex items-center justify-center shrink-0">
                <WheelLogo size={18} />
              </div>
              <div>
                <span className="text-white font-black text-sm leading-tight block">Decision Maker</span>
                <span className="text-red-300 text-[10px] font-medium">Hệ thống quản trị</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="mt-2 border-none !bg-transparent"
          theme="dark"
        />

        {/* Bottom - Back to home */}
        <div className="absolute bottom-0 w-full border-t border-white/10">
          <Menu
            mode="inline"
            selectable={false}
            theme="dark"
            className="border-none !bg-transparent"
            items={[
              {
                key: 'home',
                icon: <HomeOutlined />,
                label: sidebarCollapsed ? '' : 'Về trang chủ',
              },
            ]}
            onClick={() => window.open('/', '_blank')}
          />
        </div>
      </Sider>

      {/* MAIN */}
      <Layout
        className="transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 80 : 260, background: '#f8fafc' }}
      >
        {/* HEADER */}
        <Header
          className="px-6 flex items-center justify-between sticky top-0 z-10 h-16"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleSidebar}
              className="text-lg cursor-pointer border-none bg-transparent p-2 rounded-xl hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600"
            >
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">
                {currentPage && 'label' in currentPage ? currentPage.label : 'Quản trị'}
              </h2>
            </div>
          </div>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'info',
                  label: (
                    <div className="py-1">
                      <p className="font-semibold text-slate-800">{user?.name || 'Admin'}</p>
                      <p className="text-xs text-slate-400">{user?.email || ''}</p>
                    </div>
                  ),
                  disabled: true,
                },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') handleLogout();
              },
            }}
            placement="bottomRight"
          >
            <div className="flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors border border-transparent hover:border-red-100">
              <Avatar
                size="small"
                className="!bg-gradient-to-br !from-red-500 !to-red-600"
                style={{ fontSize: 12, fontWeight: 800 }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                {user?.name || 'Admin'}
              </span>
            </div>
          </Dropdown>
        </Header>

        {/* CONTENT */}
        <Content className="p-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
