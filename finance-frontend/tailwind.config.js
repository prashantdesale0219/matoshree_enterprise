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
        primary: {
          DEFAULT: '#000000', // Pure Black
          light: '#1f2937',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#e11d48', // Vibrant Red
          light: '#fb7185',
          dark: '#9f1239',
        },
        accent: {
          DEFAULT: '#64748b', // Minimal Slate
          light: '#94a3b8',
          dark: '#475569',
        },
        background: '#ffffff',
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
