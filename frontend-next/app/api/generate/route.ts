import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { createClient } from "@/lib/supabase/server"
import { buildLayoutDescriptions, LAYOUT_KEYS } from "@/lib/design-system"
import type { LayoutKey } from "@/lib/design-system"

const FREE_DAILY_LIMIT = 5

const SYSTEM_PROMPT = `You are a professional presentation designer. Given a topic or prompt, generate a polished, concise slide deck.

Available layouts (choose the best one for each slide):
{layout_descriptions}

Rules:
1. The FIRST slide MUST use "hero" or "title-card" (opening title slide).
2. The LAST slide MUST use "quote", "thank-you", or "title-only" (strong close or call-to-action).
3. Choose the layout that BEST matches the content: e.g. "agenda" for table of contents, "pricing" for plan comparison, "swot" for strategy analysis, "timeline" for roadmaps, "testimonials" for customer quotes, "team-overview" for team intro, "case-study" for success stories, "next-steps" for action checklists.
4. Use "two-column" for comparisons, pros/cons, or before/after content.
5. Use "image-text" for slides with a strong visual, diagram, or product view.
6. Use "bullet-list" for generic key points when no specialized layout fits.
7. Use "stats" or "data-chart" when highlighting metrics or KPIs.
8. Keep bullet points concise: under 12 words each.
9. Generate between 4 and 8 slides depending on topic complexity.
10. For "hero", "title-only", "quote", "partner-logos": bullets MUST be [] (unless layout spec says otherwise).
11. For "quote": put the quote in "title" (wrap in quotes), attribution in "subtitle".
12. For "stats", "pricing", "data-chart": format bullets per layout spec (e.g. "VALUE | Label").
13. subtitle is optional — include when it adds context.

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

  let userId: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userId = user.id
      const today = new Date().toISOString().slice(0, 10)
      const { data: row } = await supabase
        .from("user_usage")
        .select("generations_count")
        .eq("user_id", user.id)
        .eq("usage_date", today)
        .single()

      const used = row?.generations_count ?? 0
      if (used >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            detail: `Daily limit reached (${FREE_DAILY_LIMIT} AI generations). Resets at midnight.`,
          },
          { status: 429 }
        )
      }
    }
  } catch {
    // Supabase not configured or table missing — allow generation
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

    if (userId) {
      try {
        const supabase = await createClient()
        const today = new Date().toISOString().slice(0, 10)
        const { data: row } = await supabase
          .from("user_usage")
          .select("generations_count")
          .eq("user_id", userId)
          .eq("usage_date", today)
          .single()

        if (row) {
          await supabase
            .from("user_usage")
            .update({ generations_count: row.generations_count + 1 })
            .eq("user_id", userId)
            .eq("usage_date", today)
        } else {
          await supabase.from("user_usage").insert({
            user_id: userId,
            usage_date: today,
            generations_count: 1,
          })
        }
      } catch {
        // Ignore usage update errors
      }
    }

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
