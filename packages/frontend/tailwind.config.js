/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        collectiveDao: {
          primary: "#36456C",
          secondary: "#2D3248",
          accent: "#D4ED5B",
          neutral: "#C9D2DB",
          "base-100": "#ffffff",
          "base-200": "#D9D9D9",
          "base-300": "#e7e2df",
          "base-content": "#000000",
          success: "#6EDA60",
          warning: "#F9D551",
          error: "#ED7267",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontSize: {
        "6xl": "4rem",
      },
      fontFamily: {
        heading: ["CooperHewitt", "sans-serif"],
      },
    },
  },
};
