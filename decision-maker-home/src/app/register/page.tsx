import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Đăng ký miễn phí — Decision Maker',
  description:
    'Tạo tài khoản Decision Maker miễn phí. Không giới hạn lượt quay, không cần thẻ tín dụng. Bắt đầu ra quyết định thông minh ngay hôm nay!',
  keywords: [
    'đăng ký decision maker', 'tạo tài khoản', 'đăng ký miễn phí',
    'register decision maker', 'tài khoản mới',
  ],
  openGraph: {
    title: 'Đăng ký miễn phí — Decision Maker',
    description: 'Tạo tài khoản miễn phí. Không giới hạn lượt quay, không cần thẻ tín dụng!',
  },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
