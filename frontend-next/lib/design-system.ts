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

export const LAYOUT_KEYS: LayoutKey[] = LAYOUTS.map((l) => l.key)

export const SLIDE_W = 960
export const SLIDE_H = 540

/** Rich descriptions used in the Groq system prompt (mirrors backend/app/design_system.py) */
export const LAYOUT_PROMPT_DESCRIPTIONS: Record<LayoutKey, string> = {
  hero: "Full-width opening slide. Large centered title (up to 10 words) with an optional short subtitle. No bullets. Use for the FIRST slide of every deck.",
  "bullet-list": "Title at the top and a vertical list of bullet points below, each prefixed with an orange dot. Use for key points, features, agenda items, or process steps. Include 3–6 concise bullets (under 12 words each).",
  "two-column": "Title header at the top, then the canvas splits into two equal columns. Left column gets the first half of bullets, right column gets the second half. Use for comparisons, pros/cons, before/after, or dual topics. Include 4–6 bullets total.",
  "image-text": "Left 45% of the slide is an image placeholder. Right 55% shows the title and bullet points. Use when the content has a strong visual, diagram, product screenshot, or conceptual illustration. Include 3–4 bullets.",
  "title-only": "Large centered title (up to 8 words) with an optional short subtitle. No bullets. Use as a section divider between major topics or for transitional slides.",
  quote: 'An impactful pull-quote centered on the slide. Put the FULL quote text in "title" (wrap in double-quotes). Put the attribution in "subtitle". Bullets MUST be an empty array []. Use for key statements, testimonials, or as the LAST slide (strong close).',
  stats: "Title header at the top, then 2–4 large stat cards in a row. Format EACH bullet as \"VALUE | Label\" e.g. \"94% | Customer Satisfaction\". Use ONLY for slides that highlight concrete metrics, KPIs, or quantitative evidence. Include exactly 2–4 bullets.",
}

export const buildLayoutDescriptions = (): string =>
  Object.entries(LAYOUT_PROMPT_DESCRIPTIONS)
    .map(([key, desc]) => `- "${key}": ${desc}`)
    .join("\n")
