'use client';

import { useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý tài khoản' },
  { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Quản lý danh mục' },
  { key: '/admin/wheel-contents', icon: <PieChartOutlined />, label: 'Nội dung vòng quay' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        className="fixed left-0 top-0 bottom-0 z-20 shadow-xl"
        width={260}
        style={{ background: '#1e1b4b' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
          {sidebarCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">D</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">D</span>
              </div>
              <span className="text-white font-bold text-sm">Decision Maker CMS</span>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="mt-4 border-none"
          style={{ background: 'transparent' }}
          theme="dark"
        />
      </Sider>

      <Layout
        className="transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
      >
        <Header className="bg-white px-6 flex items-center justify-between shadow-sm sticky top-0 z-10 h-16 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-lg cursor-pointer border-none bg-transparent p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">
                {menuItems.find((m) => m.key === pathname)?.label || 'Quản trị'}
              </h2>
              <p className="text-xs text-slate-400">Hệ thống quản trị Decision Maker</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge count={0} size="small">
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                <BellOutlined className="text-lg" />
              </button>
            </Badge>
            <Dropdown
              menu={{
                items: [
                  { key: 'info', label: user?.email || '', disabled: true },
                  { type: 'divider' },
                  { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
                ],
                onClick: ({ key }) => {
                  if (key === 'logout') handleLogout();
                },
              }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <Avatar size="small" className="bg-purple-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400 leading-tight">{user?.role || 'admin'}</p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6">
          <div className="bg-white rounded-xl border border-slate-100 p-6 min-h-[calc(100vh-140px)]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
