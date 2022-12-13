const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx"],
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
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".todo": {
          outline: "2px dashed deeppink",
          outlineOffset: "-1px",
          opacity: 0.5,
        },
      });
    }),
  ],
};
