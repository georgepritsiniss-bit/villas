import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        brand: {
          50: "#f4f7f5",
          100: "#e3ece5",
          200: "#c6d8cd",
          300: "#9ebbac",
          400: "#719b8a",
          500: "#527e6f",
          600: "#3f6458",
          700: "#345148",
          800: "#2c413b",
          900: "#263733",
          950: "#131f1c",
        },
        sand: {
          50: "#fbf8f3",
          100: "#f5ede0",
          200: "#ead9bd",
          300: "#dcbf90",
          400: "#cda063",
          500: "#c08947",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -15px rgba(38, 55, 51, 0.25)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
