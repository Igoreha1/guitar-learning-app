import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e74c3c",
        "primary-dark": "#c0392b",
        secondary: "#3498db",
        dark: "#2c3e50",
        light: "#ecf0f1",
        gray: "#7f8c8d",
      },
    },
  },
  plugins: [],
};

export default config;