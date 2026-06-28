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
          50: "#fffaf0",
          100: "#f4efe4",
          200: "#d8d1c5",
          300: "#afa899",
          400: "#7d796f",
          500: "#5e5b54",
          600: "#46443f",
          700: "#2c2c29",
          800: "#17191c",
          900: "#0b111d",
          950: "#05070d"
        },
        turf: {
          400: "#f6b81a",
          500: "#d99a08",
          600: "#a96f00"
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
