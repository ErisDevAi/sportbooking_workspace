import type { Metadata } from 'next';
import CategoryDetailClient from './CategoryDetailClient';

export const metadata: Metadata = {
  title: 'Chi tiết danh mục — Xem & Quản lý lựa chọn',
  description:
    'Xem chi tiết danh mục quyết định, quản lý các lựa chọn với trọng số và màu sắc. Thêm, sửa, xóa lựa chọn và quay vòng quay ngay.',
  keywords: [
    'chi tiết danh mục', 'quản lý lựa chọn', 'trọng số vòng quay',
    'thêm lựa chọn', 'sửa lựa chọn', 'quay ngay',
  ],
  openGraph: {
    title: 'Chi tiết danh mục — Xem & Quản lý lựa chọn',
    description: 'Quản lý lựa chọn trong danh mục với trọng số và màu sắc riêng.',
  },
};

export default function CategoryDetailPage() {
  return <CategoryDetailClient />;
}
