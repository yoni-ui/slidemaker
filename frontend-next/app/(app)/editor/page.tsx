"use client"

import { Suspense, useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { generateSlides, exportPPTX, exportPDF, getUsage, importFile, type SlideContent } from "@/lib/api"
import { LAYOUTS, LAYOUT_MAP, SLIDE_W, SLIDE_H, type LayoutKey } from "@/lib/design-system"
import { SlideRenderer } from "@/components/slides/SlideRenderer"
import { SlideThumbnail } from "@/components/slides/SlideThumbnail"
import type { EditableSlide } from "@/components/slides/types"
import { getTemplateById } from "@/lib/templates"
import { useDeckStorage } from "@/lib/use-deck-storage"

const toEditable = (s: SlideContent): EditableSlide => ({
  title: s.title,
  subtitle: s.subtitle ?? null,
  bullets: s.bullets ?? [],
  layout: (s.layout as LayoutKey) ?? "bullet-list",
  theme: s.theme ?? "default",
  imagePrompt: (s as EditableSlide).imagePrompt,
  backgroundPrompt: (s as EditableSlide).backgroundPrompt,
})

const BLANK_SLIDE: EditableSlide = {
  title: "New Slide",
  subtitle: null,
  bullets: [],
  layout: "hero",
  theme: "default",
}

const MAX_HISTORY = 50

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { saveDeck, loadDeck, generateDeckId } = useDeckStorage()
  const [deckId, setDeckId] = useState<string | null>(null)
  const [deckTitle, setDeckTitle] = useState("Untitled Deck")
  const [slides, setSlides] = useState<EditableSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [past, setPast] = useState<EditableSlide[][]>([])
  const [future, setFuture] = useState<EditableSlide[][]>([])
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [isDraft, setIsDraft] = useState(true)
  const [usage, setUsage] = useState<{ remaining: number; limit: number } | null>(null)
  const [addSlideOpen, setAddSlideOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(true)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rightTab, setRightTab] = useState<"layout" | "content">("layout")
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const isUndoRedoRef = useRef(false)

  const current = slides[currentIndex] ?? null
  const canUndo = past.length > 0
  const canRedo = future.length > 0

  const pushToPast = useCallback((state: EditableSlide[]) => {
    setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), JSON.parse(JSON.stringify(state))])
  }, [])

  const updateSlide = useCallback(
    (patch: Partial<EditableSlide>) => {
      setSlides((prev) => {
        const next = prev.map((s, i) =>
          i === currentIndex ? { ...s, ...patch } : s
        )
        if (!isUndoRedoRef.current) {
          pushToPast(prev)
          setFuture([])
        }
        return next
      })
    },
    [currentIndex, pushToPast]
  )

  const handleUndo = () => {
    if (!canUndo) return
    isUndoRedoRef.current = true
    const prevState = past[past.length - 1]
    setPast((p) => p.slice(0, -1))
    setFuture((f) => [JSON.parse(JSON.stringify(slides)), ...f])
    setSlides(JSON.parse(JSON.stringify(prevState)))
    setTimeout(() => { isUndoRedoRef.current = false }, 0)
  }

  const handleRedo = () => {
    if (!canRedo) return
    isUndoRedoRef.current = true
    const nextState = future[0]
    setPast((p) => [...p, JSON.parse(JSON.stringify(slides))])
    setFuture((f) => f.slice(1))
    setSlides(JSON.parse(JSON.stringify(nextState)))
    setTimeout(() => { isUndoRedoRef.current = false }, 0)
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return
    if (usage && usage.remaining <= 0) {
      setError(`Daily limit reached (${usage.limit} AI generations). Resets at midnight.`)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await generateSlides(prompt.trim())
      const editable = res.slides.map(toEditable)
      if (!deckId) setDeckId(generateDeckId())
      if (slides.length > 0) pushToPast(slides)
      setFuture([])
      setSlides(editable)
      setCurrentIndex(0)
      setPromptOpen(false)
      if (res.deckTitle) setDeckTitle(res.deckTitle)
      if (usage) setUsage({ ...usage, remaining: usage.remaining - 1 })
      getUsage().then((u) => setUsage({ remaining: u.remaining, limit: u.limit }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate slides")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || importing) return
    const ext = file.name.toLowerCase().split(".").pop()
    if (!["pdf", "txt", "docx", "pptx"].includes(ext ?? "")) {
      setError("Unsupported file. Use PDF, TXT, DOCX, or PPTX.")
      setTimeout(() => setError(null), 4000)
      e.target.value = ""
      return
    }
    if (usage && usage.remaining <= 0) {
      setError(`Daily limit reached (${usage.limit} AI generations). Resets at midnight.`)
      return
    }
    setImporting(true)
    setError(null)
    try {
      const { text } = await importFile(file)
      const prompt = `Create a slide deck from this content. Preserve the structure and key points:\n\n${text}`
      const res = await generateSlides(prompt)
      const editable = res.slides.map(toEditable)
      if (!deckId) setDeckId(generateDeckId())
      if (slides.length > 0) pushToPast(slides)
      setFuture([])
      setSlides(editable)
      setCurrentIndex(0)
      setPromptOpen(false)
      setDeckTitle(res.deckTitle ?? file.name.replace(/\.[^.]+$/, ""))
      if (usage) setUsage({ ...usage, remaining: usage.remaining - 1 })
      getUsage().then((u) => setUsage({ remaining: u.remaining, limit: u.limit }))
      setToast(`Imported from ${file.name}`)
      setTimeout(() => setToast(null), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed")
    } finally {
      setImporting(false)
      e.target.value = ""
    }
  }

  const addSlide = (layout: "hero" | "freeform" = "hero") => {
    if (!deckId) setDeckId(generateDeckId())
    pushToPast(slides)
    setFuture([])
    const newSlide =
      layout === "freeform"
        ? {
            ...BLANK_SLIDE,
            layout: "freeform" as const,
            title: "",
            elements: [],
          }
        : { ...BLANK_SLIDE }
    const newSlides = [...slides, newSlide]
    setSlides(newSlides)
    setCurrentIndex(newSlides.length - 1)
  }

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return
    pushToPast(slides)
    setFuture([])
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

  const IMAGE_LAYOUTS = ["image-text", "case-study"]
  const showImagePrompt = current && IMAGE_LAYOUTS.includes(current.layout)

  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const updateSlideRef = useRef(updateSlide)
  updateSlideRef.current = updateSlide
  const handleDebouncedPrompt = useCallback(
    (key: "imagePrompt" | "backgroundPrompt", value: string) => {
      if (debounceRef.current[key]) clearTimeout(debounceRef.current[key])
      debounceRef.current[key] = setTimeout(() => {
        updateSlideRef.current({ [key]: value.trim() || undefined })
      }, 800)
    },
    []
  )

  const handleShare = async () => {
    const id = deckId ?? (slides.length > 0 ? generateDeckId() : null)
    if (!id) {
      setToast("Save your deck first to share")
      setTimeout(() => setToast(null), 2000)
      return
    }
    if (!deckId) setDeckId(id)
    await saveDeck(id, deckTitle, slides, isDraft)
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/editor?deck=${id}`
    try {
      await navigator.clipboard.writeText(url)
      setToast("Link copied to clipboard")
      setTimeout(() => setToast(null), 2000)
    } catch {
      setToast("Could not copy link")
      setTimeout(() => setToast(null), 2000)
    }
  }

  const handleSaveDraft = async () => {
    const id = deckId ?? (slides.length > 0 ? generateDeckId() : null)
    if (!id) {
      setToast("Add slides first to save")
      setTimeout(() => setToast(null), 2000)
      return
    }
    if (!deckId) setDeckId(id)
    setSaveStatus("saving")
    try {
      await saveDeck(id, deckTitle, slides, true)
      setIsDraft(true)
      setSaveStatus("saved")
      setToast("Saved as draft")
      setTimeout(() => setToast(null), 2000)
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Save failed")
      setTimeout(() => setToast(null), 2000)
      setSaveStatus("idle")
    }
  }

  const handlePresent = async () => {
    const id = deckId ?? (slides.length > 0 ? generateDeckId() : null)
    if (!id && slides.length > 0) {
      const newId = generateDeckId()
      setDeckId(newId)
      await saveDeck(newId, deckTitle, slides, isDraft)
      router.push(`/editor/present?deck=${newId}`)
    } else if (id) {
      await saveDeck(id, deckTitle, slides, isDraft)
      router.push(`/editor/present?deck=${id}`)
    } else {
      setToast("Add slides first to present")
      setTimeout(() => setToast(null), 2000)
    }
  }

  const handleExportPPTX = async () => {
    if (slides.length === 0) {
      setToast("Add slides first to export")
      setTimeout(() => setToast(null), 2000)
      return
    }
    setExporting(true)
    try {
      const blob = await exportPPTX(deckTitle, slides)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${deckTitle.replace(/\s+/g, "_")}.pptx`
      a.click()
      URL.revokeObjectURL(url)
      setToast("Exported successfully")
      setTimeout(() => setToast(null), 2000)
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Export failed")
      setTimeout(() => setToast(null), 3000)
    } finally {
      setExporting(false)
    }
  }

  const handleExportPDF = async () => {
    if (slides.length === 0) {
      setToast("Add slides first to export")
      setTimeout(() => setToast(null), 2000)
      return
    }
    setExporting(true)
    try {
      const blob = await exportPDF(deckTitle, slides)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${deckTitle.replace(/\s+/g, "_")}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setToast("Exported successfully")
      setTimeout(() => setToast(null), 2000)
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Export failed")
      setTimeout(() => setToast(null), 3000)
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    getUsage().then((u) => setUsage({ remaining: u.remaining, limit: u.limit }))
  }, [])

  useEffect(() => {
    const deckParam = searchParams.get("deck")
    const templateId = searchParams.get("template")
    const htmlTemplateId = searchParams.get("htmlTemplate")
    if (deckParam) {
      loadDeck(deckParam).then((stored) => {
        if (stored) {
          setDeckId(stored.id)
          setDeckTitle(stored.title)
          setSlides(stored.slides)
          setIsDraft(stored.isDraft ?? true)
          setCurrentIndex(0)
          setPast([])
          setFuture([])
        }
      })
      return
    }
    if (htmlTemplateId) {
      fetch(`/api/templates/html/${htmlTemplateId}?format=slide`)
        .then((r) => r.json())
        .then((data) => {
          if (data.slide) {
            setSlides([data.slide])
            setDeckTitle(data.slide.title ?? "New Slide")
            setCurrentIndex(0)
            setDeckId(generateDeckId())
          }
        })
        .catch(() => {})
      return
    }
    if (templateId) {
      const t = getTemplateById(templateId)
      if (t) {
        setSlides(t.slides)
        setDeckTitle(t.name)
        setCurrentIndex(0)
        setDeckId(generateDeckId())
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (slides.length === 0 || !deckId) return
    setSaveStatus("saving")
    const saveTimer = setTimeout(() => {
      saveDeck(deckId, deckTitle, slides, isDraft).then(() => {
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      })
    }, 1200)
    return () => clearTimeout(saveTimer)
  }, [deckId, deckTitle, slides, isDraft])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault()
          if (e.shiftKey) handleRedo()
          else handleUndo()
        } else if (e.key === "y") {
          e.preventDefault()
          handleRedo()
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canUndo, canRedo])

  useEffect(() => {
    promptRef.current?.focus()
  }, [])

  const currentMeta = current ? LAYOUT_MAP[current.layout] : null

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#fafbfc] font-sans">
      {/* ── HEADER ── Figma-style toolbar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-5 shadow-sm">
        {/* Left: logo + title + save status */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg p-2 -ml-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            title="Back to dashboard"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
              arrow_back
            </span>
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>
              gallery_thumbnail
            </span>
            <input
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              className="min-w-0 max-w-[220px] bg-transparent text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              placeholder="Untitled deck"
              aria-label="Deck title"
            />
          </div>
          {saveStatus !== "idle" && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              {saveStatus === "saving" ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: 14 }}>progress_activity</span>
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-emerald-500" style={{ fontSize: 14 }}>check_circle</span>
                  {isDraft ? "Draft saved" : "Saved"}
                </>
              )}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saveStatus === "saving" || slides.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            title="Save as draft"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>save</span>
            Save as Draft
          </button>
          <div className="h-6 w-px bg-slate-200" />
          {/* Undo/Redo */}
          <div className="flex gap-0.5 rounded-lg bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>undo</span>
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>redo</span>
            </button>
          </div>
        </div>

        {/* Right: Share + Present */}
        <div className="flex items-center gap-2">
          {usage !== null && (
            <span className="text-xs text-slate-500" title="Free daily AI generations">
              {usage.remaining}/{usage.limit} left
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx,.pptx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleImport}
            className="hidden"
            aria-label="Import file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing || (usage !== null && usage.remaining <= 0)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            title="Import PDF, TXT, Word, or PowerPoint"
          >
            <span className={`material-symbols-outlined ${importing ? "animate-spin" : ""}`} style={{ fontSize: 18 }}>
              upload_file
            </span>
            {importing ? "Importing…" : "Import"}
          </button>
          <button
            type="button"
            onClick={() => setPromptOpen((v) => !v)}
            disabled={usage !== null && usage.remaining <= 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>
            {promptOpen ? "Hide prompt" : "AI Generate"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
            Share
          </button>
          <button
            type="button"
            onClick={handleExportPPTX}
            disabled={exporting || slides.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={`material-symbols-outlined ${exporting ? "animate-spin" : ""}`} style={{ fontSize: 18 }}>
              download
            </span>
            PPTX
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exporting || slides.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={`material-symbols-outlined ${exporting ? "animate-spin" : ""}`} style={{ fontSize: 18 }}>
              picture_as_pdf
            </span>
            PDF
          </button>
          <button
            type="button"
            onClick={handlePresent}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
            Present
          </button>
        </div>
      </header>

      {/* ── MAIN 3-PANEL ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Slide thumbnails ── Figma layers panel */}
        <aside className="flex w-52 flex-shrink-0 flex-col border-r border-[#e5e7eb] bg-white">
          <div className="flex flex-col gap-2 border-b border-[#e5e7eb] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Slides
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAddSlideOpen((v) => !v)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-primary"
                  title="Add slide"
                  aria-label="Add slide"
                  aria-expanded={addSlideOpen}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
                </button>
                {addSlideOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setAddSlideOpen(false)}
                      aria-hidden
                    />
                    <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          addSlide("hero")
                          setAddSlideOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>crop_landscape</span>
                        Blank (Title)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addSlide("freeform")
                          setAddSlideOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit_square</span>
                        Freeform (drag & edit)
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Add manually or generate with AI
            </p>
          </div>
          <div className="editor-scroll flex-1 space-y-4 overflow-y-auto p-4">
            {slides.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center">
                <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 32 }}>add_photo_alternate</span>
                <p className="text-xs text-slate-500">
                  Generate from AI, import PDF/Word/PPT, or add a blank slide
                </p>
              </div>
            )}
            {slides.map((slide, n) => (
              <div
                key={n}
                role="button"
                tabIndex={0}
                onClick={() => setCurrentIndex(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setCurrentIndex(n)
                  }
                }}
                className="group w-full cursor-pointer text-left"
                aria-label={`Slide ${n + 1}: ${slide.title}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500">{n + 1}</span>
                  <div className={`h-px flex-1 ${n === currentIndex ? "bg-primary" : "bg-slate-200"}`} />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteSlide(n) }}
                    className="hidden rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 group-hover:block"
                    aria-label={`Delete slide ${n + 1}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                  </button>
                </div>
                <div
                  className={`overflow-hidden rounded-lg border-2 shadow-sm transition-all ${
                    n === currentIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-slate-200 opacity-70 hover:border-slate-300 hover:opacity-100"
                  }`}
                >
                  <SlideThumbnail slide={slide} width={184} />
                </div>
                <p className="mt-2 truncate px-0.5 text-[11px] font-medium text-slate-600">
                  {slide.title}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* ── CENTER: Canvas ── Figma-style canvas with grid */}
        <main
          className="relative flex flex-1 flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: current?.layout === "freeform"
              ? `linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                 linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`
              : `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
            backgroundSize: current?.layout === "freeform" ? "24px 24px" : "24px 24px",
            backgroundColor: "#f1f5f9",
          }}
        >
          <div
            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_10px_20px_-2px_rgba(0,0,0,0.08)]"
            style={{
              width: "min(calc(100% - 96px), 960px)",
              aspectRatio: `${SLIDE_W} / ${SLIDE_H}`,
            }}
          >
            {current ? (
              <SlideRenderer
                slide={current}
                editMode
                onUpdate={updateSlide}
                onUpdateBullet={updateBullet}
                onAddBullet={addBullet}
                onRemoveBullet={removeBullet}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-white">
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12">
                  <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 56 }}>
                    auto_awesome
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Use the AI prompt below or add a blank slide
                </p>
                <p className="text-xs text-slate-400">
                  ⌘ Enter to generate
                </p>
              </div>
            )}
          </div>

          {/* Slide pagination dots */}
          {slides.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {slides.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentIndex(n)}
                  className={`rounded-full transition-all ${
                    n === currentIndex ? "h-2 w-6 bg-primary" : "h-2 w-2 bg-slate-300 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${n + 1}`}
                />
              ))}
            </div>
          )}

          {/* ── Floating prompt toolbar ── */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${
              promptOpen ? "w-[580px]" : "w-auto"
            }`}
          >
            {promptOpen ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Describe your deck… e.g. "5 slides on AI in healthcare for investors"'
                  rows={2}
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">⌘ Enter to generate</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPromptOpen(false)}
                      className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={loading || !prompt.trim()}
                      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>
                            progress_activity
                          </span>
                          Generating…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-600">{error}</p>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPromptOpen(true)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-primary shadow-lg transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_awesome</span>
                AI Generate
              </button>
            )}
          </div>
        </main>

        {/* ── RIGHT: Design panel ── Figma properties panel */}
        <aside className="flex w-80 flex-shrink-0 flex-col border-l border-[#e5e7eb] bg-white">
          <div className="flex border-b border-[#e5e7eb]">
            {(["layout", "content"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  rightTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="editor-scroll flex-1 overflow-y-auto">
            {!current ? (
              <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8">
                  <span className="material-symbols-outlined text-slate-300" style={{ fontSize: 40 }}>
                    layers
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Select or generate a slide to edit
                </p>
              </div>
            ) : rightTab === "layout" ? (
              /* ── Layout picker ── */
              <div className="p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Slide Layout
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout.key}
                      type="button"
                      onClick={() => updateSlide({ layout: layout.key })}
                      title={layout.description}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3.5 text-center transition-all ${
                        current.layout === layout.key
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 24 }}
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
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                    <p className="text-[11px] leading-relaxed text-slate-600">
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
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Title
                  </label>
                  <textarea
                    value={current.title}
                    onChange={(e) => updateSlide({ title: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Subtitle */}
                {(currentMeta?.hasSubtitle ?? true) && (
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Subtitle
                    </label>
                    <textarea
                      value={current.subtitle ?? ""}
                      onChange={(e) =>
                        updateSlide({ subtitle: e.target.value || null })
                      }
                      placeholder="Optional subtitle…"
                      rows={2}
                      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                {/* Bullets */}
                {(currentMeta?.hasBullets ?? false) && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Bullets
                      </label>
                      <button
                        type="button"
                        onClick={addBullet}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                        Add
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {current.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <textarea
                            value={b}
                            onChange={(e) => updateBullet(i, e.target.value)}
                            rows={1}
                            className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet(i)}
                            className="mt-2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove bullet"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    {current.layout === "stats" && (
                      <p className="mt-2 text-[11px] text-slate-600">
                        Format: <code className="rounded bg-slate-100 px-1 py-0.5 text-primary">VALUE | Label</code>
                      </p>
                    )}
                  </div>
                )}

                {/* Image prompt */}
                {showImagePrompt && (
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Image prompt
                    </label>
                    <input
                      key={`${currentIndex}-img`}
                      type="text"
                      defaultValue={current.imagePrompt ?? ""}
                      onChange={(e) => handleDebouncedPrompt("imagePrompt", e.target.value)}
                      placeholder="e.g. modern office team collaborating"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      AI-generated via Pollinations
                    </p>
                  </div>
                )}

                {/* Background prompt */}
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Background image
                  </label>
                  <input
                    key={`${currentIndex}-bg`}
                    type="text"
                    defaultValue={current.backgroundPrompt ?? ""}
                    onChange={(e) => handleDebouncedPrompt("backgroundPrompt", e.target.value)}
                    placeholder="e.g. abstract blue gradient"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-20 left-1/2 z-[100] -translate-x-1/2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-xl"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="flex h-9 flex-shrink-0 items-center justify-between border-t border-[#e5e7eb] bg-white px-5 text-xs text-slate-500">
        <span className="font-medium">
          {slides.length > 0
            ? `Slide ${currentIndex + 1} of ${slides.length}`
            : "No slides"}
        </span>
        <span className="flex items-center gap-3">
          {current && (
            <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                {LAYOUT_MAP[current.layout]?.icon ?? "layers"}
              </span>
              {LAYOUT_MAP[current.layout]?.label ?? current.layout}
            </span>
          )}
          <span className="text-slate-400">DeckShare</span>
        </span>
      </footer>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background-dark">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
