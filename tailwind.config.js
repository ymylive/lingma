/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        klein: {
          50: '#e6ecf7',
          100: '#b3c2e6',
          200: '#8099d5',
          300: '#4d70c4',
          400: '#1a47b3',
          500: '#002FA7', // The Classic IKB
          600: '#002585',
          700: '#001d6f',
          800: '#00185c',
          900: '#061649',
        },
        pine: {
          50: '#fffce6',
          100: '#fff7b3',
          200: '#fff280',
          300: '#ffed4d',
          400: '#FFF085',
          500: '#FFE135', // Vivid Songhua
          600: '#e6c800',
          700: '#b39c00',
          800: '#807000',
          900: '#4d4300',
        },
        // Parchment — Editorial 电影感区块用的暖米底色（与 hero film 动画对齐）
        parchment: {
          50: '#faf7f0',
          100: '#f2ece0',
          200: '#ede7d8', // 与 hero film 底色匹配
          300: '#e4dcc7',
          400: '#d4c7a8',
          500: '#b8a988',
          600: '#8a7d5f',
          700: '#5e5440',
          800: '#3a3427',
          900: '#1f1c15',
        },
        ink: {
          50: '#f4f3f0',
          100: '#d9d7d0',
          200: '#b3afa2',
          300: '#8a8575',
          400: '#5e584a',
          500: '#3d382c',
          600: '#2a2620',
          700: '#1a1816',
          800: '#12110f',
          900: '#090807',
        },
        primary: {
          50: '#edf4ff',
          100: '#dceaff',
          200: '#b6d5ff',
          300: '#80b3ff',
          400: '#4685ff',
          500: '#002FA7',
          600: '#002585',
          700: '#001d6f',
          800: '#00185c',
          900: '#061649',
        },
      },
      fontFamily: {
        // Editorial display — Source Serif 4（与 hero film 动画统一）
        serif: ['"Source Serif 4"', '"Noto Serif SC"', 'Georgia', 'ui-serif', 'serif'],
        // Body 保持现有（Plus Jakarta Sans / Inter）
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        // 数据 / 编号 / eyebrow
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        // Editorial eyebrow 专用
        'eyebrow': '0.22em',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        // 签名手写下划线 draw-in
        'underline-draw': 'underlineDraw 900ms cubic-bezier(0.22, 1, 0.36, 1) 400ms forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        underlineDraw: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
}
