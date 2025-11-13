/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // meus estilos personalizados
      colors: {
        primaria: '#1DA1F2',
        secundaria: '#14171A',
        destaque: '#657786',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
