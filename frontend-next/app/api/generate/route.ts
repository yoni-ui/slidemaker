import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { createClient } from "@/lib/supabase/server"
import { getTemplateRegistryForAgent } from "@/lib/template-registry"
import {
  validateDeckSpec,
  parseDeckSpec,
  parseRenderSpec,
  validateRenderSpec,
  type DeckSpec,
  type RenderSpec,
} from "@/lib/generate-validation"

const FREE_DAILY_LIMIT = 5

const CONTENT_AGENT_PROMPT = `You are a presentation strategist. Convert the user's topic or prompt into a structured slide deck outline.

Your job: define narrative structure, slide purpose, and content. Do NOT choose layouts — that is done by a separate design agent.

Rules:
- First slide: hero or intro (deck title + optional subtitle)
- Last slide: strong close (quote, thank-you, or call-to-action)
- 4–8 slides depending on topic complexity
- Keep titles under 10 words, bullets under 12 words each
- Max 6 bullets per slide
- Assign purpose per slide: hero, problem, solution, agenda, comparison, timeline, quote, etc.
- For image-heavy slides, add imagePrompt (Pollinations-style prompt, e.g. "modern AI dashboard")
- For quote slides: put full quote in title (wrap in quotes), attribution in subtitle

Return JSON only:
{
  "deckTitle": "string",
  "slides": [
    {
      "purpose": "hero | problem | solution | agenda | comparison | timeline | quote | etc",
      "title": "string",
      "subtitle": "string or null",
      "bullets": ["string"],
      "visualIntent": "text | image | stats | timeline",
      "imagePrompt": "string or null",
      "backgroundPrompt": "string or null"
    }
  ]
}`

const DESIGN_AGENT_PROMPT = `You are a presentation design engine. Given a deck outline and template registry, assign the best layout per slide and map content.

Template registry (choose ONLY from these ids):
{template_registry}

Rules:
- Match slide purpose to template purpose (e.g. hero→hero, comparison→two-column, timeline→timeline)
- First slide MUST use "hero" or "title-card"
- Last slide MUST use "quote", "thank-you", or "title-only"
- Do NOT rewrite content — only map it to the output format
- Prefer exportSafe templates (avoid freeform for auto-generation)
- Use "image-text" or "case-study" when imagePrompt is provided
- Use "agenda" for table-of-contents style content
- Use "stats" or "data-chart" for metrics/KPIs
- Use "pricing" for plan comparisons
- Use "swot" for strategy analysis
- Use "timeline" for roadmaps
- Use "bullet-list" when no specialized layout fits

Return JSON only:
{
  "slides": [
    {
      "title": "string",
      "subtitle": "string or null",
      "bullets": ["string"],
      "layout": "one of the template ids from registry",
      "theme": "default",
      "imagePrompt": "string or null",
      "backgroundPrompt": "string or null"
    }
  ]
}`

const callContentAgent = async (client: Groq, prompt: string): Promise<DeckSpec> => {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: CONTENT_AGENT_PROMPT },
      { role: "user", content: `Topic: ${prompt}` },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  })
  const raw = completion.choices[0]?.message?.content ?? "{}"
  return parseDeckSpec(raw)
}

const callDesignAgent = async (
  client: Groq,
  deckSpec: DeckSpec
): Promise<RenderSpec> => {
  const registry = getTemplateRegistryForAgent()
  const system = DESIGN_AGENT_PROMPT.replace("{template_registry}", registry)
  const userContent = `Deck outline to design:
${JSON.stringify(
  {
    deckTitle: deckSpec.deckTitle,
    slides: deckSpec.slides.map((s) => ({
      purpose: s.purpose,
      title: s.title,
      subtitle: s.subtitle,
      bullets: s.bullets,
      visualIntent: s.visualIntent,
      imagePrompt: s.imagePrompt,
      backgroundPrompt: s.backgroundPrompt,
    })),
  },
  null,
  2
)}`

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: system },
      { role: "user", content: userContent },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  })
  const raw = completion.choices[0]?.message?.content ?? "{}"
  return parseRenderSpec(raw)
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

  try {
    // Agent 1: Content Architect
    const deckSpec = await callContentAgent(client, prompt)
    const validatedDeckSpec = validateDeckSpec(deckSpec)

    // Agent 2: Design Agent
    const renderSpec = await callDesignAgent(client, validatedDeckSpec)
    const validatedRenderSpec = validateRenderSpec(renderSpec)

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

    return NextResponse.json({
      slides: validatedRenderSpec.slides,
      deckTitle: validatedDeckSpec.deckTitle,
      warnings: validatedRenderSpec.warnings,
    })
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
