/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090f',
          900: '#0d1117',
          800: '#161b22',
        }
      }
    },
  },
  plugins: [],
}
