import type { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân — Streak & Lịch sử',
  description:
    'Xem hồ sơ cá nhân, streak theo từng danh mục, kỷ lục cao nhất và lịch sử quay gần đây trên Decision Maker.',
  keywords: [
    'hồ sơ cá nhân', 'streak cá nhân', 'lịch sử quay', 'kỷ lục streak',
    'tổng lượt quay', 'thống kê cá nhân',
  ],
  openGraph: {
    title: 'Hồ sơ cá nhân — Streak & Lịch sử',
    description: 'Xem streak, kỷ lục và lịch sử quay gần đây của bạn trên Decision Maker.',
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
