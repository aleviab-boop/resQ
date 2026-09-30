/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A6E',
        'navy-dark': '#162E5A',
        sky: '#00A1E1',
        'sky-light': '#E6F6FD',
        green: { resq: '#1A8A4A', light: '#E8F9F0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 20px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
}
