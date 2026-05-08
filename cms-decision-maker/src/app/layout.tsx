import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/utils/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Decision Maker',
  description: 'Hệ thống hỗ trợ đưa ra quyết định thông minh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body class name="bg-gray">
        <AntdRegistry>
          <ConfigProvider theme={antdTheme}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
