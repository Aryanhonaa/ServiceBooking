/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        kings:['Kings','serif'],
        k2d:['k2d','serif'],
        robotoCondensed: ['"Roboto Condensed"', 'sans-serif']
      }
    },
  },
  plugins: [],
}

