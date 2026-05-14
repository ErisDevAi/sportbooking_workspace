import type { Metadata, Viewport } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { antdTheme } from '@/utils/theme';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://decisionmaker.humg.edu.vn';
const SITE_NAME = 'Decision Maker';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E53E3E',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Decision Maker — Hỗ trợ ra quyết định hàng ngày | Vòng quay thông minh',
    template: '%s | Decision Maker',
  },
  description:
    'Decision Maker giúp bạn ra quyết định nhanh chóng bằng vòng quay thông minh. Hôm nay ăn gì? Làm gì? Đi đâu? Quay vòng quay, nhận gợi ý và hành động ngay! Miễn phí, không giới hạn lượt quay.',
  keywords: [
    'decision maker',
    'vòng quay quyết định',
    'ăn gì hôm nay',
    'hôm nay ăn gì',
    'hôm nay làm gì',
    'random picker',
    'spinner wheel',
    'ra quyết định',
    'quay vòng quay',
    'chọn ngẫu nhiên',
    'decision maker online',
    'ứng dụng ra quyết định',
    'vòng quay may mắn',
    'gợi ý món ăn',
    'gợi ý hoạt động',
    'HUMG',
    'đại học mỏ địa chất',
  ],
  authors: [
    { name: 'HUMG Students', url: SITE_URL },
  ],
  creator: 'HUMG - Trường Đại học Mỏ - Địa chất Hà Nội',
  publisher: 'Decision Maker Team',
  category: 'Productivity',
  classification: 'Ứng dụng hỗ trợ ra quyết định',

  // Open Graph
  openGraph: {
    title: 'Decision Maker — Không biết chọn gì? Để chúng tôi giúp bạn!',
    description:
      'Quay vòng quay Decision Maker để nhận gợi ý thông minh cho mọi quyết định hàng ngày. Ăn gì, làm gì, đi đâu — tất cả chỉ với 1 lần quay. Miễn phí!',
    type: 'website',
    locale: 'vi_VN',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Decision Maker - Vòng quay quyết định thông minh',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Decision Maker — Hỗ trợ ra quyết định hàng ngày',
    description:
      'Không biết chọn gì? Quay vòng quay Decision Maker để nhận gợi ý thông minh. Miễn phí, nhanh chóng, thú vị!',
    images: ['/og-image.png'],
    creator: '@humg_edu',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Alternates
  alternates: {
    canonical: SITE_URL,
    languages: {
      'vi-VN': SITE_URL,
    },
  },

  // Verification (thay bằng mã thật khi deploy)
  // verification: {
  //   google: 'your-google-verification-code',
  // },

  // App-specific
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',

  // Icons
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* JSON-LD Structured Data for SEO & AIO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Decision Maker',
              alternateName: 'Vòng quay quyết định',
              description: 'Ứng dụng hỗ trợ ra quyết định hàng ngày bằng vòng quay thông minh. Giúp bạn trả lời: Ăn gì hôm nay? Làm gì bây giờ? Đi đâu hôm nay?',
              url: SITE_URL,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'VND',
                description: 'Miễn phí hoàn toàn, không giới hạn lượt quay',
              },
              creator: {
                '@type': 'EducationalOrganization',
                name: 'Trường Đại học Mỏ - Địa chất Hà Nội (HUMG)',
                alternateName: 'HUMG',
                url: 'https://humg.edu.vn',
              },
              inLanguage: 'vi',
              isAccessibleForFree: true,
              featureList: [
                'Vòng quay quyết định ngẫu nhiên có trọng số',
                'Tạo danh mục tùy chỉnh',
                'Hệ thống Streak & Check-in',
                'Thuật toán Smart Random',
                'Thống kê và lịch hoạt động',
                'Bảng xếp hạng người dùng',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Decision Maker là gì?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Decision Maker là ứng dụng web giúp bạn ra quyết định hàng ngày bằng vòng quay thông minh. Bạn chỉ cần chọn danh mục (ăn gì, làm gì, đi đâu), thêm các lựa chọn và quay vòng quay để nhận kết quả ngẫu nhiên.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Decision Maker có miễn phí không?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Có, Decision Maker hoàn toàn miễn phí. Không giới hạn lượt quay, không có quảng cáo, không cần thẻ tín dụng.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Streak trong Decision Maker là gì?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Streak là chuỗi ngày liên tiếp bạn quay vòng quay và check-in xác nhận đã thực hiện quyết định. Streak giúp bạn xây dựng thói quen tích cực. Bỏ lỡ 1 ngày thì streak sẽ reset về 0.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Thuật toán Smart Random hoạt động như thế nào?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Smart Random sử dụng trọng số (weight) cho mỗi lựa chọn. Trọng số cao hơn = xác suất được chọn lớn hơn. Ngoài ra, hệ thống còn giảm 50% weight cho lựa chọn đã chọn gần đây (cooldown) và tăng 50% cho lựa chọn chưa từng thử (boost).',
                  },
                },
              ],
            }),
          }}
        />
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
