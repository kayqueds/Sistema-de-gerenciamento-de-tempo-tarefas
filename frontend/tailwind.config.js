/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <--- ADICIONE ESTA LINHA
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // meus estilos personalizados
      colors: {
        primaria: '#6a5af9',
        secundaria: '#7f30ff',
        destaque: '#87848aff',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
