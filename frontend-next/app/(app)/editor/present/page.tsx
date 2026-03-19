"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { SlideRenderer } from "@/components/slides/SlideRenderer"
import { loadDeck } from "@/lib/deck-storage"
import type { EditableSlide } from "@/components/slides/types"

function PresentContent() {
  const searchParams = useSearchParams()
  const deckId = searchParams.get("deck")
  const [slides, setSlides] = useState<EditableSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [deckTitle, setDeckTitle] = useState("")

  useEffect(() => {
    if (deckId) {
      loadDeck(deckId).then((stored) => {
        if (stored) {
          setSlides(stored.slides)
          setDeckTitle(stored.title)
        }
      })
    }
  }, [deckId])

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, slides.length - 1))
  }, [slides.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "Escape") {
        window.history.back()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goNext, goPrev])

  if (slides.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
        <p className="text-slate-400">No slides to present</p>
        <Link
          href="/editor"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110"
        >
          Back to Editor
        </Link>
      </div>
    )
  }

  const current = slides[currentIndex]

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-black"
      onClick={(e) => {
        const target = e.target as HTMLElement
        const rect = target.getBoundingClientRect()
        const x = e.clientX - rect.left
        if (x > rect.width / 2) goNext()
        else goPrev()
      }}
      role="button"
      tabIndex={0}
      aria-label="Click left for previous, right for next slide"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === " ") goNext()
        else if (e.key === "ArrowLeft") goPrev()
      }}
    >
      <div className="absolute left-4 top-4 z-10 flex items-center gap-4">
        <Link
          href={`/editor?deck=${deckId}`}
          className="flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/70"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            close
          </span>
          Exit
        </Link>
        <span className="text-xs text-slate-400">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div
          className="aspect-video w-full max-w-5xl overflow-hidden rounded-lg shadow-2xl"
          style={{ aspectRatio: "16/9" }}
        >
          {current && <SlideRenderer slide={current} />}
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-6">
        {slides.map((_, n) => (
          <button
            key={n}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(n)
            }}
            className={`h-1.5 rounded-full transition-all ${
              n === currentIndex ? "w-6 bg-white" : "w-1.5 bg-slate-600 hover:bg-slate-500"
            }`}
            aria-label={`Go to slide ${n + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function PresentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      }
    >
      <PresentContent />
    </Suspense>
  )
}
