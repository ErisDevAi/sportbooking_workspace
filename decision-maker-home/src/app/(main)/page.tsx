import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Decision Maker — Không biết chọn gì? Để chúng tôi giúp bạn!',
  description:
    'Ứng dụng vòng quay quyết định thông minh giúp bạn trả lời: Ăn gì hôm nay? Làm gì bây giờ? Đi đâu hôm nay? Quay vòng quay, nhận gợi ý và hành động ngay. Miễn phí, không giới hạn.',
  keywords: [
    'decision maker', 'vòng quay quyết định', 'ăn gì hôm nay', 'hôm nay ăn gì',
    'hôm nay làm gì', 'random picker', 'spinner wheel', 'chọn ngẫu nhiên',
    'vòng quay may mắn', 'gợi ý món ăn', 'gợi ý hoạt động', 'ra quyết định',
  ],
  openGraph: {
    title: 'Decision Maker — Không biết chọn gì? Để chúng tôi giúp bạn!',
    description: 'Quay vòng quay Decision Maker để nhận gợi ý thông minh cho mọi quyết định hàng ngày. Miễn phí!',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
