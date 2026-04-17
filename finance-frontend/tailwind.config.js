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
          DEFAULT: '#0f172a', // Dark Navy/Blue (Cosmic style)
          light: '#1e293b',
          dark: '#020617',
        },
        secondary: {
          DEFAULT: '#facc15', // Power/Gold Yellow
          light: '#fde047',
          dark: '#eab308',
        },
        accent: {
          DEFAULT: '#3b82f6', // Tech Blue
          light: '#60a5fa',
          dark: '#2563eb',
        },
        background: '#f8fafc',
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'cosmic': '0 10px 25px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}
