/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./app/root.tailwind.css"],
  theme: {
    extend: {
      height: {
        "app/header": "3rem",
        "app/main": "calc(100vh - 3rem)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
