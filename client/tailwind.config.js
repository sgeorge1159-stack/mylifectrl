/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7ffe5',
          100: '#eaffb8',
          200: '#d6ff7a',
          300: '#c3ff3d',
          400: '#b8ff2f',
          500: '#AEFF22',
          600: '#8dcc1b',
          700: '#6c9914',
          800: '#4b660d',
          900: '#2a3306',
        },
        accent: {
          50: '#e6faf4',
          100: '#b3f1df',
          200: '#80e8cb',
          300: '#4ddfb6',
          400: '#26d6a3',
          500: '#20C998',
          600: '#1aa47c',
          700: '#137f60',
          800: '#0d5a44',
          900: '#063528',
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
