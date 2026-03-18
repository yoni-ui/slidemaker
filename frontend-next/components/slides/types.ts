import type { LayoutKey } from "@/lib/design-system"

export type EditableSlide = {
  title: string
  subtitle: string | null
  bullets: string[]
  layout: LayoutKey
  theme: string
}

export type SlideProps = {
  slide: EditableSlide
}
