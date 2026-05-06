import type { Config } from 'tailwindcss';

const config: Config = {
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
        dark: '#0f0f1a',
        darker: '#07070f',
        'gray-dark': '#1a1a2e',
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;