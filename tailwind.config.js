/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5F2',
          100: '#FFE9E3',
          200: '#FFD4C7',
          300: '#FFAF99',
          400: '#FF7D5C',
          500: '#FF4D24', // Unboxie Signature Orange
          600: '#E63910',
          700: '#BF2B08',
          800: '#992308',
          900: '#7C200B',
          DEFAULT: '#FF4D24',
        }
      },
      fontFamily: {
        heading: ['"Instrument Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 0 0 1px rgba(226, 232, 240, 0.8), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 0 0 1px rgba(255, 77, 36, 0.25), 0 8px 16px -4px rgba(255, 77, 36, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
