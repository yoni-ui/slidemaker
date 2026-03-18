"use client";

import { useState } from "react";
import { generateSlides, type SlideContent } from "@/lib/api";

export default function EditorPage() {
  const [prompt, setPrompt] = useState("");
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(true);

  const currentSlide = slides[currentIndex];

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateSlides(prompt.trim());
      setSlides(res.slides);
      setCurrentIndex(0);
      setShowPrompt(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate slides");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-1 flex-col overflow-hidden rounded-xl border border-primary/10 bg-background-dark">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-primary/20 bg-background-dark px-4 py-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">
              gallery_thumbnail
            </span>
            <h2 className="text-lg font-bold tracking-tight text-slate-100">
              {slides.length ? "Generated deck" : "Untitled deck"}
            </h2>
          </div>
          <div className="h-6 w-px bg-primary/20" />
          <button
            type="button"
            onClick={() => setShowPrompt((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">
              auto_awesome
            </span>
            {showPrompt ? "Hide prompt" : "Generate from prompt"}
          </button>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10"
              title="Undo"
            >
              <span className="material-symbols-outlined">undo</span>
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10"
              title="Redo"
            >
              <span className="material-symbols-outlined">redo</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 font-semibold text-primary transition-all hover:bg-primary/20"
          >
            <span className="material-symbols-outlined">share</span>
            <span className="text-sm">Share</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110"
          >
            <span className="material-symbols-outlined">play_arrow</span>
            <span className="text-sm">Present</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Prompt panel (collapsible) */}
        {showPrompt && (
          <aside className="w-80 flex-shrink-0 border-r border-primary/10 bg-background-dark/80 p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Describe your presentation
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 5 slides about AI in education for executives"
              className="mb-3 min-h-[100px] w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Generating…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    auto_awesome
                  </span>
                  Generate slides
                </>
              )}
            </button>
            {error && (
              <p className="mt-3 text-xs text-red-400">{error}</p>
            )}
          </aside>
        )}

        {/* Slide thumbnails */}
        <aside className="flex w-48 flex-col border-r border-primary/10 bg-background-dark/50">
          <div className="flex items-center justify-between border-b border-primary/10 p-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Slides
            </span>
            <button
              type="button"
              className="rounded-lg p-1 text-primary hover:bg-primary/10"
              title="Add slide"
            >
              <span className="material-symbols-outlined">add_box</span>
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-3">
            {slides.length === 0 ? (
              <p className="text-[10px] text-slate-500">
                Enter a prompt and generate to add slides.
              </p>
            ) : (
              slides.map((slide, n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentIndex(n)}
                  className={`w-full space-y-1 text-left transition-opacity hover:opacity-100 ${
                    n === currentIndex ? "" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span>{n + 1}</span>
                    <div
                      className={`h-px flex-1 ${n === currentIndex ? "bg-primary/50" : "bg-slate-700"}`}
                    />
                  </div>
                  <div
                    className={`aspect-video w-full overflow-hidden rounded-lg bg-background-dark ${
                      n === currentIndex
                        ? "border-2 border-primary ring-2 ring-primary/20"
                        : "border border-primary/10"
                    }`}
                  >
                    <div className="flex h-full w-full flex-col justify-end p-2">
                      <p className="truncate text-[10px] font-semibold text-slate-200">
                        {slide.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex flex-1 items-center justify-center overflow-auto bg-[#1a110c] p-12">
          <div className="aspect-video w-full max-w-[960px] overflow-hidden rounded-xl border border-primary/10 bg-background-dark shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {currentSlide ? (
              <div className="flex h-full flex-col p-12">
                <div className="mb-8 flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-100">
                      {currentSlide.title}
                    </h1>
                    {currentSlide.subtitle && (
                      <p className="text-lg text-slate-400">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-4xl">
                      trending_up
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border border-white/5 bg-background-light/5 p-6">
                  {currentSlide.bullets.length > 0 ? (
                    <ul className="space-y-2">
                      {currentSlide.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-slate-200"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500">No bullets</p>
                  )}
                  {currentSlide.layout && (
                    <p className="mt-2 text-xs text-slate-500">
                      Layout: {currentSlide.layout}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-12">
                <p className="text-slate-500">
                  {showPrompt
                    ? "Enter a prompt and click Generate slides"
                    : "No slides yet. Use “Generate from prompt” to create slides."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
