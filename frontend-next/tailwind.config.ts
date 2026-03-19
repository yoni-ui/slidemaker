import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF0000",
        secondary: "#000000",
        tertiary: "#424242",
        "background-light": "#f8f6f6",
        "background-dark": "#f6f6f8",
        "surface-dark": "#f1f5f9",
        "border-dark": "#e2e8f0",
        "card-dark": "#ffffff",
        "sidebar-dark": "#ffffff",
        canvas: "#e2e8f0",
      },
      fontFamily: {
        display: ["var(--font-public-sans)", "Public Sans", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        slide: ["var(--font-public-sans)", "Public Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
} satisfies Config;
