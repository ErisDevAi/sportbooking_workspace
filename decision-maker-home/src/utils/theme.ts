import type { ThemeConfig } from 'antd';

export const antdWarning = { strict: false };

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#E53E3E',
    colorInfo: '#E53E3E',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#FAFAFA',
  },
  components: {
    Button: {
      fontWeight: 600,
      controlHeight: 40,
    },
    Input: {
      controlHeight: 42,
    },
    Select: {
      controlHeight: 42,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Table: {
      headerBg: '#FAFAFA',
      headerColor: '#64748B',
      fontSize: 14,
    },
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      siderBg: '#1a1a2e',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(229, 62, 62, 0.2)',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.05)',
    },
  },
};
