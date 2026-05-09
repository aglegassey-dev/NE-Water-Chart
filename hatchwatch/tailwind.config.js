/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          900: '#1A2410',
          800: '#2D3A1F',
          700: '#3D4E2A',
          600: '#4E6235',
        },
        amber: { DEFAULT: '#F59E0B', dark: '#B45309' },
        teal:  { DEFAULT: '#0D9488', light: '#14B8A6' },
        slate: { muted: '#94A3B8', faint: '#475569' },
      },
    },
  },
  plugins: [],
}
