'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Spin, App } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  TeamOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
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
    wheelContents?: number;
    backups?: number;
    streaks?: number;
    completedDecisions?: number;
    pendingDecisions?: number;
  };
  usersByRole: { role: string; count: number }[];
  topStreaks?: Array<{
    user: { _id: string; name: string; email: string };
    currentStreak: number;
    longestStreak: number;
    level: number;
    totalCheckins: number;
  }>;
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
    {
      title: 'Hoàn thành',
      value: data?.totals.completedDecisions || 0,
      icon: <CheckCircleOutlined />,
      color: '#16A34A',
      bgColor: '#F0FDF4',
    },
    {
      title: 'Đang chờ',
      value: data?.totals.pendingDecisions || 0,
      icon: <ClockCircleOutlined />,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      title: 'Streaks',
      value: data?.totals.streaks || 0,
      icon: <FireOutlined />,
      color: '#EA580C',
      bgColor: '#FFF7ED',
    },
    {
      title: 'Sao lưu',
      value: data?.totals.backups || 0,
      icon: <DatabaseOutlined />,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
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
          <Col xs={12} sm={8} lg={6} key={index}>
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

      {/* Bottom sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="rounded-xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Phân bổ vai trò</h3>
          <div className="space-y-3">
            {data?.usersByRole.map((item) => (
              <div key={item.role} className="flex justify-between items-center">
                <span className="text-sm text-slate-600 capitalize">{item.role}</span>
                <span className="text-sm font-bold text-slate-800 bg-slate-100 rounded-full px-3 py-1">
                  {item.count} người
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Streaks */}
        <div className="rounded-xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FireOutlined className="text-orange-500" /> Top Streaks
          </h3>
          {data?.topStreaks && data.topStreaks.length > 0 ? (
            <div className="space-y-3">
              {data.topStreaks.map((entry, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-700'
                    }`}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{entry.user?.name || 'User'}</p>
                      <p className="text-[11px] text-slate-400">Level {entry.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-orange-500">{entry.longestStreak} streak</span>
                    <span className="text-slate-400">{entry.totalCheckins} check-in</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Chưa có dữ liệu streak</p>
          )}
        </div>
      </div>

      {/* System Info */}
      <div className="mt-6 rounded-xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Thông tin hệ thống</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-sm">
            <span className="text-slate-500 block">Trạng thái</span>
            <span className="font-semibold text-green-600">
              {data?.system.status === 'healthy' ? 'Hoạt động' : 'Lỗi'}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block">Phiên bản</span>
            <span className="font-semibold text-slate-700">{data?.system.version}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block">Node.js</span>
            <span className="font-semibold text-slate-700">{data?.system.nodeVersion}</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500 block">Uptime</span>
            <span className="font-semibold text-slate-700">
              {Math.floor((data?.system.uptime || 0) / 60)} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
