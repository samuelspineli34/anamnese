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
        cyber: {
          bg: '#0a0b10',
          card: '#121526',
          primary: '#00ffcc',
          secondary: '#ff007f',
          text: '#e0e6ed'
        }
      }
    },
  },
  plugins: [],
};