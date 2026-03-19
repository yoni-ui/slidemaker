import type { LayoutKey } from "@/lib/design-system"

export type SlideElement = {
  id: string
  type: "text" | "image"
  x: number
  y: number
  w: number
  h: number
  content: string
  fontSize?: number
}

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
  /** Freeform layout: positioned elements (snap to grid) */
  elements?: SlideElement[]
}

export type SlideProps = {
  slide: EditableSlide
  editMode?: boolean
  onUpdate?: (patch: Partial<EditableSlide>) => void
  onUpdateBullet?: (index: number, value: string) => void
  onAddBullet?: () => void
  onRemoveBullet?: (index: number) => void
}
