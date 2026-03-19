import type { Config } from "tailwindcss";

/**
 * UserJot-inspired design system: clean, modern SaaS.
 * Reference: https://userjot.com/
 * - Light backgrounds, clear hierarchy, generous spacing
 * - Single primary accent (teal), soft shadows, rounded cards
 */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d9488",
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        secondary: "#1e293b",
        tertiary: "#64748b",
        "background-light": "#f8fafc",
        "background-app": "#f1f5f9",
        // Legacy aliases used across the repo
        "background-dark": "#f6f6f8",
        "surface-dark": "#f1f5f9",
        "border-dark": "#e2e8f0",
        "card-dark": "#ffffff",
        "sidebar-dark": "#ffffff",
        "surface-card": "#ffffff",
        "border-default": "#e2e8f0",
        "border-muted": "#f1f5f9",
        "canvas": "#e2e8f0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        slide: ["var(--font-public-sans)", "Public Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        soft: "0 2px 8px -2px rgb(15 116 110 / 0.15), 0 4px 12px -4px rgb(15 116 110 / 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
