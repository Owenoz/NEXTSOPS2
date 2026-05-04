/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f0',
          100: '#b3e6d1',
          200: '#80d5b2',
          300: '#4dc493',
          400: '#1ab374',
          500: '#00a05b',
          600: '#008049',
          700: '#006037',
          800: '#004025',
          900: '#002013',
        },
        secondary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0075e6',
          600: '#005cb3',
          700: '#004380',
          800: '#002a4d',
          900: '#00111a',
        },
        accent: {
          50: '#fff7e6',
          100: '#ffe7b3',
          200: '#ffd780',
          300: '#ffc74d',
          400: '#ffb71a',
          500: '#e6a000',
          600: '#b37d00',
          700: '#805a00',
          800: '#4d3700',
          900: '#1a1400',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
