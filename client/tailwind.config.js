/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryDark: "#67C22A",
        secondaryDark: "#FBE071",
      },
    },
  },
  plugins: [],
};
