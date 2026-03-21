import type { LayoutKey } from "@/lib/design-system"
import { LAYOUT_KEYS } from "@/lib/design-system"
import { isValidLayout } from "@/lib/template-registry"
import type { EditableSlide } from "@/components/slides/types"

const MAX_BULLETS = 6
const MAX_TITLE_LENGTH = 80

export type SlideSpec = {
  purpose: string
  title: string
  subtitle?: string | null
  bullets?: string[]
  visualIntent?: string
  imagePrompt?: string
  backgroundPrompt?: string
  /** Optional hint for design agent (e.g. default, dark) */
  theme?: string | null
  /** Optional CSS color hint for accents */
  accentColor?: string | null
}

export type DeckSpec = {
  deckTitle: string
  audience?: string
  tone?: string
  slides: SlideSpec[]
}

export type RenderSpec = {
  slides: EditableSlide[]
  warnings?: string[]
}

export const validateDeckSpec = (deck: DeckSpec): DeckSpec => {
  const validatedSlides = deck.slides.map((slide) => ({
    ...slide,
    title: (slide.title ?? "Slide").slice(0, MAX_TITLE_LENGTH),
    subtitle: slide.subtitle?.slice(0, MAX_TITLE_LENGTH) ?? null,
    bullets: (slide.bullets ?? []).slice(0, MAX_BULLETS),
    theme: slide.theme?.trim() || undefined,
    accentColor: slide.accentColor?.trim() || undefined,
  }))
  return {
    ...deck,
    deckTitle: (deck.deckTitle ?? "Untitled Deck").slice(0, MAX_TITLE_LENGTH),
    slides: validatedSlides,
  }
}

export const validateRenderSpec = (
  spec: RenderSpec,
  fallbackLayout: LayoutKey = "bullet-list"
): RenderSpec => {
  const slides: EditableSlide[] = spec.slides.map((s) => {
    const layout = isValidLayout(s.layout) ? s.layout : fallbackLayout
    return {
      title: (s.title ?? "Slide").slice(0, MAX_TITLE_LENGTH),
      subtitle: s.subtitle?.slice(0, MAX_TITLE_LENGTH) ?? null,
      bullets: (s.bullets ?? []).slice(0, MAX_BULLETS),
      layout,
      theme: s.theme ?? "default",
      imagePrompt: s.imagePrompt,
      backgroundPrompt: s.backgroundPrompt,
    }
  })
  return { slides, warnings: spec.warnings }
}

export const slideSpecToEditableSlide = (
  spec: SlideSpec,
  layout: LayoutKey
): EditableSlide => ({
  title: (spec.title ?? "Slide").slice(0, MAX_TITLE_LENGTH),
  subtitle: spec.subtitle?.slice(0, MAX_TITLE_LENGTH) ?? null,
  bullets: (spec.bullets ?? []).slice(0, MAX_BULLETS),
  layout,
  theme: "default",
  imagePrompt: spec.imagePrompt,
  backgroundPrompt: spec.backgroundPrompt,
})

export const parseDeckSpec = (raw: string): DeckSpec => {
  let text = raw.trim()
  if (text.startsWith("```")) {
    const parts = text.split("```")
    text = parts[1] ?? text
    if (text.startsWith("json")) text = text.slice(4)
    text = text.trim()
  }
  const parsed = JSON.parse(text) as Record<string, unknown>
  const deckTitle = (parsed.deckTitle as string) ?? "Untitled Deck"
  const slidesRaw = (parsed.slides as Record<string, unknown>[]) ?? []
  const slides: SlideSpec[] = slidesRaw.map((s) => ({
    purpose: (s.purpose as string) ?? "generic",
    title: (s.title as string) ?? "Slide",
    subtitle: (s.subtitle as string) ?? null,
    bullets: (s.bullets as string[]) ?? [],
    visualIntent: s.visualIntent as string | undefined,
    imagePrompt: s.imagePrompt as string | undefined,
    backgroundPrompt: s.backgroundPrompt as string | undefined,
    theme: (s.theme as string) ?? undefined,
    accentColor: (s.accentColor as string) ?? undefined,
  }))
  return { deckTitle, slides }
}

export const parseRenderSpec = (raw: string): RenderSpec => {
  let text = raw.trim()
  if (text.startsWith("```")) {
    const parts = text.split("```")
    text = parts[1] ?? text
    if (text.startsWith("json")) text = text.slice(4)
    text = text.trim()
  }
  const parsed = JSON.parse(text) as Record<string, unknown>
  const slidesRaw = (parsed.slides as Record<string, unknown>[]) ?? []
  const warnings = parsed.warnings as string[] | undefined
  const slides: EditableSlide[] = slidesRaw.map((s) => ({
    title: (s.title as string) ?? "Slide",
    subtitle: (s.subtitle as string) ?? null,
    bullets: (s.bullets as string[]) ?? [],
    layout: (LAYOUT_KEYS.includes((s.layout as string) as LayoutKey)
      ? s.layout
      : "bullet-list") as LayoutKey,
    theme: (s.theme as string) ?? "default",
    imagePrompt: s.imagePrompt as string | undefined,
    backgroundPrompt: s.backgroundPrompt as string | undefined,
  }))
  return { slides, warnings }
}
