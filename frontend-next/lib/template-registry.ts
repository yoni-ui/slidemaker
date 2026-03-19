import type { LayoutKey } from "@/lib/design-system"
import { LAYOUTS } from "@/lib/design-system"

export type TemplateRegistryEntry = {
  id: LayoutKey
  purpose: string[]
  supports: {
    title: boolean
    subtitle: boolean
    bullets: boolean
    image: boolean
    chart: boolean
  }
  density: "low" | "medium" | "high"
  exportSafe: boolean
}

const PURPOSE_MAP: Record<LayoutKey, string[]> = {
  hero: ["hero", "intro", "cover"],
  "title-card": ["hero", "intro", "cover"],
  "bullet-list": ["problem", "solution", "key-points", "features", "agenda"],
  agenda: ["agenda", "toc", "overview"],
  "two-column": ["comparison", "pros-cons", "before-after", "dual-topic"],
  "process-flow": ["process", "workflow", "steps", "phases"],
  "image-text": ["visual", "product", "diagram", "case-study"],
  "product-features": ["product", "features", "demo"],
  "title-only": ["divider", "section", "transition"],
  quote: ["quote", "testimonial", "close"],
  stats: ["metrics", "kpi", "numbers"],
  "team-overview": ["team", "people", "org"],
  testimonials: ["testimonials", "quotes", "social-proof"],
  "case-study": ["case-study", "success-story", "proof"],
  "company-values": ["values", "culture", "principles"],
  pricing: ["pricing", "plans", "packages"],
  "data-chart": ["metrics", "chart", "data"],
  timeline: ["timeline", "roadmap", "phases"],
  milestones: ["milestones", "achievements", "progress"],
  swot: ["swot", "strategy", "analysis"],
  "global-presence": ["global", "locations", "presence"],
  "next-steps": ["next-steps", "actions", "cta"],
  "partner-logos": ["partners", "clients", "logos"],
  "thank-you": ["close", "contact", "cta"],
  freeform: ["custom", "blank"],
}

const IMAGE_LAYOUTS: LayoutKey[] = ["image-text", "case-study", "product-features", "hero", "title-card"]
const CHART_LAYOUTS: LayoutKey[] = ["stats", "data-chart", "pricing"]

const DENSITY_MAP: Record<LayoutKey, "low" | "medium" | "high"> = {
  hero: "low",
  "title-card": "low",
  "bullet-list": "medium",
  agenda: "medium",
  "two-column": "medium",
  "process-flow": "medium",
  "image-text": "medium",
  "product-features": "high",
  "title-only": "low",
  quote: "low",
  stats: "medium",
  "team-overview": "high",
  testimonials: "medium",
  "case-study": "medium",
  "company-values": "high",
  pricing: "high",
  "data-chart": "medium",
  timeline: "medium",
  milestones: "medium",
  swot: "high",
  "global-presence": "medium",
  "next-steps": "medium",
  "partner-logos": "low",
  "thank-you": "medium",
  freeform: "low",
}

export const TEMPLATE_REGISTRY: TemplateRegistryEntry[] = LAYOUTS.map((l) => ({
  id: l.key,
  purpose: PURPOSE_MAP[l.key] ?? ["generic"],
  supports: {
    title: true,
    subtitle: l.hasSubtitle,
    bullets: l.hasBullets,
    image: IMAGE_LAYOUTS.includes(l.key),
    chart: CHART_LAYOUTS.includes(l.key),
  },
  density: DENSITY_MAP[l.key] ?? "medium",
  exportSafe: l.key !== "freeform",
}))

export const getTemplateRegistryForAgent = (): string => {
  return JSON.stringify(
    TEMPLATE_REGISTRY.map((t) => ({
      id: t.id,
      purpose: t.purpose,
      supports: t.supports,
      density: t.density,
      exportSafe: t.exportSafe,
    })),
    null,
    2
  )
}

export const getLayoutByPurpose = (purpose: string): LayoutKey | null => {
  const normalized = purpose.toLowerCase().replace(/\s+/g, "-")
  const entry = TEMPLATE_REGISTRY.find((t) =>
    t.purpose.some((p) => p.toLowerCase().replace(/\s+/g, "-") === normalized || p.includes(purpose))
  )
  return entry?.id ?? null
}

export const isValidLayout = (layout: string): layout is LayoutKey =>
  TEMPLATE_REGISTRY.some((t) => t.id === layout)
