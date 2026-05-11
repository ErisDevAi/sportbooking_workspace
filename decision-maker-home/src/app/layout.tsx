import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { antdTheme } from '@/utils/theme';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Decision Maker — Hỗ trợ đưa ra quyết định thông minh',
    template: '%s | Decision Maker',
  },
  description:
    'Decision Maker giúp bạn đưa ra quyết định nhanh chóng với vòng quay thông minh. Ăn gì hôm nay? Làm gì bây giờ? Quay và hành động ngay! Miễn phí, không giới hạn.',
  keywords: [
    'decision maker',
    'vòng quay quyết định',
    'ăn gì hôm nay',
    'hôm nay ăn gì',
    'random picker',
    'spinner wheel',
    'ra quyết định',
    'quay vòng quay',
    'chọn ngẫu nhiên',
    'decision maker online',
  ],
  authors: [{ name: 'HUMG Students' }],
  openGraph: {
    title: 'Decision Maker — Hỗ trợ đưa ra quyết định thông minh',
    description:
      'Không biết chọn gì? Quay vòng quay Decision Maker để nhận gợi ý thông minh. Miễn phí, nhanh chóng, thú vị!',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Decision Maker',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' fill='%23E53E3E'/><circle cx='12' cy='12' r='3' fill='white'/><line x1='12' y1='2' x2='12' y2='7' stroke='white' stroke-width='2' stroke-linecap='round'/><line x1='12' y1='17' x2='12' y2='22' stroke='white' stroke-width='2' stroke-linecap='round'/><line x1='2' y1='12' x2='7' y2='12' stroke='white' stroke-width='2' stroke-linecap='round'/><line x1='17' y1='12' x2='22' y2='12' stroke='white' stroke-width='2' stroke-linecap='round'/></svg>" />
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider theme={antdTheme}>
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
