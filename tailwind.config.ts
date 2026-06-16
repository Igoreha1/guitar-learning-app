import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e74c3c',
          dark: '#c0392b',
          light: '#ec7063',
          50: '#fdedeb',
          100: '#fadbd8',
          200: '#f5b7b1',
          300: '#f1948a',
          400: '#ec7063',
          500: '#e74c3c',
          600: '#cb4335',
          700: '#b03a2e',
          800: '#943126',
          900: '#78281f',
        },
        dark: '#0f0f1a',
        gray: {
          dark: '#1a1a2e',
          darker: '#0a0a0f',
          DEFAULT: '#6c6c7a',
          50: '#f9f9fb',
          100: '#f0f0f5',
          200: '#e4e4ea',
          300: '#cbcbd4',
          400: '#a1a1ae',
          500: '#7c7c8a',
          600: '#5a5a66',
          700: '#3a3a44',
          800: '#2a2a33',
          900: '#1a1a22',
        },
        'bg-card': {
          DEFAULT: '#1e1e2e',
          light: '#ffffff',
        },
        'border-color': {
          DEFAULT: '#2a2a3a',
          light: '#e5e5e5',
        },
        'text-primary': {
          DEFAULT: '#ffffff',
          light: '#1a1a2e',
        },
        'text-secondary': {
          DEFAULT: '#a0a0b0',
          light: '#666666',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(231, 76, 60, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(231, 76, 60, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
        'gradient-light': 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(231, 76, 60, 0.5)',
        'glow-lg': '0 0 40px rgba(231, 76, 60, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 8px 30px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.2)',
        'inner-light': 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
        'inner-dark': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.text-secondary.DEFAULT'),
            '--tw-prose-body': theme('colors.text-secondary.DEFAULT'),
            '--tw-prose-headings': theme('colors.text-primary.DEFAULT'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.text-primary.DEFAULT'),
            '--tw-prose-counters': theme('colors.text-secondary.DEFAULT'),
            '--tw-prose-bullets': theme('colors.primary.DEFAULT'),
            '--tw-prose-hr': theme('colors.border-color.DEFAULT'),
            '--tw-prose-quotes': theme('colors.text-primary.DEFAULT'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-captions': theme('colors.text-secondary.DEFAULT'),
            '--tw-prose-code': theme('colors.primary.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.text-primary.DEFAULT'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.border-color.DEFAULT'),
            '--tw-prose-td-borders': theme('colors.border-color.DEFAULT'),
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.gray.400'),
            '--tw-prose-bullets': theme('colors.primary.DEFAULT'),
            '--tw-prose-hr': theme('colors.gray.700'),
            '--tw-prose-quotes': theme('colors.white'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-captions': theme('colors.gray.400'),
            '--tw-prose-code': theme('colors.primary.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.gray.200'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.600'),
            '--tw-prose-td-borders': theme('colors.gray.600'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config