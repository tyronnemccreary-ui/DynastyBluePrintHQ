import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          50: "#f7f7f2",
          100: "#ebeade",
          200: "#d5d1bb",
          300: "#b9ae8f",
          400: "#9f8d68",
          500: "#85734f",
          600: "#695a3e",
          700: "#4b422f",
          800: "#302c23",
          900: "#171714",
          950: "#0b0c0a"
        },
        turf: {
          400: "#8fb98d",
          500: "#668b66",
          600: "#47684c"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        command: "0 24px 80px rgba(0, 0, 0, 0.28)"
      }
    }
  },
  plugins: []
};

export default config;
