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
        primary: "#ec5b13",
        "background-light": "#f8f6f6",
        "background-dark": "#221610",
        "surface-dark": "#161B28",
        "border-dark": "#232936",
        "card-dark": "#1e1e1e",
        "sidebar-dark": "#181818",
        canvas: "#1a110c",
      },
      fontFamily: {
        display: ["var(--font-public-sans)", "Public Sans", "sans-serif"],
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
