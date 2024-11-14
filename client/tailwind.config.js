/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#f7f7f7",
        secondary: "#151614",
        tertiary: "#fbe7e3",
        details: "#e0e0e0",
      },
    },
  },
  plugins: [],
};
