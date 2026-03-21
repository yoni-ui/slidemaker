import Groq from "groq-sdk"
import { getTemplateRegistryForAgent } from "@/lib/template-registry"
import {
  parseDeckSpec,
  parseRenderSpec,
  validateRenderSpec,
  type DeckSpec,
  type RenderSpec,
} from "@/lib/generate-validation"

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
      "subtitle": "string | null",
      "bullets": ["string"],
      "visualIntent": "text | image | stats | timeline",
      "imagePrompt": "string | null",
      "backgroundPrompt": "string | null",
      "theme": "string | null",
      "accentColor": "string | null"
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
- If outline includes theme or accentColor hints, respect them in theme field (e.g. default, dark, or keep default if unsure)

Return JSON only:
{
  "slides": [
    {
      "title": "string",
      "subtitle": "string | null",
      "bullets": ["string"],
      "layout": "one of the template ids from registry",
      "theme": "default",
      "imagePrompt": "string | null",
      "backgroundPrompt": "string | null"
    }
  ]
}`

export async function callContentAgent(
  client: Groq,
  prompt: string
): Promise<DeckSpec> {
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

export async function callDesignAgent(
  client: Groq,
  deckSpec: DeckSpec
): Promise<RenderSpec> {
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
      theme: s.theme,
      accentColor: s.accentColor,
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
