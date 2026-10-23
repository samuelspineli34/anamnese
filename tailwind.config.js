/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        anamnese: {
          void: '#06080d',
          base: '#0a0d14',
          surface: '#0f1420',
          elevated: '#141b2b',
          border: '#1a2337',
          cyan: '#06b6d4',
          teal: '#14b8a6',
          alert: '#ef4444',
          warn: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
};