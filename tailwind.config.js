/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f3eeff',
          100: '#e3d5ff',
          200: '#c9b0ff',
          300: '#aa83ff',
          400: '#8f57ff',
          500: '#7C4DFF',
          600: '#6b36f5',
          700: '#5a23e0',
          800: '#4a1cba',
          900: '#3c1996',
        },
        accent: {
          400: '#26D4E8',
          500: '#00BCD4',
          600: '#0097A7',
        },
        surface: {
          900: '#0F0F1A',
          800: '#1A1A2E',
          700: '#232340',
          600: '#2d2d54',
        },
        mood: {
          great:     '#4CAF50',
          good:      '#8BC34A',
          okay:      '#FFC107',
          low:       '#FF9800',
          struggling:'#F44336',
        },
        crisis: '#FF6B6B',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 24px rgba(124, 77, 255, 0.35)',
        'glow-accent': '0 0 24px rgba(0, 188, 212, 0.35)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
