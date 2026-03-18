import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { buildLayoutDescriptions, LAYOUT_KEYS } from "@/lib/design-system"
import type { LayoutKey } from "@/lib/design-system"

const SYSTEM_PROMPT = `You are a professional presentation designer. Given a topic or prompt, generate a polished, concise slide deck.

Available layouts (choose the best one for each slide):
{layout_descriptions}

Rules:
1. The FIRST slide MUST use the "hero" layout (opening title slide).
2. The LAST slide MUST use "quote" or "title-only" (strong close or call-to-action).
3. Use "two-column" for comparisons, pros/cons, or before/after content.
4. Use "image-text" for slides with a strong visual concept, diagram, or product view.
5. Use "bullet-list" for key points, features, or step-by-step processes.
6. Use "title-only" as a section divider between major topics.
7. Use "stats" only when highlighting 2-4 key metrics or KPIs.
8. Keep bullet points concise: under 12 words each.
9. Generate between 4 and 8 slides depending on topic complexity.
10. For "hero", "title-only", and "quote" layouts, bullets MUST be an empty array [].
11. For "quote" layout: put the quote text in "title" (wrap it in quotes), attribution in "subtitle".
12. For "stats" layout: format each bullet as "VALUE | Label" e.g. "94% | Satisfaction".
13. subtitle is optional — only include it when it meaningfully adds context.

Return a JSON object with a single key "slides" whose value is an array. Each slide element must have exactly:
{
  "title": "string",
  "subtitle": "string or null",
  "bullets": ["string"],
  "layout": "one of the layout keys listed above",
  "theme": "default"
}`

type SlideRaw = {
  title?: string
  subtitle?: string | null
  bullets?: string[]
  layout?: string
  theme?: string
}

type Slide = {
  title: string
  subtitle: string | null
  bullets: string[]
  layout: LayoutKey
  theme: string
}

const parseSlides = (raw: string): Slide[] => {
  let text = raw.trim()
  // Strip markdown fences if present
  if (text.startsWith("```")) {
    const parts = text.split("```")
    text = parts[1] ?? text
    if (text.startsWith("json")) text = text.slice(4)
    text = text.trim()
  }

  const parsed = JSON.parse(text) as Record<string, unknown> | SlideRaw[]

  const arr: SlideRaw[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as Record<string, unknown>).slides)
    ? ((parsed as Record<string, unknown>).slides as SlideRaw[])
    : (Object.values(parsed)[0] as SlideRaw[])

  return arr.map((item) => {
    const layout = (item.layout ?? "bullet-list") as string
    return {
      title: item.title ?? "Slide",
      subtitle: item.subtitle ?? null,
      bullets: item.bullets ?? [],
      layout: (LAYOUT_KEYS.includes(layout as LayoutKey)
        ? layout
        : "bullet-list") as LayoutKey,
      theme: item.theme ?? "default",
    }
  })
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        detail:
          "GROQ_API_KEY is not configured. Add it in Vercel environment variables or .env.local.",
      },
      { status: 500 }
    )
  }

  let prompt: string
  try {
    const body = (await req.json()) as { prompt?: string }
    prompt = (body.prompt ?? "").trim()
    if (!prompt) throw new Error("empty prompt")
  } catch {
    return NextResponse.json({ detail: "prompt is required" }, { status: 400 })
  }

  const client = new Groq({ apiKey })
  const system = SYSTEM_PROMPT.replace(
    "{layout_descriptions}",
    buildLayoutDescriptions()
  )

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Topic: ${prompt}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const raw = completion.choices[0]?.message?.content ?? "{}"
    const slides = parseSlides(raw)
    return NextResponse.json({ slides })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes("429") || msg.toLowerCase().includes("rate_limit")) {
      return NextResponse.json(
        { detail: "Groq rate limit hit. Please wait a moment and try again." },
        { status: 429 }
      )
    }
    if (msg.includes("401") || msg.toLowerCase().includes("invalid_api_key")) {
      return NextResponse.json(
        { detail: "Groq API key is invalid. Check GROQ_API_KEY." },
        { status: 401 }
      )
    }
    return NextResponse.json({ detail: `Groq error: ${msg}` }, { status: 502 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" })
}
