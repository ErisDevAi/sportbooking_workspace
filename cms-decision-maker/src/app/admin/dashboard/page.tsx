'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Spin, App } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { dashboardApi } from '@/api/dashboard';

interface DashboardData {
  totals: {
    users: number;
    activeUsers: number;
    roles: number;
    permissions: number;
    categories: number;
    spins: number;
  };
  usersByRole: { _id: string; count: number }[];
  system: {
    status: string;
    version: string;
    uptime: number;
    nodeVersion: string;
  };
}

export default function DashboardPage() {
  const { message } = App.useApp();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        setData(res.data.data);
      } catch {
        message.error('Không thể tải thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: data?.totals.users || 0,
      icon: <UserOutlined />,
      color: '#E53E3E',
      bgColor: '#FFF5F5',
    },
    {
      title: 'Đang hoạt động',
      value: data?.totals.activeUsers || 0,
      icon: <TeamOutlined />,
      color: '#059669',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Danh mục',
      value: data?.totals.categories || 0,
      icon: <AppstoreOutlined />,
      color: '#D97706',
      bgColor: '#FFF7ED',
    },
    {
      title: 'Tổng lượt quay',
      value: data?.totals.spins || 0,
      icon: <PieChartOutlined />,
      color: '#DC2626',
      bgColor: '#FEF2F2',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-800">Tổng quan hệ thống</h1>
        <p className="text-slate-500 text-sm mt-1">Thống kê tổng hợp về hệ thống Decision Maker</p>
      </div>

      <Row gutter={[20, 20]}>
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">{card.value}</p>
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Users by Role */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Phân bổ vai trò</h3>
          <div className="space-y-3">
            {data?.usersByRole.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <span className="text-sm text-slate-600 capitalize">{item._id}</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 rounded-full px-3 py-1">
                  {item.count} người
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Thông tin hệ thống</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trạng thái</span>
              <span className="font-semibold text-green-600">
                {data?.system.status === 'healthy' ? 'Hoạt động' : 'Lỗi'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Phiên bản</span>
              <span className="font-semibold text-slate-700">{data?.system.version}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Node.js</span>
              <span className="font-semibold text-slate-700">{data?.system.nodeVersion}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Uptime</span>
              <span className="font-semibold text-slate-700">
                {Math.floor((data?.system.uptime || 0) / 60)} phút
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
