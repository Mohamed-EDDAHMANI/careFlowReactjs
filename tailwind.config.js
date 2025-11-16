/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'light': {
          'primary': '#ffffff',
          'text': '#2563eb',
          'bg': '#f3f4f6'
        },
        'dark': {
          'primary': '#1f2937',
          'text': '#2563eb',
          'bg': '#111827'
        }
      }
    },
  },
  plugins: [],
}
