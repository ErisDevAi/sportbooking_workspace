'use client';

import { useEffect, useState } from 'react';
import { Table, Select, Tag, App, Empty, Avatar } from 'antd';
import { UserOutlined, PieChartOutlined, AppstoreOutlined } from '@ant-design/icons';
import { spinHistoryApi } from '@/api/spin-histories';
import { categoriesApi } from '@/api/categories';
import type { SpinHistory, SpinStats } from '@/types/spin-histories';
import type { Category } from '@/types/category';

export default function SpinHistoriesPage() {
  const { message } = App.useApp();
  const [histories, setHistories] = useState<SpinHistory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<SpinStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.data.data);
      } catch {
        message.error('Không thể tải danh mục');
      }
    };
    fetchCategories();
  }, []);

  const fetchHistories = async (page = 1, limit = 20, categoryId?: string) => {
    try {
      setLoading(true);
      const params: any = { page, limit, all: 'true' };
      if (categoryId) params.categoryId = categoryId;
      const res = await spinHistoryApi.getAll(params);
      setHistories(res.data.data);
      if ((res.data as any).meta) {
        const meta = (res.data as any).meta;
        setPagination({ current: meta.page, pageSize: meta.limit, total: meta.total });
      }
    } catch {
      message.error('Không thể tải lịch sử quay');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (categoryId: string) => {
    try {
      const res = await spinHistoryApi.getStats(categoryId);
      setStats(res.data.data);
    } catch {
      setStats([]);
    }
  };

  useEffect(() => {
    fetchHistories(1, 20, selectedCategory || undefined);
    if (selectedCategory) {
      fetchStats(selectedCategory);
    } else {
      setStats([]);
    }
  }, [selectedCategory]);

  const getCategoryInfo = (catId: string) => {
    if (typeof catId === 'object' && catId !== null) return catId as any;
    return categories.find((c) => c._id === catId);
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      width: 180,
      render: (_: any, record: any) => {
        const user = record.userId;
        if (typeof user === 'object' && user !== null) {
          return (
            <div className="flex items-center gap-2.5">
              <Avatar size="small" className="!bg-red-100 !text-red-600" icon={<UserOutlined />}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div>
                <p className="font-semibold text-slate-800 text-sm leading-tight">{user.name}</p>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>
            </div>
          );
        }
        return <span className="text-slate-400 text-xs">{String(user)}</span>;
      },
    },
    {
      title: 'Kết quả quay',
      key: 'result',
      render: (_: any, record: SpinHistory) => {
        const cat = getCategoryInfo(record.categoryId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-base">
              <PieChartOutlined />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{record.selectedLabel}</p>
              <p className="text-[11px] text-slate-400">{cat?.name || ''}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 110,
      render: (_: any, record: any) => {
        const status = record.status || (record.isVerified ? 'completed' : 'pending');
        const map: Record<string, { color: string; label: string }> = {
          pending: { color: 'orange', label: 'Chờ xử lý' },
          completed: { color: 'green', label: 'Hoàn thành' },
          skipped: { color: 'default', label: 'Bỏ qua' },
          expired: { color: 'red', label: 'Hết hạn' },
        };
        const info = map[status] || map.pending;
        return <Tag color={info.color} className="!font-bold !text-xs">{info.label}</Tag>;
      },
    },
    {
      title: 'Streak',
      key: 'streak',
      width: 90,
      render: (_: any, record: SpinHistory) => (
        <Tag color="orange" className="!font-bold !text-xs">{record.currentStreak}</Tag>
      ),
    },
    {
      title: 'Kỷ lục',
      dataIndex: 'maxStreak',
      key: 'maxStreak',
      width: 90,
      render: (max: number) => (
        <Tag color="gold" className="!font-bold !text-xs">{max}</Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => (
        <span className="text-xs text-slate-500">
          {new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Lịch sử quay</h1>
          <p className="text-sm text-slate-500 mt-0.5">Xem lịch sử quay của tất cả người dùng</p>
        </div>
        <Select
          value={selectedCategory || undefined}
          onChange={(val) => setSelectedCategory(val || '')}
          placeholder="Tất cả danh mục"
          allowClear
          className="!w-[220px]"
          size="large"
        >
          {categories.map((cat) => (
            <Select.Option key={cat._id} value={cat._id}>
              <AppstoreOutlined /> {cat.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-50 border border-red-100 p-5">
          <h3 className="font-semibold text-red-800 mb-3 text-sm">Thống kê lựa chọn được quay</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {stats.map((stat) => (
              <div key={stat._id} className="bg-white rounded-xl border border-red-100 p-3 text-center shadow-sm">
                <p className="text-xl font-black text-red-600">{stat.count}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={histories}
        rowKey="_id"
        loading={loading}
        locale={{ emptyText: <Empty description="Chưa có lịch sử quay nào" /> }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => <span className="text-sm text-slate-500">Tổng {total} lượt quay</span>,
          onChange: (page, pageSize) => fetchHistories(page, pageSize, selectedCategory || undefined),
        }}
      />
    </div>
  );
}
