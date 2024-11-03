/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'dark-mode-gray-200': '#2b2a33',
        'dark-mode-gray-100': '#3d3d48',
      }
    },
  },
  plugins: [],
}

