const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      height: {
        "app/header": "4rem",
        "app/main": "calc(100vh - 4rem)",
      },
    },
  },
  plugins: [
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
