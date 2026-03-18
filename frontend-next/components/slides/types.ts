import type { LayoutKey } from "@/lib/design-system"

export type EditableSlide = {
  title: string
  subtitle: string | null
  bullets: string[]
  layout: LayoutKey
  theme: string
  /** Fills the image-text layout left panel. Pollinations URL. */
  imagePrompt?: string
  /** Full-slide background image at low opacity. Pollinations URL. */
  backgroundPrompt?: string
}

export type SlideProps = {
  slide: EditableSlide
}
