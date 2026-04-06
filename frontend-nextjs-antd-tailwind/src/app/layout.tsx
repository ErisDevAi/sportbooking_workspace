import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { antdTheme } from '@/utils/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Next.js + Ant Design + TailwindCSS Admin Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ConfigProvider theme={antdTheme}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
