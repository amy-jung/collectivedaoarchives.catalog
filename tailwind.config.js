/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("daisyui")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        collectiveDao: {
          primary: "#65c3c8",
          secondary: "#ef9fbc",
          accent: "#eeaf3a",
          neutral: "#291334",
          "base-100": "#faf7f5",
          "base-200": "#efeae6",
          "base-300": "#e7e2df",
          "base-content": "#291334",
        },
      },
      "dark",
    ],
  },
  theme: {},
};
