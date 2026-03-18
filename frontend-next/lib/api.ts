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

export async function healthCheck(): Promise<{ status: string }> {
  const url = API_BASE ? `${API_BASE}/health` : "/api/health"
  const res = await fetch(url)
  if (!res.ok) throw new Error("Health check failed")
  return res.json() as Promise<{ status: string }>
}
