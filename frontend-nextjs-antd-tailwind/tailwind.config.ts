import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
        sidebar: '#001529',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to avoid conflicts with Ant Design
  },
};

export default config;
