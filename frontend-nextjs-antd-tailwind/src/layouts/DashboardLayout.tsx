'use client';

import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/users', icon: <UserOutlined />, label: 'Users' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      router.push('/login');
    } else {
      router.push(key);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        className="fixed left-0 top-0 bottom-0 z-10"
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center">
          <h1 className="text-white text-lg font-bold m-0">
            {sidebarCollapsed ? 'AD' : 'Admin'}
          </h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
        <div className="absolute bottom-0 w-full">
          <Menu
            theme="dark"
            mode="inline"
            selectable={false}
            items={[
              { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
            ]}
            onClick={handleMenuClick}
          />
        </div>
      </Sider>

      <Layout
        className="transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 80 : 200 }}
      >
        <Header className="bg-white px-6 flex items-center shadow-sm sticky top-0 z-10">
          <button
            onClick={toggleSidebar}
            className="text-lg cursor-pointer border-none bg-transparent p-0"
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-gray-600">Welcome back</span>
          </div>
        </Header>

        <Content className="m-6 p-6 bg-white rounded-lg min-h-[calc(100vh-112px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
