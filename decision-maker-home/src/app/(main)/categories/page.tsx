import type { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'Danh mục quyết định — Quản lý chủ đề của bạn',
  description:
    'Tạo và quản lý danh mục quyết định cá nhân: Ăn gì, Làm gì, Đi đâu, Học gì. Thêm lựa chọn tùy chỉnh với màu sắc và trọng số riêng.',
  keywords: [
    'danh mục quyết định', 'tạo danh mục', 'quản lý lựa chọn',
    'ăn gì làm gì đi đâu', 'tùy chỉnh vòng quay', 'category management',
    'thêm lựa chọn', 'trọng số', 'màu sắc vòng quay',
  ],
  openGraph: {
    title: 'Danh mục quyết định — Quản lý chủ đề của bạn',
    description: 'Tạo danh mục tùy chỉnh: Ăn gì, Làm gì, Đi đâu. Thêm lựa chọn với trọng số và màu sắc riêng.',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
