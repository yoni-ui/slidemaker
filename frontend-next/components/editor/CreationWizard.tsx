"use client"

import { useRef, useState } from "react"
import {
  planSlides,
  importFile,
  generateSlidesFromDeckSpec,
  type GenerateResponse,
} from "@/lib/api"
import type { DeckSpec } from "@/lib/generate-validation"
import { TEMPLATES } from "@/lib/templates"
import { DeckPlanReview } from "./DeckPlanReview"

type Step = "source" | "text" | "plan" | "generating"

export type CreationWizardProps = {
  open: boolean
  onClose: () => void
  /** Preset deck — no AI */
  onChooseTemplate: (templateId: string) => void
  onDeckGenerated: (res: GenerateResponse) => void
  /** null = unknown / anonymous */
  usageRemaining: number | null
  usageLimit: number | null
}

export function CreationWizard({
  open,
  onClose,
  onChooseTemplate,
  onDeckGenerated,
  usageRemaining,
  usageLimit,
}: CreationWizardProps) {
  const [step, setStep] = useState<Step>("source")
  const [textPrompt, setTextPrompt] = useState("")
  const [deckSpec, setDeckSpec] = useState<DeckSpec | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const resetAndClose = () => {
    setStep("source")
    setTextPrompt("")
    setDeckSpec(null)
    setError(null)
    setLoading(false)
    onClose()
  }

  const atLimit =
    usageRemaining !== null && usageLimit !== null && usageRemaining <= 0

  const handleBuildOutline = async () => {
    const p = textPrompt.trim()
    if (!p || loading) return
    setError(null)
    setLoading(true)
    try {
      const plan = await planSlides(p)
      setDeckSpec({
        deckTitle: plan.deckTitle,
        slides: plan.slides,
      })
      setStep("plan")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build outline")
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || loading) return
    const ext = file.name.toLowerCase().split(".").pop()
    if (!["pdf", "txt", "docx", "pptx"].includes(ext ?? "")) {
      setError("Use PDF, TXT, DOCX, or PPTX.")
      e.target.value = ""
      return
    }
    setError(null)
    setLoading(true)
    try {
      const { text } = await importFile(file)
      const prompt = `Create a slide deck from this content. Preserve structure and key points:\n\n${text}`
      const plan = await planSlides(prompt)
      setDeckSpec({
        deckTitle: plan.deckTitle,
        slides: plan.slides,
      })
      setStep("plan")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed")
    } finally {
      setLoading(false)
      e.target.value = ""
    }
  }

  const handleGenerateFromPlan = async () => {
    if (!deckSpec || loading) return
    if (atLimit) {
      setError(
        `Daily AI limit reached (${usageLimit ?? 5} generations). Try again tomorrow.`
      )
      return
    }
    setError(null)
    setLoading(true)
    setStep("generating")
    try {
      const res = await generateSlidesFromDeckSpec(deckSpec)
      onDeckGenerated(res)
      resetAndClose()
    } catch (e) {
      setStep("plan")
      setError(e instanceof Error ? e.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creation-wizard-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="creation-wizard-title"
              className="text-lg font-semibold text-slate-900"
            >
              {step === "source" && "Create deck"}
              {step === "text" && "Describe your deck"}
              {step === "plan" && "Review outline"}
              {step === "generating" && "Generating slides…"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {step === "source" && "Choose how to start"}
              {step === "text" && "We’ll draft an outline you can edit"}
              {step === "plan" && "Adjust titles, visuals, and colors — then generate"}
              {step === "generating" && "Applying layouts and themes"}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={loading && step === "generating"}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {atLimit && step !== "source" && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              You’ve used today’s AI generations. You can still pick a template
              or edit decks; generating from an outline requires quota.
            </p>
          )}

          {step === "source" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setStep("text")}
                className="flex flex-col items-start gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-5 text-left transition-all hover:border-primary hover:bg-primary/5"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  text_fields
                </span>
                <span className="font-semibold text-slate-900">Text prompt</span>
                <span className="text-xs text-slate-600">
                  Describe a topic — we’ll propose slide titles and content
                </span>
              </button>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                className="flex flex-col items-start gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-5 text-left transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-3xl text-primary">
                  upload_file
                </span>
                <span className="font-semibold text-slate-900">PDF / PPT / Word</span>
                <span className="text-xs text-slate-600">
                  Import a file — we’ll outline slides from the text
                </span>
              </button>

              <div className="flex flex-col gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-5">
                <span className="material-symbols-outlined text-3xl text-primary">
                  dashboard
                </span>
                <span className="font-semibold text-slate-900">Template</span>
                <span className="text-xs text-slate-600">
                  Start from a ready-made structure (no AI outline step)
                </span>
                <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1">
                  {TEMPLATES.slice(0, 12).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onChooseTemplate(t.id)
                        resetAndClose()
                      }}
                      className="w-full rounded-md px-2 py-2 text-left text-xs text-slate-800 hover:bg-slate-50"
                    >
                      <span className="font-medium">{t.name}</span>
                      <span className="block text-[10px] text-slate-500">
                        {t.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "text" && (
            <div className="flex flex-col gap-4">
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                placeholder='e.g. "7 slides on renewable energy for high school students"'
                rows={5}
                disabled={loading}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("source")
                    setError(null)
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleBuildOutline}
                  disabled={loading || !textPrompt.trim()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        progress_activity
                      </span>
                      Building outline…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        account_tree
                      </span>
                      Build outline
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "plan" && deckSpec && (
            <div className="flex flex-col gap-4">
              <DeckPlanReview deckSpec={deckSpec} onChange={setDeckSpec} />
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep("text")
                    setError(null)
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerateFromPlan}
                  disabled={loading || atLimit}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-md hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
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
              </div>
            </div>
          )}

          {step === "generating" && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <span className="material-symbols-outlined animate-spin text-5xl text-primary">
                progress_activity
              </span>
              <p className="text-sm text-slate-600">
                Mapping layouts and themes…
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt,.docx,.pptx,application/pdf"
          className="hidden"
          onChange={handleImport}
        />
      </div>
    </div>
  )
}
