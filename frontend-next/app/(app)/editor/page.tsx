"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { generateSlides, type SlideContent } from "@/lib/api"
import { LAYOUTS, LAYOUT_MAP, SLIDE_W, SLIDE_H, type LayoutKey } from "@/lib/design-system"
import { SlideRenderer } from "@/components/slides/SlideRenderer"
import { SlideThumbnail } from "@/components/slides/SlideThumbnail"
import type { EditableSlide } from "@/components/slides/types"

const toEditable = (s: SlideContent): EditableSlide => ({
  title: s.title,
  subtitle: s.subtitle ?? null,
  bullets: s.bullets ?? [],
  layout: (s.layout as LayoutKey) ?? "bullet-list",
  theme: s.theme ?? "default",
})

const BLANK_SLIDE: EditableSlide = {
  title: "New Slide",
  subtitle: null,
  bullets: [],
  layout: "hero",
  theme: "default",
}

export default function EditorPage() {
  const [deckTitle, setDeckTitle] = useState("Untitled Deck")
  const [slides, setSlides] = useState<EditableSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [promptOpen, setPromptOpen] = useState(true)
  const [rightTab, setRightTab] = useState<"layout" | "content">("layout")
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const current = slides[currentIndex] ?? null

  const updateSlide = (patch: Partial<EditableSlide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === currentIndex ? { ...s, ...patch } : s))
    )
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await generateSlides(prompt.trim())
      const editable = res.slides.map(toEditable)
      setSlides(editable)
      setCurrentIndex(0)
      setPromptOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate slides")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  const addSlide = () => {
    const newSlides = [...slides, { ...BLANK_SLIDE }]
    setSlides(newSlides)
    setCurrentIndex(newSlides.length - 1)
  }

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return
    const newSlides = slides.filter((_, i) => i !== idx)
    setSlides(newSlides)
    setCurrentIndex(Math.min(idx, newSlides.length - 1))
  }

  const updateBullet = (bulletIdx: number, value: string) => {
    const bullets = [...(current?.bullets ?? [])]
    bullets[bulletIdx] = value
    updateSlide({ bullets })
  }

  const addBullet = () => {
    updateSlide({ bullets: [...(current?.bullets ?? []), "New point"] })
  }

  const removeBullet = (bulletIdx: number) => {
    updateSlide({ bullets: (current?.bullets ?? []).filter((_, i) => i !== bulletIdx) })
  }

  // Auto-focus prompt on mount
  useEffect(() => {
    promptRef.current?.focus()
  }, [])

  const currentMeta = current ? LAYOUT_MAP[current.layout] : null

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background-dark font-display">
      {/* ── HEADER ── */}
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-primary/20 bg-background-dark px-4">
        {/* Left: logo + title */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
            title="Back to dashboard"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              arrow_back
            </span>
          </Link>
          <div className="h-5 w-px bg-primary/20" />
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>
            gallery_thumbnail
          </span>
          <input
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            className="min-w-0 max-w-[200px] bg-transparent text-sm font-semibold text-slate-100 focus:outline-none focus:ring-0"
            aria-label="Deck title"
          />
          <div className="h-5 w-px bg-primary/20" />
          {/* Undo/Redo */}
          <div className="flex gap-0.5">
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-primary/10 hover:text-slate-300"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>undo</span>
            </button>
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-primary/10 hover:text-slate-300"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>redo</span>
            </button>
          </div>
        </div>

        {/* Right: Share + Present */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPromptOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
            {promptOpen ? "Hide prompt" : "AI Generate"}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span>
            Share
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
            Present
          </button>
        </div>
      </header>

      {/* ── MAIN 3-PANEL ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Slide thumbnails ── */}
        <aside className="flex w-48 flex-shrink-0 flex-col border-r border-primary/15 bg-background-dark">
          {/* Thumbnails header */}
          <div className="flex items-center justify-between border-b border-primary/15 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Slides
            </span>
            <button
              type="button"
              onClick={addSlide}
              className="rounded-lg p-1 text-primary transition-colors hover:bg-primary/10"
              title="Add slide"
              aria-label="Add slide"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_box</span>
            </button>
          </div>

          {/* Thumbnails list */}
          <div className="editor-scroll flex-1 space-y-3 overflow-y-auto p-3">
            {slides.length === 0 && (
              <p className="py-4 text-center text-[10px] leading-relaxed text-slate-600">
                Generate slides from a prompt or add a blank slide.
              </p>
            )}
            {slides.map((slide, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCurrentIndex(n)}
                className="group w-full text-left"
                aria-label={`Slide ${n + 1}: ${slide.title}`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">{n + 1}</span>
                  <div className={`h-px flex-1 ${n === currentIndex ? "bg-primary/40" : "bg-slate-800"}`} />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteSlide(n) }}
                    className="hidden rounded p-0.5 text-slate-600 hover:text-red-400 group-hover:flex"
                    aria-label={`Delete slide ${n + 1}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                  </button>
                </div>
                <div
                  className={`overflow-hidden rounded-lg transition-all ${
                    n === currentIndex
                      ? "border-2 border-primary ring-2 ring-primary/20"
                      : "border border-primary/10 opacity-60 hover:border-primary/30 hover:opacity-80"
                  }`}
                >
                  <SlideThumbnail slide={slide} width={168} />
                </div>
                <p className="mt-1 truncate px-0.5 text-[10px] text-slate-500">
                  {slide.title}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* ── CENTER: Canvas ── */}
        <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-canvas">
          {/* Canvas stage */}
          <div
            className="relative overflow-hidden rounded-xl border border-primary/10 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
            style={{
              width: "min(calc(100% - 96px), 960px)",
              aspectRatio: `${SLIDE_W} / ${SLIDE_H}`,
            }}
          >
            {current ? (
              <SlideRenderer slide={current} />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background-dark">
                <span className="material-symbols-outlined text-primary/30" style={{ fontSize: 64 }}>
                  auto_awesome
                </span>
                <p className="text-sm text-slate-500">
                  Use the AI prompt below or add a blank slide
                </p>
              </div>
            )}
          </div>

          {/* Slide count badge */}
          {slides.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              {slides.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentIndex(n)}
                  className={`h-1.5 rounded-full transition-all ${
                    n === currentIndex ? "w-5 bg-primary" : "w-1.5 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${n + 1}`}
                />
              ))}
            </div>
          )}

          {/* ── Floating prompt toolbar ── */}
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 ${
              promptOpen ? "w-[560px]" : "w-auto"
            }`}
          >
            {promptOpen ? (
              <div className="flex flex-col gap-2 rounded-2xl border border-primary/25 bg-background-dark/95 p-3 shadow-xl shadow-black/50 backdrop-blur-md">
                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Describe your deck… e.g. "5 slides on AI in healthcare for investors"'
                  rows={2}
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-50"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-600">⌘ Enter to generate</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPromptOpen(false)}
                      className="rounded-xl px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-white/5 hover:text-slate-300"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-primary/30 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>
                            progress_activity
                          </span>
                          Generating…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="rounded-lg bg-red-900/20 px-3 py-2 text-xs text-red-400">{error}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPromptOpen(true)}
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-background-dark/90 px-4 py-2 text-xs font-semibold text-primary shadow-lg shadow-black/40 backdrop-blur-md transition-all hover:border-primary/40 hover:bg-primary/10"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                AI Generate
              </button>
            )}
          </div>
        </main>

        {/* ── RIGHT: Design panel ── */}
        <aside className="flex w-72 flex-shrink-0 flex-col border-l border-primary/15 bg-background-dark">
          {/* Tabs */}
          <div className="flex border-b border-primary/15">
            {(["layout", "content"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  rightTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="editor-scroll flex-1 overflow-y-auto">
            {!current ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="material-symbols-outlined text-slate-700" style={{ fontSize: 40 }}>
                  layers
                </span>
                <p className="text-xs text-slate-600">
                  Select or generate a slide to edit it here.
                </p>
              </div>
            ) : rightTab === "layout" ? (
              /* ── Layout picker ── */
              <div className="p-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Slide Layout
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout.key}
                      type="button"
                      onClick={() => updateSlide({ layout: layout.key })}
                      title={layout.description}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all ${
                        current.layout === layout.key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-primary/10 text-slate-400 hover:border-primary/30 hover:bg-primary/5 hover:text-slate-200"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 22 }}
                      >
                        {layout.icon}
                      </span>
                      <span className="text-[11px] font-semibold leading-tight">
                        {layout.label}
                      </span>
                    </button>
                  ))}
                </div>

                {currentMeta && (
                  <div className="mt-4 rounded-xl border border-primary/10 bg-primary/5 p-3">
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      {currentMeta.description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ── Content editor ── */
              <div className="flex flex-col gap-5 p-4">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Title
                  </label>
                  <textarea
                    value={current.title}
                    onChange={(e) => updateSlide({ title: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* Subtitle (shown when layout supports it) */}
                {(currentMeta?.hasSubtitle ?? true) && (
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Subtitle
                    </label>
                    <textarea
                      value={current.subtitle ?? ""}
                      onChange={(e) =>
                        updateSlide({ subtitle: e.target.value || null })
                      }
                      placeholder="Optional subtitle…"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                )}

                {/* Bullets */}
                {(currentMeta?.hasBullets ?? false) && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Bullets
                      </label>
                      <button
                        type="button"
                        onClick={addBullet}
                        className="flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/10"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>add</span>
                        Add
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {current.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <textarea
                            value={b}
                            onChange={(e) => updateBullet(i, e.target.value)}
                            rows={1}
                            className="flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-slate-200 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet(i)}
                            className="mt-1.5 rounded p-0.5 text-slate-600 transition-colors hover:text-red-400"
                            aria-label="Remove bullet"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {current.layout === "stats" && (
                      <p className="mt-2 text-[10px] text-slate-600">
                        Format: <code className="text-primary/80">VALUE | Label</code> e.g. <code className="text-primary/80">94% | Satisfaction</code>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── FOOTER ── */}
      <footer className="flex h-7 flex-shrink-0 items-center justify-between border-t border-primary/15 bg-background-dark px-4 text-[10px] text-slate-600">
        <span>
          {slides.length > 0
            ? `Slide ${currentIndex + 1} of ${slides.length}`
            : "No slides"}
        </span>
        <span className="flex items-center gap-2">
          {current && (
            <span className="flex items-center gap-1 rounded-full border border-primary/15 px-2 py-0.5 text-[10px] text-primary/70">
              <span className="material-symbols-outlined" style={{ fontSize: 10 }}>
                {LAYOUT_MAP[current.layout]?.icon ?? "layers"}
              </span>
              {LAYOUT_MAP[current.layout]?.label ?? current.layout}
            </span>
          )}
          <span>DeckShare</span>
        </span>
      </footer>
    </div>
  )
}
