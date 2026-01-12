/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f1115', // Lighter, richer charcoal
        surface: '#181b21', // Lighter surface for contrast
        primary: '#3b82f6', // Softer, more trustworthy blue
        secondary: '#8b5cf6', // Violet accent
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1400px',
        }
      }
    },
  },
  plugins: [],
}
