import type { Metadata } from 'next';
import StatsClient from './StatsClient';

export const metadata: Metadata = {
  title: 'Streak & Thống kê — Theo dõi tiến trình của bạn',
  description:
    'Xem thống kê chi tiết: streak hiện tại, kỷ lục cá nhân, tổng lượt quay, lịch hoạt động heatmap, bảng xếp hạng và huy hiệu. Theo dõi thói quen ra quyết định hàng ngày.',
  keywords: [
    'streak thống kê', 'theo dõi streak', 'lịch hoạt động', 'bảng xếp hạng',
    'huy hiệu achievement', 'check-in hàng ngày', 'thói quen tích cực',
    'gamification', 'thống kê vòng quay', 'kỷ lục streak',
  ],
  openGraph: {
    title: 'Streak & Thống kê — Theo dõi tiến trình của bạn',
    description: 'Streak, kỷ lục, lịch hoạt động, bảng xếp hạng — theo dõi thói quen ra quyết định hàng ngày.',
  },
};

export default function StatsPage() {
  return <StatsClient />;
}
