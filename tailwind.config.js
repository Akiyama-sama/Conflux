/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          "level-1": "#7dd3fc",
          "level-2": "#669EC4",
          "level-3": "#0c4a6e",
          "level-4": "#fb923c",
          "level-5": "#f87171",
        },
        
      },
      fontFamily: {
        mono:['Fira Code', ...defaultTheme.fontFamily.mono],
      },
    },
    plugins: [],
  }