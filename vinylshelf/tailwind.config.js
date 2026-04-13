/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vinyl:   '#1C1B1B',
        label:   '#E2C354',
        shelf:   '#B8884E',
        cream:   '#F5F0E8',
        accent:  '#D94F44',
        spotify: '#1DB954',
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        body:    ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}