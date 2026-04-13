/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  theme: {
    extend: {
      colors: {
        // ─── Backgrounds ───────────────────────────────────
        base:     '#1A1A1F', // fundo principal
        surface:  '#22222A', // cards e modais
        elevated: '#2C2C38', // elementos elevados
        border:   '#3A3A4A', // bordas

        // ─── Destaques ─────────────────────────────────────
        pink:    '#FF4D8F', // CTA principal, label do disco, hovers
        purple:  '#4A1A6E', // superfícies de apoio, badges

        // ─── Texto ─────────────────────────────────────────
        white:  '#F0EEF5', // texto principal
        muted:  '#6B6880', // texto secundário

        // ─── Marca ─────────────────────────────────────────
        spotify: '#1DB954',
      },

      fontFamily: {
        // gothic = UnifrakturMaguntia — só para títulos grandes
        gothic: ['UnifrakturMaguntia', 'cursive'],
        // body = Space Mono — toda a UI
        body:   ['Space Mono', 'monospace'],
      },
    },
  },

  plugins: [],
}