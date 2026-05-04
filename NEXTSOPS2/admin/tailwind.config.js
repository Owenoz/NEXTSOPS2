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
          50: '#e6f2fc',
          100: '#b3d9f7',
          200: '#80c0f2',
          300: '#4da7ed',
          400: '#1a8ee8',
          500: '#0075e6',
          600: '#005eb8',
          700: '#00468a',
          800: '#002f5c',
          900: '#00172e',
        },
        accent: {
          50: '#fcf3e6',
          100: '#f7ddb3',
          200: '#f2c780',
          300: '#edb14d',
          400: '#e89b1a',
          500: '#e6a000',
          600: '#b88000',
          700: '#8a6000',
          800: '#5c4000',
          900: '#2e2000',
        },
      },
    },
  },
  plugins: [],
}
