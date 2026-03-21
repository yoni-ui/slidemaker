import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import { callContentAgent } from "@/lib/generate-agents"
import { validateDeckSpec } from "@/lib/generate-validation"

/**
 * POST /api/plan — content agent only (outline for review).
 * Does NOT increment user_usage; final POST /api/generate with deckSpec counts as one generation.
 */
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

  try {
    const deckSpec = await callContentAgent(client, prompt)
    const validated = validateDeckSpec(deckSpec)
    return NextResponse.json({
      deckTitle: validated.deckTitle,
      slides: validated.slides,
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
