import json
import os

from groq import Groq
from fastapi import APIRouter, HTTPException

from .design_system import LAYOUT_KEYS, layout_descriptions_for_prompt
from .schemas import GenerateRequest, GenerateResponse, SlideContent

router = APIRouter(prefix="/api", tags=["generate"])

_SYSTEM_PROMPT = """\
You are a professional presentation designer. Given a topic or prompt, generate a \
polished, concise slide deck.

Available layouts (choose the best one for each slide):
{layout_descriptions}

Rules:
1. The FIRST slide MUST use the "hero" layout (opening title slide).
2. The LAST slide MUST use "quote" or "title-only" (strong close or call-to-action).
3. Use "two-column" for comparisons, pros/cons, or before/after content.
4. Use "image-text" for slides with a strong visual concept, diagram, or product view.
5. Use "bullet-list" for key points, features, or step-by-step processes.
6. Use "title-only" as a section divider between major topics.
7. Use "stats" only when highlighting 2–4 key metrics or KPIs.
8. Keep bullet points concise: under 12 words each.
9. Generate between 4 and 8 slides depending on topic complexity.
10. For "hero", "title-only", and "quote" layouts, bullets MUST be an empty array [].
11. For "quote" layout: put the quote text in "title" (wrap it in quotes), attribution in "subtitle".
12. For "stats" layout: format each bullet as "VALUE | Label" e.g. "94% | Satisfaction".
13. subtitle is optional — only include it when it meaningfully adds context.

Return ONLY a valid JSON array — no markdown, no explanation.
Each element must have exactly these fields:
[
  {{
    "title": "string",
    "subtitle": "string or null",
    "bullets": ["string", ...],
    "layout": "one of the layout keys listed above",
    "theme": "default"
  }}
]"""


def _build_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured in backend/.env")
    return Groq(api_key=api_key)


def _parse_slides(raw: str) -> list[SlideContent]:
    text = raw.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else text
        if text.startswith("json"):
            text = text[4:]
    text = text.strip()

    data: list[dict] = json.loads(text)

    slides: list[SlideContent] = []
    for item in data:
        layout = item.get("layout", "bullet-list")
        if layout not in LAYOUT_KEYS:
            layout = "bullet-list"
        slides.append(
            SlideContent(
                title=item.get("title", "Slide"),
                subtitle=item.get("subtitle") or None,
                bullets=item.get("bullets") or [],
                layout=layout,
                theme=item.get("theme", "default"),
            )
        )
    return slides


@router.post("/generate", response_model=GenerateResponse)
async def generate_slides(payload: GenerateRequest) -> GenerateResponse:
    client = _build_client()
    system = _SYSTEM_PROMPT.format(layout_descriptions=layout_descriptions_for_prompt())

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": f"Topic: {payload.prompt}"},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        raw = completion.choices[0].message.content or ""
        # Groq json_object mode wraps arrays in an object — unwrap if needed
        parsed = json.loads(raw)
        if isinstance(parsed, dict):
            raw = json.dumps(next(iter(parsed.values())))
        slides = _parse_slides(raw)
    except HTTPException:
        raise
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Groq returned invalid JSON: {exc}",
        ) from exc
    except Exception as exc:
        msg = str(exc)
        if "429" in msg or "rate_limit" in msg.lower():
            raise HTTPException(
                status_code=429,
                detail="Groq rate limit hit. Wait a moment and try again.",
            ) from exc
        if "401" in msg or "invalid_api_key" in msg.lower():
            raise HTTPException(
                status_code=401,
                detail="Groq API key is invalid. Check GROQ_API_KEY in backend/.env.",
            ) from exc
        raise HTTPException(status_code=502, detail=f"Groq API error: {exc}") from exc

    return GenerateResponse(slides=slides)
