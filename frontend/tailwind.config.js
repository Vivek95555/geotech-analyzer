/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: {
          green: "#2d6a4f",
          lightgreen: "#52b788",
          yellow: "#f4a261",
          red: "#e63946",
          bg: "#f8f4f0",
          card: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
