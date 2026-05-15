import type { Metadata } from 'next';
import WheelsClient from './WheelsClient';

export const metadata: Metadata = {
  title: 'Vòng quay quyết định — Quay ngay & Hành động',
  description:
    'Quay vòng quay để ra quyết định nhanh chóng. Chọn danh mục, thêm lựa chọn, quay và nhận kết quả thông minh. Hỗ trợ trọng số, re-spin, check-in và theo dõi streak.',
  keywords: [
    'vòng quay quyết định', 'quay vòng quay', 'spin wheel', 'random wheel',
    'ăn gì hôm nay quay', 'chọn ngẫu nhiên', 'trọng số vòng quay',
    'smart random', 're-spin', 'check-in streak',
  ],
  openGraph: {
    title: 'Vòng quay quyết định — Quay ngay & Hành động',
    description: 'Chọn danh mục, thêm lựa chọn, quay vòng quay và nhận kết quả thông minh. Hỗ trợ trọng số và streak!',
  },
};

export default function WheelsPage() {
  return <WheelsClient />;
}
