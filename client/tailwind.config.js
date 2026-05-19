/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Indigo-violet premium palette (#4F46E5 → #6366F1)
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Legacy primary kept for compat
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(79,70,229,0.06)',
        'card-lg': '0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(79,70,229,0.10)',
        'brand':   '0 4px 14px rgba(79,70,229,0.35)',
        'brand-lg':'0 8px 24px rgba(79,70,229,0.40)',
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-out both',
        'slide-up':  'slideUp 0.5s ease-out both',
        'slide-down':'slideDown 0.5s ease-out both',
        'pop':       'pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':   'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        pop: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition:  '400px 0' },
        },
      },
    },
  },
  plugins: [],
}
