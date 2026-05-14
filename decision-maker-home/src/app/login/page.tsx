import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Đăng nhập — Decision Maker',
  description:
    'Đăng nhập vào Decision Maker để sử dụng vòng quay quyết định, theo dõi streak và xem thống kê cá nhân.',
  keywords: [
    'đăng nhập decision maker', 'login', 'tài khoản decision maker',
  ],
  openGraph: {
    title: 'Đăng nhập — Decision Maker',
    description: 'Đăng nhập để sử dụng vòng quay quyết định thông minh.',
  },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginClient />;
}
