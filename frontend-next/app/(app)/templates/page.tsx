"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { SlideThumbnail } from "@/components/slides/SlideThumbnail"
import { TEMPLATES, TEMPLATE_CATEGORIES, type DeckTemplate } from "@/lib/templates"
import { stitchToEditableSlide, getStitchTemplateById } from "@/lib/stitch-mapping"

type StitchTemplate = {
  id: string
  name: string
  path: string
  layout: string
}

export default function TemplatesPage() {
  const [category, setCategory] = useState<string | null>(null)
  const [htmlTemplates, setHtmlTemplates] = useState<StitchTemplate[]>([])

  useEffect(() => {
    fetch("/api/templates/html")
      .then((r) => r.json())
      .then((data) => setHtmlTemplates(data.templates ?? []))
      .catch(() => setHtmlTemplates([]))
  }, [])

  const filtered = useMemo(
    () =>
      category
        ? TEMPLATES.filter((t) => t.category === category)
        : TEMPLATES,
    [category]
  )

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="flex w-full flex-col gap-8 border-r border-slate-200 p-6 lg:w-64">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Workspace
          </h3>
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 font-semibold text-primary">
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm">Templates</p>
          </div>
          <Link
            href="/editor"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100"
          >
            <span className="material-symbols-outlined">folder_open</span>
            My Projects
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
            Categories
          </h3>
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              !category ? "bg-primary/10 font-semibold text-primary" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="material-symbols-outlined">apps</span>
            All
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                category === cat ? "bg-primary/10 font-semibold text-primary" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined">
                {cat === "Pitch" ? "rocket_launch" : cat === "Business" ? "business_center" : cat === "Product" ? "smartphone" : cat === "Strategy" ? "tactic" : cat === "Internal" ? "groups" : "campaign"}
              </span>
              {cat}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Templates Library
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Start from a template or create from scratch
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>

        {htmlTemplates.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Premade HTML Slides
            </h3>
            <p className="mb-6 text-sm text-slate-500">
              Single-slide layouts from our design system
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {htmlTemplates.map((t) => (
                <HtmlTemplateCard key={t.id} template={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HtmlTemplateCard({ template }: { template: StitchTemplate }) {
  const meta = getStitchTemplateById(template.id)
  const slide = meta ? stitchToEditableSlide(meta) : null
  if (!slide) return null

  return (
    <Link
      href={`/editor?htmlTemplate=${template.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl"
    >
      <div className="aspect-video overflow-hidden bg-slate-100">
        <SlideThumbnail slide={slide} width={300} />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-slate-900 group-hover:text-primary">
          {template.name}
        </h3>
        <p className="mt-1 text-xs text-primary">Use HTML Template →</p>
      </div>
    </Link>
  )
}

function TemplateCard({ template }: { template: DeckTemplate }) {
  const firstSlide = template.slides[0]

  return (
    <Link
      href={`/editor?template=${template.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl"
    >
      <div className="aspect-video overflow-hidden bg-slate-100">
        {firstSlide ? (
          <SlideThumbnail slide={firstSlide} width={400} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-slate-400">
              gallery_thumbnail
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 group-hover:text-primary">
          {template.name}
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">{template.category}</p>
        <p className="mt-2 max-w-full truncate text-xs text-slate-600">
          {template.description}
        </p>
        <p className="mt-2 text-xs font-medium text-primary">
          Use Template →
        </p>
      </div>
    </Link>
  )
}
