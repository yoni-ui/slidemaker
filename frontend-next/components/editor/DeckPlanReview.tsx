"use client"

import type { DeckSpec, SlideSpec } from "@/lib/generate-validation"

const emptySlide = (): SlideSpec => ({
  purpose: "content",
  title: "New slide",
  subtitle: null,
  bullets: [],
  visualIntent: "text",
  imagePrompt: undefined,
  backgroundPrompt: undefined,
  theme: undefined,
  accentColor: undefined,
})

export function DeckPlanReview({
  deckSpec,
  onChange,
}: {
  deckSpec: DeckSpec
  onChange: (next: DeckSpec) => void
}) {
  const updateSlide = (i: number, patch: Partial<SlideSpec>) => {
    const slides = deckSpec.slides.map((s, j) =>
      j === i ? { ...s, ...patch } : s
    )
    onChange({ ...deckSpec, slides })
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= deckSpec.slides.length) return
    const slides = [...deckSpec.slides]
    ;[slides[i], slides[j]] = [slides[j], slides[i]]
    onChange({ ...deckSpec, slides })
  }

  const remove = (i: number) => {
    if (deckSpec.slides.length <= 1) return
    onChange({
      ...deckSpec,
      slides: deckSpec.slides.filter((_, j) => j !== i),
    })
  }

  const addSlide = () => {
    onChange({
      ...deckSpec,
      slides: [...deckSpec.slides, emptySlide()],
    })
  }

  const bulletsText = (s: SlideSpec) => (s.bullets ?? []).join("\n")
  const setBulletsFromText = (i: number, text: string) => {
    const bullets = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 6)
    updateSlide(i, { bullets })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Deck title
          </span>
          <input
            value={deckSpec.deckTitle}
            onChange={(e) =>
              onChange({ ...deckSpec, deckTitle: e.target.value })
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="max-h-[min(52vh,520px)] space-y-3 overflow-y-auto pr-1">
        {deckSpec.slides.map((slide, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600">
                Slide {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-slate-500 hover:bg-white disabled:opacity-30"
                  aria-label="Move up"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_upward
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === deckSpec.slides.length - 1}
                  className="rounded p-1 text-slate-500 hover:bg-white disabled:opacity-30"
                  aria-label="Move down"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_downward
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={deckSpec.slides.length <= 1}
                  className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"
                  aria-label="Remove slide"
                >
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Purpose
                </span>
                <input
                  value={slide.purpose}
                  onChange={(e) => updateSlide(i, { purpose: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Visual intent
                </span>
                <input
                  value={slide.visualIntent ?? ""}
                  onChange={(e) =>
                    updateSlide(i, { visualIntent: e.target.value || undefined })
                  }
                  placeholder="text, image, stats…"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1 sm:col-span-2">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Title
                </span>
                <input
                  value={slide.title}
                  onChange={(e) => updateSlide(i, { title: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-900"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1 sm:col-span-2">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Subtitle
                </span>
                <input
                  value={slide.subtitle ?? ""}
                  onChange={(e) =>
                    updateSlide(i, {
                      subtitle: e.target.value.trim() ? e.target.value : null,
                    })
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800"
                />
              </label>
              <label className="col-span-full flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Bullets (one per line)
                </span>
                <textarea
                  value={bulletsText(slide)}
                  onChange={(e) => setBulletsFromText(i, e.target.value)}
                  rows={3}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Image prompt
                </span>
                <input
                  value={slide.imagePrompt ?? ""}
                  onChange={(e) =>
                    updateSlide(i, {
                      imagePrompt: e.target.value.trim() || undefined,
                    })
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Background prompt
                </span>
                <input
                  value={slide.backgroundPrompt ?? ""}
                  onChange={(e) =>
                    updateSlide(i, {
                      backgroundPrompt: e.target.value.trim() || undefined,
                    })
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Theme hint
                </span>
                <input
                  value={slide.theme ?? ""}
                  onChange={(e) =>
                    updateSlide(i, {
                      theme: e.target.value.trim() || undefined,
                    })
                  }
                  placeholder="default, dark…"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Accent color
                </span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={
                      slide.accentColor?.startsWith("#")
                        ? slide.accentColor
                        : "#0d9488"
                    }
                    onChange={(e) =>
                      updateSlide(i, { accentColor: e.target.value })
                    }
                    className="h-9 w-14 cursor-pointer rounded border border-slate-200 bg-white"
                  />
                  <input
                    value={slide.accentColor ?? ""}
                    onChange={(e) =>
                      updateSlide(i, {
                        accentColor: e.target.value.trim() || undefined,
                      })
                    }
                    placeholder="#0d9488"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSlide}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <span className="material-symbols-outlined text-lg">add</span>
        Add slide to plan
      </button>
    </div>
  )
}
