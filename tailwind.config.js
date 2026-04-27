/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'president': {
          'dark': '#020617',
          'surface': '#0F172A',
          'gold': '#EAB308',
          'accent': '#38BDF8',
        }
      },
      backgroundImage: {
        'glass': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      }
    },
  },
  plugins: [],
}
