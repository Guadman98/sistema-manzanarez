/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a', // Verde Liceo Ecológico principal
          600: '#15803d', // Verde bosque oscuro
          700: '#166534', // Verde pino
          800: '#14532d', // Verde selva profunda
          900: '#064e3b',
        },
        darkBackground: '#0b0f19',
        glassBackground: 'rgba(15, 23, 42, 0.45)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      }
    },
  },
  plugins: [],
}
