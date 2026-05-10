import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
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
