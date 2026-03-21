import { designTokens } from "./design-tokens"

/** Slide / export runtime tokens — aligned with `design-tokens.ts` + Tailwind */
export const DS = {
  colors: {
    primary: designTokens.colors.primary,
    secondary: "#0f172a",
    tertiary: "#475569",
    backgroundDark: designTokens.colors.backgroundDark,
    backgroundLight: designTokens.colors.backgroundLight,
    canvas: designTokens.colors.canvas,
    sidebarDark: "#ffffff",
    scrollThumb: designTokens.colors.accentMuted,
    cardDark: "#ffffff",
  },
  font: "'Public Sans', sans-serif",
  radius: {
    button: designTokens.radius.button,
    sm: designTokens.radius.sm,
    md: designTokens.radius.md,
    lg: designTokens.radius.lg,
    full: designTokens.radius.full,
  },
} as const

export { designTokens } from "./design-tokens"

export type LayoutKey =
  | "hero"
  | "title-card"
  | "bullet-list"
  | "agenda"
  | "two-column"
  | "process-flow"
  | "image-text"
  | "product-features"
  | "title-only"
  | "quote"
  | "stats"
  | "team-overview"
  | "testimonials"
  | "case-study"
  | "company-values"
  | "pricing"
  | "data-chart"
  | "timeline"
  | "milestones"
  | "swot"
  | "global-presence"
  | "next-steps"
  | "partner-logos"
  | "thank-you"
  | "freeform"

export type LayoutMeta = {
  key: LayoutKey
  label: string
  icon: string
  description: string
  hasBullets: boolean
  hasSubtitle: boolean
}

export const LAYOUTS: LayoutMeta[] = [
  { key: "hero", label: "Hero", icon: "crop_landscape", description: "Large centered title — perfect for opening slides", hasBullets: false, hasSubtitle: true },
  { key: "title-card", label: "Title Card", icon: "badge", description: "Structured title with presenter info footer", hasBullets: false, hasSubtitle: true },
  { key: "bullet-list", label: "Bullets", icon: "format_list_bulleted", description: "Title with a clean vertical list of key points", hasBullets: true, hasSubtitle: false },
  { key: "agenda", label: "Agenda", icon: "list_alt", description: "Numbered agenda items in a 2-column grid", hasBullets: true, hasSubtitle: false },
  { key: "two-column", label: "Two Column", icon: "view_column", description: "Side-by-side columns — ideal for comparisons", hasBullets: true, hasSubtitle: false },
  { key: "process-flow", label: "Process Flow", icon: "account_tree", description: "Horizontal step-by-step process with numbered steps", hasBullets: true, hasSubtitle: false },
  { key: "image-text", label: "Image + Text", icon: "image", description: "Visual on left, title and points on right", hasBullets: true, hasSubtitle: false },
  { key: "product-features", label: "Product Features", icon: "smartphone", description: "Feature list flanking a central product mockup", hasBullets: true, hasSubtitle: false },
  { key: "title-only", label: "Title Only", icon: "title", description: "Large centered title — great as a section divider", hasBullets: false, hasSubtitle: true },
  { key: "quote", label: "Quote", icon: "format_quote", description: "Impactful pull-quote with attribution", hasBullets: false, hasSubtitle: true },
  { key: "stats", label: "Stats", icon: "bar_chart", description: "2–4 large metric numbers for KPI slides", hasBullets: true, hasSubtitle: false },
  { key: "team-overview", label: "Team Overview", icon: "groups", description: "Grid of team member cards with names and roles", hasBullets: true, hasSubtitle: false },
  { key: "testimonials", label: "Testimonials", icon: "rate_review", description: "3 quote cards from customers or stakeholders", hasBullets: true, hasSubtitle: false },
  { key: "case-study", label: "Case Study", icon: "folder_special", description: "Success story with metrics, challenge, and solution", hasBullets: true, hasSubtitle: true },
  { key: "company-values", label: "Company Values", icon: "diamond", description: "Grid of value cards with icons (Innovation, Integrity, etc.)", hasBullets: true, hasSubtitle: false },
  { key: "pricing", label: "Pricing", icon: "sell", description: "3-column pricing comparison (Starter, Pro, Enterprise)", hasBullets: true, hasSubtitle: false },
  { key: "data-chart", label: "Data Chart", icon: "show_chart", description: "KPI stats row + bar chart with insight footer", hasBullets: true, hasSubtitle: false },
  { key: "timeline", label: "Timeline", icon: "timeline", description: "Horizontal timeline with phases and dates", hasBullets: true, hasSubtitle: false },
  { key: "milestones", label: "Milestones", icon: "flag", description: "Key accomplishments with dates and progress", hasBullets: true, hasSubtitle: false },
  { key: "swot", label: "SWOT Analysis", icon: "grid_on", description: "2×2 quadrant grid: Strengths, Weaknesses, Opportunities, Threats", hasBullets: true, hasSubtitle: false },
  { key: "global-presence", label: "Global Presence", icon: "public", description: "Map with region pins and office/employee stats", hasBullets: true, hasSubtitle: false },
  { key: "next-steps", label: "Next Steps", icon: "checklist", description: "Action checklist with CTA button", hasBullets: true, hasSubtitle: false },
  { key: "partner-logos", label: "Partner Logos", icon: "handshake", description: "Grid of partner/client logos", hasBullets: false, hasSubtitle: false },
  { key: "thank-you", label: "Thank You", icon: "celebration", description: "Closing slide with contact info and CTAs", hasBullets: true, hasSubtitle: false },
  { key: "freeform", label: "Freeform", icon: "edit_square", description: "Add text boxes anywhere, drag to position, snap to grid", hasBullets: false, hasSubtitle: false },
]

export const LAYOUT_MAP = Object.fromEntries(
  LAYOUTS.map((l) => [l.key, l])
) as Record<LayoutKey, LayoutMeta>

export const LAYOUT_KEYS: LayoutKey[] = LAYOUTS.map((l) => l.key)

export const SLIDE_W = 960
export const SLIDE_H = 540

/** Grid cell size for snap-to-grid (freeform layout) */
export const GRID_CELL = 24

/** Rich descriptions for AI (Gemini/Groq) — choose layout based on user content */
export const LAYOUT_PROMPT_DESCRIPTIONS: Record<LayoutKey, string> = {
  hero: "Full-width opening slide. Large centered title (up to 10 words) with optional subtitle. No bullets. Use for the FIRST slide of every deck.",
  "title-card": "Structured title slide with logo area, category badge, and footer (presenter name, date, location). Use when the deck needs a formal corporate opening. Put presenter info in subtitle or bullets as 'Name | Title' and 'Date | Location'.",
  "bullet-list": "Title at top, vertical list of bullet points below. Use for key points, features, agenda items, or process steps. Include 3–6 concise bullets (under 12 words each).",
  agenda: "Table of contents or agenda. Numbered items in a 2-column grid. Format bullets as '01 | Topic Name | Short description'. Include 4–6 agenda items.",
  "two-column": "Title header, then two equal columns. Left gets first half of bullets, right gets second half. Use for comparisons, pros/cons, before/after, dual topics. Include 4–6 bullets total.",
  "process-flow": "Horizontal step-by-step process. Format bullets as 'Step title | Description'. Include 3–6 steps. Use for workflows, implementation phases, or sequential processes.",
  "image-text": "Left 45% image placeholder, right 55% title and bullets. Use when content has a strong visual, diagram, or product screenshot. Include 3–4 bullets.",
  "product-features": "Feature list on left and right, center placeholder for product mockup. Format bullets as 'Feature name | Description'. Use for product demos or feature highlights. Include 4–6 bullets.",
  "title-only": "Large centered title (up to 8 words) with optional subtitle. No bullets. Use as a section divider between major topics.",
  quote: 'Pull-quote centered on slide. Put FULL quote in "title" (wrap in quotes). Put attribution in "subtitle". Bullets MUST be []. Use for testimonials or as the LAST slide (strong close).',
  stats: "Title header, then 2–4 large stat cards. Format EACH bullet as 'VALUE | Label' e.g. '94% | Satisfaction', '$2.1M | ARR'. Use ONLY for concrete metrics or KPIs. Include 2–4 bullets.",
  "team-overview": "Grid of team member cards. Format bullets as 'Name | Role | Short quote'. Include 3–6 team members.",
  testimonials: "3 customer/stakeholder quote cards. Format bullets as 'Quote text | Name | Role'. Include exactly 3 testimonials.",
  "case-study": "Success story with metrics. Use title for project name, subtitle for challenge summary. Format bullets as 'Metric | Value' (e.g. '+42% | Efficiency') plus solution points. Include 4–6 bullets.",
  "company-values": "Grid of company values (Innovation, Integrity, Collaboration, etc.). Format bullets as 'Value name | Description'. Include 4–6 values.",
  pricing: "3-tier pricing comparison. Format bullets as 'Plan name | Price | Feature1, Feature2, Feature3'. Include 3 plans. Use when user mentions pricing, plans, or packages.",
  "data-chart": "KPI stats row + chart area. Format bullets as 'Label | Value | up/down' for KPIs. Use when user mentions metrics, charts, or data visualization.",
  timeline: "Horizontal timeline with phases. Format bullets as 'Q1 2024 | Phase name | Description'. Include 4–6 phases. Use for roadmaps or project timelines.",
  milestones: "Key accomplishments with dates. Format bullets as 'Date | Milestone | done/pending'. Include 4–6 milestones.",
  swot: "SWOT analysis 2×2 grid. Format bullets as 'S: item', 'W: item', 'O: item', 'T: item'. Include 2–3 items per quadrant (8–12 bullets total). Use when user mentions SWOT, strategy, or analysis.",
  "global-presence": "Map with region pins. Format bullets as 'Region | Offices | Employees'. Include 4–6 regions. Use when user mentions global, offices, or locations.",
  "next-steps": "Action checklist. Format bullets as '✓ Action item' (done) or '○ Action item' (pending). Use for action plans or closing slides. Include 3–5 items.",
  "partner-logos": "Grid of partner/client logos. Title only, no bullets. Use when user mentions partners, clients, or logos.",
  "thank-you": "Closing slide with contact info. Format bullets as 'Email | address', 'Website | url', etc. Use as the LAST slide with contact details and CTAs.",
  freeform: "Blank canvas for manual editing. Add text boxes and position freely.",
}

export const buildLayoutDescriptions = (): string =>
  Object.entries(LAYOUT_PROMPT_DESCRIPTIONS)
    .map(([key, desc]) => `- "${key}": ${desc}`)
    .join("\n")
