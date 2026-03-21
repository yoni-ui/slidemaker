import type { Config } from "tailwindcss";

/**
 * Tailwind theme — primary scale must match `tailwindPrimaryColors` in `lib/design-tokens.ts`
 * (kept inline here because the bundler cannot resolve TS imports from this file).
 */
const primary = {
  DEFAULT: "#000000",
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
} as const;

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary,
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
        soft: "0 2px 8px -2px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
