import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Giới thiệu Decision Maker — Câu chuyện & Tính năng',
  description:
    'Tìm hiểu về Decision Maker — ứng dụng vòng quay quyết định được phát triển bởi sinh viên HUMG. Thuật toán Smart Random, hệ thống Streak, gamification và nhiều tính năng thú vị.',
  keywords: [
    'giới thiệu decision maker', 'smart random', 'thuật toán vòng quay',
    'streak check-in', 'gamification', 'HUMG', 'đại học mỏ địa chất',
    'sinh viên HUMG', 'ứng dụng quyết định', 'tính năng decision maker',
  ],
  openGraph: {
    title: 'Giới thiệu Decision Maker — Câu chuyện & Tính năng',
    description: 'Thuật toán Smart Random, hệ thống Streak & Check-in, gamification — tất cả trong Decision Maker.',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
