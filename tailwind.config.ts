/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Use system/global dark mode preference
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",   // Next.js
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
