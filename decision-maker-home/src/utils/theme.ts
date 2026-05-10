import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#7C3AED',
    colorInfo: '#7C3AED',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#F8FAFC',
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
      headerBg: '#F8FAFC',
      headerColor: '#64748B',
      fontSize: 14,
    },
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      siderBg: '#1e1b4b',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(124, 58, 237, 0.2)',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.05)',
    },
  },
};
