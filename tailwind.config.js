/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#06152F',
        darkBlue: '#0B2A5B',
        royal: '#1457C5',
        blue: '#246BFE',
        gold: '#F5C400',
        goldLight: '#FFD84D',
        bg: '#F5F8FC',
        ink: '#101828',
        muted: '#667085',
      },
      fontFamily: {
        sans: ['Cairo', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
