/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      zIndex: {
        '1000': '1000',
        '2000': '2000',
        '3000': '3000',
        '4000': '4000',
        '5000': '5000',
      },
      backgroundImage: {
        'game-bg': "url('/bg.png')",
      },
    },
  },
  plugins: [],
}