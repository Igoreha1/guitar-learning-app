import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // ← добавляем поддержку тёмной темы через класс
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './features/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',
        'primary-dark': '#dc2626',
        'primary-light': '#fecaca',
        // Тёмная тема (по умолчанию)
        dark: '#0f0f1a',
        darker: '#07070f',
        'gray-dark': '#1a1a2e',
        // Светлая тема
        light: '#f8f9fa',
        'light-gray': '#e9ecef',
        'light-card': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;