/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#B8860B',
          'gold-light': '#D4A528',
          'gold-dark': '#8B6508',
          accent: '#C75B2A',
          navy: '#2D2926',
          cream: '#FFF9F0',
          'cream-dark': '#F5EDE0',
        }
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
};
