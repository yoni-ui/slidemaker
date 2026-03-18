"""
Design-system layout definitions — kept in sync with
frontend-next/lib/design-system.ts and frontend-next/components/slides/.

Each layout key maps to:
  - description  : shown to Gemini/Groq so it picks the right layout
  - regions      : which content fields are used by the React component
  - max_bullets  : upper bound for bullet count
  - html_classes : Tailwind classes used by the corresponding React component
                   (for reference / PPTX export mapping)
"""

LAYOUTS: dict[str, dict] = {
    "hero": {
        "description": (
            "Full-width opening slide. Large centered title (up to 10 words) with "
            "an optional short subtitle. No bullets. Features an ambient orange glow "
            "and a bold typographic hierarchy. Use for the FIRST slide of every deck."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 0,
        "html_classes": {
            "wrapper": "relative flex h-full w-full flex-col items-center justify-center text-center px-20",
            "title": "text-[64px] font-black tracking-tight text-slate-100",
            "subtitle": "text-2xl font-light text-slate-400",
        },
    },
    "bullet-list": {
        "description": (
            "Title at the top (dark header band with an orange accent bar) and a "
            "vertical list of bullet points below, each prefixed with an orange dot. "
            "Use for key points, features, agenda items, or process steps. "
            "Include 3–6 concise bullets (under 12 words each)."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {
            "wrapper": "flex h-full w-full flex-col bg-canvas",
            "header": "border-b border-primary/20 bg-background-dark px-12 py-8",
            "title": "text-[42px] font-bold tracking-tight text-slate-100",
            "bullets": "flex flex-col gap-4 px-12 py-8",
        },
    },
    "two-column": {
        "description": (
            "Title header at the top, then the canvas splits into two equal columns "
            "separated by a vertical orange divider. Left column gets the first half "
            "of bullets, right column gets the second half. "
            "Use for comparisons, pros/cons, before/after, or dual topics. "
            "Include 4–6 bullets total (split evenly)."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {
            "wrapper": "flex h-full w-full flex-col bg-canvas",
            "columns": "flex flex-1 overflow-hidden",
            "column": "flex flex-1 flex-col justify-center gap-3 px-10 py-6",
        },
    },
    "image-text": {
        "description": (
            "Left 45% of the slide is an image placeholder with a grid pattern and "
            "orange icon. Right 55% shows the title and bullet points. "
            "Use when the content has a strong visual, diagram, product screenshot, "
            "or conceptual illustration. Include 3–4 bullets."
        ),
        "regions": ["title", "bullets", "image"],
        "max_bullets": 4,
        "html_classes": {
            "wrapper": "flex h-full w-full bg-canvas",
            "image": "relative flex w-[45%] items-center justify-center bg-background-dark",
            "text": "flex flex-1 flex-col justify-center gap-5 px-10 py-10",
            "title": "text-[38px] font-bold tracking-tight text-slate-100",
        },
    },
    "title-only": {
        "description": (
            "Large centered title (up to 8 words) with concentric decorative rings "
            "and an optional short subtitle. No bullets. "
            "Use as a section divider between major topics or for transitional slides."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 0,
        "html_classes": {
            "wrapper": "relative flex h-full w-full flex-col items-center justify-center text-center px-20",
            "title": "text-[58px] font-black tracking-tight text-slate-100",
            "subtitle": "text-xl font-light text-slate-400",
        },
    },
    "quote": {
        "description": (
            "An impactful pull-quote centered on the slide. Large opening and closing "
            "quotation marks in orange. The quote itself is in italic. "
            "Put the FULL quote text in 'title' (wrap in double-quotes). "
            "Put the attribution (person name / source) in 'subtitle'. "
            "Bullets MUST be an empty array []. "
            "Use for key statements, testimonials, or as the LAST slide (strong close)."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 0,
        "html_classes": {
            "wrapper": "relative flex h-full w-full flex-col items-center justify-center text-center px-16",
            "quote": "text-[32px] font-medium italic text-slate-100",
            "attribution": "text-base font-semibold uppercase tracking-widest text-primary",
        },
    },
    "stats": {
        "description": (
            "Title header at the top, then 2–4 large stat cards arranged in a row. "
            "Each card shows a huge orange number/percentage and a small label below. "
            "Format EACH bullet as 'VALUE | Label' e.g. '94% | Customer Satisfaction', "
            "'3.2x | Revenue Growth', '$2.1M | ARR'. "
            "Use ONLY when the slide highlights concrete metrics, KPIs, or quantitative evidence. "
            "Include exactly 2–4 bullets."
        ),
        "regions": ["title", "stats"],
        "max_bullets": 4,
        "html_classes": {
            "wrapper": "flex h-full w-full flex-col bg-canvas",
            "stat_value": "text-[64px] font-black leading-none text-primary",
            "stat_label": "text-sm font-medium uppercase tracking-wider text-slate-400",
        },
    },
}

LAYOUT_KEYS = list(LAYOUTS.keys())


def layout_descriptions_for_prompt() -> str:
    return "\n".join(
        f'- "{key}": {info["description"]}' for key, info in LAYOUTS.items()
    )
