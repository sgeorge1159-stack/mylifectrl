/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff3f6',
          100: '#dbe8f5',
          200: '#b8d1eb',
          300: '#94b9e0',
          400: '#6fa1d5',
          500: '#3972d9',
          600: '#2e5cb0',
          700: '#2c569e',
          800: '#1f3d70',
          900: '#162a4f',
        },
        accent: {
          50: '#fdf2e9',
          100: '#fbe5d3',
          200: '#f7cba7',
          300: '#f3b17b',
          400: '#e9974f',
          500: '#d67e38',
          600: '#b8652c',
          700: '#9a4f20',
          800: '#7c3a14',
          900: '#5e2808',
        },
        calm: {
          50: '#f5f4f2',
          100: '#eae9e5',
          200: '#d8d7d4',
          300: '#b8b6b2',
          400: '#969490',
          500: '#767470',
          600: '#606367',
          700: '#4a4d51',
          800: '#373a3f',
          900: '#25282f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
