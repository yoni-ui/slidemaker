"""
Design-system layout definitions — kept in sync with
frontend-next/lib/design-system.ts and frontend-next/components/slides/.

Each layout key maps to:
  - description  : shown to Gemini/Groq so it picks the right layout
  - regions      : which content fields are used by the React component
  - max_bullets  : upper bound for bullet count
  - html_classes : Tailwind classes (for reference / PPTX export mapping)
"""

LAYOUTS: dict[str, dict] = {
    "hero": {
        "description": (
            "Full-width opening slide. Large centered title (up to 10 words) with "
            "optional subtitle. No bullets. Use for the FIRST slide of every deck."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 0,
        "html_classes": {},
    },
    "title-card": {
        "description": (
            "Structured title slide with logo area, category badge, and footer "
            "(presenter name, date, location). Use when the deck needs a formal "
            "corporate opening. Put presenter info in subtitle or bullets as "
            "'Name | Title' and 'Date | Location'."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 2,
        "html_classes": {},
    },
    "bullet-list": {
        "description": (
            "Title at top, vertical list of bullet points below. Use for key "
            "points, features, agenda items, or process steps. "
            "Include 3–6 concise bullets (under 12 words each)."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "agenda": {
        "description": (
            "Table of contents or agenda. Numbered items in a 2-column grid. "
            "Format bullets as '01 | Topic Name | Short description'. "
            "Include 4–6 agenda items."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "two-column": {
        "description": (
            "Title header, then two equal columns. Left gets first half of bullets, "
            "right gets second half. Use for comparisons, pros/cons, before/after, "
            "dual topics. Include 4–6 bullets total."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "process-flow": {
        "description": (
            "Horizontal step-by-step process. Format bullets as "
            "'Step title | Description'. Include 3–6 steps. Use for workflows, "
            "implementation phases, or sequential processes."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "image-text": {
        "description": (
            "Left 45% image placeholder, right 55% title and bullets. Use when "
            "content has a strong visual, diagram, or product screenshot. "
            "Include 3–4 bullets."
        ),
        "regions": ["title", "bullets", "image"],
        "max_bullets": 4,
        "html_classes": {},
    },
    "product-features": {
        "description": (
            "Feature list on left and right, center placeholder for product mockup. "
            "Format bullets as 'Feature name | Description'. Use for product demos "
            "or feature highlights. Include 4–6 bullets."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "title-only": {
        "description": (
            "Large centered title (up to 8 words) with optional subtitle. No bullets. "
            "Use as a section divider between major topics."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 0,
        "html_classes": {},
    },
    "quote": {
        "description": (
            "Pull-quote centered on slide. Put FULL quote in 'title' (wrap in quotes). "
            "Put attribution in 'subtitle'. Bullets MUST be []. Use for testimonials "
            "or as the LAST slide (strong close)."
        ),
        "regions": ["title", "subtitle"],
        "max_bullets": 0,
        "html_classes": {},
    },
    "stats": {
        "description": (
            "Title header, then 2–4 large stat cards. Format EACH bullet as "
            "'VALUE | Label' e.g. '94% | Satisfaction', '$2.1M | ARR'. "
            "Use ONLY for concrete metrics or KPIs. Include 2–4 bullets."
        ),
        "regions": ["title", "stats"],
        "max_bullets": 4,
        "html_classes": {},
    },
    "team-overview": {
        "description": (
            "Grid of team member cards. Format bullets as 'Name | Role | Short quote'. "
            "Include 3–6 team members."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "testimonials": {
        "description": (
            "3 customer/stakeholder quote cards. Format bullets as "
            "'Quote text | Name | Role'. Include exactly 3 testimonials."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 3,
        "html_classes": {},
    },
    "case-study": {
        "description": (
            "Success story with metrics. Use title for project name, subtitle for "
            "challenge summary. Format bullets as 'Metric | Value' plus solution "
            "points. Include 4–6 bullets."
        ),
        "regions": ["title", "subtitle", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "company-values": {
        "description": (
            "Grid of company values (Innovation, Integrity, Collaboration, etc.). "
            "Format bullets as 'Value name | Description'. Include 4–6 values."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "pricing": {
        "description": (
            "3-tier pricing comparison. Format bullets as "
            "'Plan name | Price | Feature1, Feature2, Feature3'. Include 3 plans. "
            "Use when user mentions pricing, plans, or packages."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 3,
        "html_classes": {},
    },
    "data-chart": {
        "description": (
            "KPI stats row + chart area. Format bullets as 'Label | Value | up/down' "
            "for KPIs. Use when user mentions metrics, charts, or data visualization."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "timeline": {
        "description": (
            "Horizontal timeline with phases. Format bullets as "
            "'Q1 2024 | Phase name | Description'. Include 4–6 phases. "
            "Use for roadmaps or project timelines."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "milestones": {
        "description": (
            "Key accomplishments with dates. Format bullets as "
            "'Date | Milestone | done/pending'. Include 4–6 milestones."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "swot": {
        "description": (
            "SWOT analysis 2×2 grid. Format bullets as 'S: item', 'W: item', "
            "'O: item', 'T: item'. Include 2–3 items per quadrant (8–12 bullets). "
            "Use when user mentions SWOT, strategy, or analysis."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 12,
        "html_classes": {},
    },
    "global-presence": {
        "description": (
            "Map with region pins. Format bullets as 'Region | Offices | Employees'. "
            "Include 4–6 regions. Use when user mentions global, offices, or locations."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
    "next-steps": {
        "description": (
            "Action checklist. Format bullets as '✓ Action item' (done) or "
            "'○ Action item' (pending). Use for action plans or closing slides. "
            "Include 3–5 items."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 5,
        "html_classes": {},
    },
    "partner-logos": {
        "description": (
            "Grid of partner/client logos. Title only, no bullets. "
            "Use when user mentions partners, clients, or logos."
        ),
        "regions": ["title"],
        "max_bullets": 0,
        "html_classes": {},
    },
    "thank-you": {
        "description": (
            "Closing slide with contact info. Format bullets as "
            "'Email | address', 'Website | url', etc. Use as the LAST slide "
            "with contact details and CTAs."
        ),
        "regions": ["title", "bullets"],
        "max_bullets": 6,
        "html_classes": {},
    },
}

LAYOUT_KEYS = list(LAYOUTS.keys())


def layout_descriptions_for_prompt() -> str:
    return "\n".join(
        f'- "{key}": {info["description"]}' for key, info in LAYOUTS.items()
    )
