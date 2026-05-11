'use client';

import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import StatsCard from '@/components/StatsCard';
import SimpleChart from '@/components/SimpleChart';
import { dashboardApi } from '@/api/dashboard';
import SplashScreen from '@/components/SplashScreen';

interface DashboardStats {
  totals: {
    users: number;
    activeUsers: number;
    roles: number;
    permissions: number;
    categories: number;
    spins: number;
  };
  usersByRole: { _id: string; count: number }[];
  activity: { _id: string; count: number }[];
  system: {
    status: string;
    version: string;
    uptime: number;
    nodeVersion: string;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        setStats(res.data.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!loading && !stats) {
    return <div className="text-center py-20 text-gray-500">Không thể tải dữ liệu dashboard</div>;
  }

  if (loading || !stats) {
    return <SplashScreen />;
  }

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totals.users.toLocaleString(),
      icon: <UserOutlined />,
      color: '#1677ff',
      change: `${stats.totals.activeUsers} đang hoạt động`,
    },
    {
      title: 'Danh mục',
      value: stats.totals.categories.toLocaleString(),
      icon: <AppstoreOutlined />,
      color: '#52c41a',
      change: `${stats.totals.roles} vai trò`,
    },
    {
      title: 'Tổng lượt quay',
      value: stats.totals.spins.toLocaleString(),
      icon: <ThunderboltOutlined />,
      color: '#faad14',
      change: `${stats.totals.permissions} quyền hạn`,
    },
    {
      title: 'Vai trò',
      value: stats.usersByRole.length.toLocaleString(),
      icon: <TrophyOutlined />,
      color: '#eb2f96',
      change: stats.usersByRole.map((r) => `${r._id}: ${r.count}`).join(', '),
    },
  ];

  // Activity chart - last 7 days
  const activityLabels = stats.activity.map((a) => {
    const d = new Date(a._id);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const activityData = stats.activity.map((a) => a.count);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Tổng quan hệ thống</h2>

      <Row gutter={[16, 16]}>
        {statCards.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              change={stat.change}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={16}>
          <SimpleChart
            title="Hoạt động quay (7 ngày gần nhất)"
            data={activityData.length > 0 ? activityData : [0]}
            labels={activityLabels.length > 0 ? activityLabels : ['Hôm nay']}
            color="#E53E3E"
          />
        </Col>
        <Col xs={24} lg={8}>
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
            <h3 className="font-semibold text-gray-700 mb-4">Phân bổ vai trò</h3>
            <div className="space-y-3">
              {stats.usersByRole.map((role) => (
                <div key={role._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{role._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(role.count / stats.totals.users) * 100}%`,
                          backgroundColor: role._id === 'admin' ? '#ef4444' : role._id === 'editor' ? '#3b82f6' : '#6b7280',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-8 text-right">{role.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Hệ thống</h4>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Trạng thái</span>
                  <span className="text-green-600 font-semibold">{stats.system.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phiên bản</span>
                  <span>{stats.system.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Node.js</span>
                  <span>{stats.system.nodeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span>{Math.floor(stats.system.uptime / 3600)}h {Math.floor((stats.system.uptime % 3600) / 60)}m</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
