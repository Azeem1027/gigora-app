/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#1A56DB',
        darkNavy: '#1E3A5F',
        lightBlue: '#EFF6FF',
        darkText: '#111827',
        customGray: '#6B7280',
        successGreen: '#059669',
      },
    },
  },
  plugins: [],
}