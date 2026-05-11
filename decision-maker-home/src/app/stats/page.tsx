'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import {
  Button,
  Card,
  Empty,
  Input,
  message,
  Spin,
  Statistic,
} from 'antd';

import SimpleChart from '@/components/SimpleChart';

import { spinHistoryApi } from '@/api/spin-histories';

type ApiStatItem = {
  count?: number;
  total?: number;
  percentage?: number;

  content?: {
    _id?: string;
    label?: string;
    color?: string;
  };

  selectedContent?: {
    _id?: string;
    label?: string;
    color?: string;
  };

  label?: string;
  color?: string;
};

export default function WheelStatsPage() {
  const [categoryId, setCategoryId] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [stats, setStats] =
    useState<ApiStatItem[]>([]);

  const fetchStats = async () => {
    const id = categoryId.trim();

    if (!id) {
      message.warning(
        'Bạn cần nhập categoryId.'
      );

      return;
    }

    try {
      setLoading(true);

      const res =
        await spinHistoryApi.getStats(
          id
        );

      setStats(res.data.data || []);
    } catch (error) {
      console.error(error);

      message.error(
        'Không tải được thống kê.'
      );
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const totalSpins =
      stats.reduce(
        (sum, item) =>
          sum +
          (item.count ||
            item.total ||
            0),
        0
      ) || 1;

    return stats.map((item) => {
      const content =
        item.content ||
        item.selectedContent;

      const count =
        item.count ||
        item.total ||
        0;

      return {
        label:
          content?.label ||
          item.label ||
          'Không rõ',

        count,

        percentage:
          typeof item.percentage ===
          'number'
            ? item.percentage
            : Math.round(
                (count /
                  totalSpins) *
                  100
              ),

        color:
          content?.color ||
          item.color ||
          '#7C3AED',
      };
    });
  }, [stats]);

  const total = chartData.reduce(
    (sum, item) =>
      sum + item.count,
    0
  );

  const topItem = [...chartData].sort(
    (a, b) => b.count - a.count
  )[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
              Spin Analytics
            </p>

            <h1 className="text-3xl font-black">
              📊 Thống kê vòng quay
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Xem lựa chọn nào được
              quay nhiều nhất.
            </p>
          </div>

          <Link href="/wheels">
            <Button
              size="large"
              className="!rounded-full !font-bold"
            >
              ← Quay lại vòng quay
            </Button>
          </Link>
        </div>

        <Card className="!rounded-3xl !shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input
              size="large"
              value={categoryId}
              onChange={(e) =>
                setCategoryId(
                  e.target.value
                )
              }
              placeholder="Nhập categoryId..."
              onPressEnter={fetchStats}
            />

            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={fetchStats}
              className="!rounded-xl !font-bold"
            >
              Xem thống kê
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center rounded-3xl bg-white py-20 shadow-sm">
            <Spin size="large" />
          </div>
        ) : stats.length === 0 ? (
          <Card className="!rounded-3xl !shadow-sm">
            <Empty description="Nhập categoryId rồi bấm xem thống kê" />
          </Card>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              <Card className="!rounded-3xl !shadow-sm">
                <Statistic
                  title="Tổng lượt quay"
                  value={total}
                />
              </Card>

              <Card className="!rounded-3xl !shadow-sm">
                <Statistic
                  title="Được chọn nhiều nhất"
                  value={
                    topItem?.label ||
                    'N/A'
                  }
                />
              </Card>

              <Card className="!rounded-3xl !shadow-sm">
                <Statistic
                  title="Tỷ lệ cao nhất"
                  value={
                    topItem?.percentage ||
                    0
                  }
                  suffix="%"
                />
              </Card>
            </div>

            <Card
              title="Biểu đồ thống kê"
              className="!rounded-3xl !shadow-sm"
            >
            </Card>

            <Card
              title="Chi tiết thống kê"
              className="!rounded-3xl !shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                      <th className="py-3">
                        #
                      </th>

                      <th className="py-3">
                        Lựa chọn
                      </th>

                      <th className="py-3">
                        Số lượt
                      </th>

                      <th className="py-3">
                        Tỷ lệ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {chartData.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={`${item.label}-${index}`}
                          className="border-b border-slate-50"
                        >
                          <td className="py-3 font-bold">
                            {index + 1}
                          </td>

                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{
                                  background:
                                    item.color,
                                }}
                              />

                              <span className="font-semibold">
                                {
                                  item.label
                                }
                              </span>
                            </div>
                          </td>

                          <td className="py-3">
                            {
                              item.count
                            }
                          </td>

                          <td className="py-3">
                            {
                              item.percentage
                            }
                            %
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}