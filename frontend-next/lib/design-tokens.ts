/**
 * Central design tokens — single source of truth for brand colors and radii.
 *
 * Keep in sync with:
 * - `tailwind.config.ts` (`primary` + `shadow.soft` — inlined there; bundler cannot import this file from Tailwind config)
 * - `app/globals.css` (`:root` CSS variables)
 * - `lib/design-system.ts` (`DS` for slide/export code)
 */
export const designTokens = {
  colors: {
    /** Main brand / accent (was teal #0d9488) */
    primary: "#000000",
    primaryForeground: "#ffffff",
    secondary: "#1e293b",
    tertiary: "#64748b",
    backgroundLight: "#f8fafc",
    backgroundApp: "#f1f5f9",
    backgroundDark: "#f6f6f8",
    canvas: "#e2e8f0",
    borderDefault: "#e2e8f0",
    /** Scrollbars, subtle accents */
    accentMuted: "#525252",
  },
  /** Border radii — buttons use `button` (square). Cards/inputs can use sm/md/lg. */
  radius: {
    button: "0px",
    none: "0px",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadow: {
    /** Soft elevation using neutral tint (not brand-colored) */
    soft: "0 2px 8px -2px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.08)",
  },
} as const

/** Tailwind `theme.extend.colors.primary` scale (black-forward neutrals). */
export const tailwindPrimaryColors = {
  DEFAULT: designTokens.colors.primary,
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
} as const

/** Optional: compose shared UI class fragments (use with `cn()` if you add clsx later). */
export const uiClasses = {
  /** Square interactive controls */
  buttonRadius: "rounded-none",
  /** Primary filled button (Tailwind tokens) */
  buttonPrimary:
    "rounded-none bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700",
  buttonSecondary:
    "rounded-none border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
} as const
