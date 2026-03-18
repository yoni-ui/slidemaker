import { HeroSlide } from "./HeroSlide"
import { BulletListSlide } from "./BulletListSlide"
import { TwoColumnSlide } from "./TwoColumnSlide"
import { ImageTextSlide } from "./ImageTextSlide"
import { TitleOnlySlide } from "./TitleOnlySlide"
import { QuoteSlide } from "./QuoteSlide"
import { StatsSlide } from "./StatsSlide"
import type { EditableSlide } from "./types"
import type { LayoutKey } from "@/lib/design-system"

/** Maps Stitch layouts without dedicated components to the closest existing component */
const LAYOUT_FALLBACK: Record<LayoutKey, LayoutKey> = {
  hero: "hero",
  "title-card": "hero",
  "bullet-list": "bullet-list",
  agenda: "bullet-list",
  "two-column": "two-column",
  "process-flow": "bullet-list",
  "image-text": "image-text",
  "product-features": "image-text",
  "title-only": "title-only",
  quote: "quote",
  stats: "stats",
  "team-overview": "bullet-list",
  testimonials: "quote",
  "case-study": "image-text",
  "company-values": "bullet-list",
  pricing: "stats",
  "data-chart": "stats",
  timeline: "bullet-list",
  milestones: "bullet-list",
  swot: "two-column",
  "global-presence": "stats",
  "next-steps": "bullet-list",
  "partner-logos": "title-only",
  "thank-you": "quote",
}

type Props = { slide: EditableSlide }

export const SlideRenderer = ({ slide }: Props) => {
  const layout = LAYOUT_FALLBACK[slide.layout] ?? "bullet-list"
  const effectiveSlide = { ...slide, layout }

  switch (layout) {
    case "hero":
      return <HeroSlide slide={effectiveSlide} />
    case "bullet-list":
      return <BulletListSlide slide={effectiveSlide} />
    case "two-column":
      return <TwoColumnSlide slide={effectiveSlide} />
    case "image-text":
      return <ImageTextSlide slide={effectiveSlide} />
    case "title-only":
      return <TitleOnlySlide slide={effectiveSlide} />
    case "quote":
      return <QuoteSlide slide={effectiveSlide} />
    case "stats":
      return <StatsSlide slide={effectiveSlide} />
    default:
      return <BulletListSlide slide={effectiveSlide} />
  }
}
