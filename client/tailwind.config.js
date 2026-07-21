/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#f9d7a6',
          300: '#f5ba6e',
          400: '#f09534',
          500: '#ec7a11',
          600: '#dd6007',
          700: '#b74909',
          800: '#923a0f',
          900: '#763110',
        },
        calm: {
          50: '#f4f6f5',
          100: '#e2e8e4',
          200: '#c6d2c9',
          300: '#a2b3a7',
          400: '#7d9183',
          500: '#627669',
          600: '#4d5e53',
          700: '#404d44',
          800: '#363f39',
          900: '#2f3632',
        },
        warm: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f2d8b6',
          300: '#e8bd87',
          400: '#dd9b56',
          500: '#d58236',
          600: '#c66b2b',
          700: '#a45326',
          800: '#844325',
          900: '#6b3821',
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
