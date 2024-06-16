/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      'primary':"#B09FCA",
      'secondary':'#544275',
      'tertiary':'#27272A'
    }},

  },
  plugins: [],
}

