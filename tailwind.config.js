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
          500: '#002FA7', // The Classic IKB
          600: '#002585',
        },
        pine: {
          400: '#FFF085',
          500: '#FFE135', // Vivid Songhua
        },
        primary: {
          50: '#edf4ff',
          100: '#dceaff',
          200: '#b6d5ff',
          300: '#80b3ff',
          400: '#4685ff',
          500: '#002FA7', // Replaced with Klein Blue base
          600: '#002585',
          700: '#001d6f',
          800: '#00185c',
          900: '#061649',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
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
      },
    },
  },
  plugins: [],
}
