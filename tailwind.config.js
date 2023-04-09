/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': {
          100: 'hsl(118, 68%, 80%)',
          200: 'hsl(118, 57%, 72%)',
          300: 'hsl(118, 47%, 63%)',
          400: 'hsl(118, 39%, 56%)',
          500: 'hsl(118, 33%, 50%)',
          600: 'hsl(118, 27%, 43%)',
          700: 'hsl(118, 37%, 39%)',
          800: 'hsl(118, 41%, 32%)',
          900: 'hsl(118, 44%, 25%)',
        }
      },
    },
  },
  plugins: [],
}

