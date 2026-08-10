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
          50: '#faf8f3',
          100: '#f5f1e7',
          200: '#e8dfc3',
          300: '#dbc89f',
          400: '#D4AF37', // Gold
          500: '#C5A028',
          600: '#A68821',
          700: '#87701B',
          800: '#685815',
          900: '#49400F',
        },
        dark: {
          950: '#000000',
          900: '#0a0a0a',
          800: '#141414',
          700: '#1e1e1e',
          600: '#282828',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
