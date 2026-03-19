/**
 * API client — uses relative /api/* routes (Next.js API routes).
 * Works identically on localhost and Vercel with no extra config.
 *
 * To point at the standalone Python backend instead, set:
 *   NEXT_PUBLIC_API_URL=http://localhost:8001
 * in .env.local (leave it unset to use the built-in Next.js API routes).
 */

const externalBase =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined

/** Base URL for generate/health calls. Empty string = same-origin (Vercel / Next.js dev). */
const API_BASE = externalBase ?? ""

export type SlideContent = {
  title: string
  subtitle?: string | null
  bullets: string[]
  layout?: string | null
  theme?: string | null
}

export type GenerateResponse = {
  slides: SlideContent[]
}

export type UsageResponse = {
  remaining: number
  limit: number
  used: number
  authenticated?: boolean
}

export async function getUsage(): Promise<UsageResponse> {
  const res = await fetch("/api/usage", { cache: "no-store", credentials: "include" })
  if (!res.ok) return { remaining: 5, limit: 5, used: 0 }
  return res.json() as Promise<UsageResponse>
}

export async function generateSlides(
  prompt: string
): Promise<GenerateResponse> {
  const url = API_BASE ? `${API_BASE}/api/generate` : "/api/generate"
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })
  if (!res.ok) {
    let detail = "Failed to generate slides"
    try {
      const body = (await res.json()) as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      detail = (await res.text()) || detail
    }
    throw new Error(detail)
  }
  return res.json() as Promise<GenerateResponse>
}

export type ImportResponse = {
  text: string
  source: "pdf" | "txt" | "docx" | "pptx"
}

export async function importFile(file: File): Promise<ImportResponse> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/import", {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    let detail = "Failed to import file"
    try {
      const body = (await res.json()) as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      detail = (await res.text()) || detail
    }
    throw new Error(detail)
  }
  return res.json() as Promise<ImportResponse>
}

export async function healthCheck(): Promise<{ status: string }> {
  const url = API_BASE ? `${API_BASE}/health` : "/api/health"
  const res = await fetch(url)
  if (!res.ok) throw new Error("Health check failed")
  return res.json() as Promise<{ status: string }>
}

export type ExportSlideInput = {
  title: string
  subtitle?: string | null
  bullets: string[]
}

export async function exportPPTX(
  deckTitle: string,
  slides: ExportSlideInput[]
): Promise<Blob> {
  const url = API_BASE ? `${API_BASE}/api/export/pptx` : "/api/export/pptx"
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deckTitle,
      slides: slides.map((s) => ({
        title: s.title,
        subtitle: s.subtitle ?? null,
        bullets: s.bullets ?? [],
      })),
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Export failed")
  }
  return res.blob()
}

export { exportPDF } from "@/lib/export-pdf"
