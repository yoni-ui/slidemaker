export const DS = {
  colors: {
    primary: "#ec5b13",
    backgroundDark: "#221610",
    backgroundLight: "#f8f6f6",
    canvas: "#1a110c",
    sidebarDark: "#181818",
    scrollThumb: "#4a372d",
    cardDark: "#1e1e1e",
  },
  font: "'Public Sans', sans-serif",
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
} as const

export type LayoutKey =
  | "hero"
  | "bullet-list"
  | "two-column"
  | "image-text"
  | "title-only"
  | "quote"
  | "stats"

export type LayoutMeta = {
  key: LayoutKey
  label: string
  icon: string
  description: string
  hasBullets: boolean
  hasSubtitle: boolean
}

export const LAYOUTS: LayoutMeta[] = [
  {
    key: "hero",
    label: "Hero",
    icon: "crop_landscape",
    description: "Large centered title — perfect for opening slides",
    hasBullets: false,
    hasSubtitle: true,
  },
  {
    key: "bullet-list",
    label: "Bullets",
    icon: "format_list_bulleted",
    description: "Title with a clean vertical list of key points",
    hasBullets: true,
    hasSubtitle: false,
  },
  {
    key: "two-column",
    label: "Two Column",
    icon: "view_column",
    description: "Side-by-side columns — ideal for comparisons",
    hasBullets: true,
    hasSubtitle: false,
  },
  {
    key: "image-text",
    label: "Image + Text",
    icon: "image",
    description: "Visual on left, title and points on right",
    hasBullets: true,
    hasSubtitle: false,
  },
  {
    key: "title-only",
    label: "Title Only",
    icon: "title",
    description: "Large centered title — great as a section divider",
    hasBullets: false,
    hasSubtitle: true,
  },
  {
    key: "quote",
    label: "Quote",
    icon: "format_quote",
    description: "Impactful pull-quote with attribution",
    hasBullets: false,
    hasSubtitle: true,
  },
  {
    key: "stats",
    label: "Stats",
    icon: "bar_chart",
    description: "2–4 large metric numbers for KPI slides",
    hasBullets: true,
    hasSubtitle: false,
  },
]

export const LAYOUT_MAP = Object.fromEntries(
  LAYOUTS.map((l) => [l.key, l])
) as Record<LayoutKey, LayoutMeta>

export const SLIDE_W = 960
export const SLIDE_H = 540
