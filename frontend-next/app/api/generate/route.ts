import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { callContentAgent, callDesignAgent } from "@/lib/generate-agents"
import {
  validateDeckSpec,
  validateRenderSpec,
  type DeckSpec,
} from "@/lib/generate-validation"
import {
  FREE_DAILY_LIMIT,
  getGenerationUserId,
  incrementGenerationCount,
  isOverDailyGenerationLimit,
} from "@/lib/generate-usage"

function groqErrorResponse(e: unknown) {
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

  let body: { prompt?: string; deckSpec?: DeckSpec }
  try {
    body = (await req.json()) as { prompt?: string; deckSpec?: DeckSpec }
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 })
  }

  const promptTrim = (body.prompt ?? "").trim()
  const hasPrompt = promptTrim.length > 0
  const rawDeck = body.deckSpec
  const hasDeckSpec =
    rawDeck &&
    typeof rawDeck === "object" &&
    typeof rawDeck.deckTitle === "string" &&
    Array.isArray(rawDeck.slides) &&
    rawDeck.slides.length > 0

  if (hasPrompt === hasDeckSpec) {
    return NextResponse.json(
      {
        detail:
          "Provide exactly one of: { prompt: string } (full pipeline) or { deckSpec: DeckSpec } (design only).",
      },
      { status: 400 }
    )
  }

  const userId = await getGenerationUserId()
  if (userId && (await isOverDailyGenerationLimit(userId))) {
    return NextResponse.json(
      {
        detail: `Daily limit reached (${FREE_DAILY_LIMIT} AI generations). Resets at midnight.`,
      },
      { status: 429 }
    )
  }

  const client = new Groq({ apiKey })

  try {
    let validatedDeckSpec: DeckSpec

    if (hasPrompt) {
      const deckSpec = await callContentAgent(client, promptTrim)
      validatedDeckSpec = validateDeckSpec(deckSpec)
    } else {
      validatedDeckSpec = validateDeckSpec(rawDeck as DeckSpec)
    }

    const renderSpec = await callDesignAgent(client, validatedDeckSpec)
    const validatedRenderSpec = validateRenderSpec(renderSpec)

    if (userId) {
      await incrementGenerationCount(userId)
    }

    return NextResponse.json({
      slides: validatedRenderSpec.slides,
      deckTitle: validatedDeckSpec.deckTitle,
      warnings: validatedRenderSpec.warnings,
    })
  } catch (e: unknown) {
    return groqErrorResponse(e)
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" })
}
