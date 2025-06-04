/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eef5',
          100: '#ccdceb',
          200: '#99b9d7',
          300: '#6696c2',
          400: '#3373ae',
          500: '#00509a',
          600: '#00407b',
          700: '#00305c',
          800: '#00203e',
          900: '#00101f',
        },
        secondary: {
          50: '#e7f5f5',
          100: '#cfebeb',
          200: '#9fd6d7',
          300: '#6fc2c3',
          400: '#3fadaf',
          500: '#2c7a7b',
          600: '#236162',
          700: '#1a494a',
          800: '#123031',
          900: '#091818',
        },
        accent: {
          50: '#fbf6e5',
          100: '#f6edcb',
          200: '#eddb96',
          300: '#e4c862',
          400: '#dbb62d',
          500: '#d69e2e',
          600: '#ab7e25',
          700: '#805f1c',
          800: '#553f12',
          900: '#2b2009',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        heading: ['Merriweather', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};