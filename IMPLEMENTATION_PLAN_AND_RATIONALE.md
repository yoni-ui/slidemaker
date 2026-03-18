# Slide Generator: Implementation Plan & Technology Choices

This document adds (1) a **step-by-step implementation plan** and (2) **why each technology was chosen** for the Gamma-level slide generator (React + FastAPI stack).

---

## Part 1: Why these technologies?

### Frontend

- **React 18** – Component model fits slide UI: each slide is a component, theme and layout are props. Large ecosystem and documentation. Pairs well with Fabric.js and matches your chosen stack.

- **TypeScript** – Typed slide and layout models (e.g. `SlideContent`, `LayoutRegion`) prevent bugs when wiring AI JSON to the canvas and when adding new layouts. Refactoring stays safer as the project grows.

- **Vite** – Fast dev server and builds without Create React App. Native ESM and minimal config; standard choice for new React apps.

- **Tailwind CSS** – Design system (spacing, font scale, colors) maps directly to utility classes. One theme config can drive both the app chrome and the canvas layout renderer. Avoids maintaining a separate CSS design-token file early on.

- **Fabric.js (not Konva)** – Fabric has first-class **object-level export** (`object.toSVG()`, `object.toDataURL()`), which is exactly what “export this element” needs. Konva is great for scenes but export is more scene-oriented. Fabric’s IText/Textbox give in-place editing with minimal code. Mature and well-documented.

### Backend

- **FastAPI** – Async from the start, so calling OpenAI and doing file I/O don’t block. Automatic OpenAPI docs help the frontend and debugging. Python has the best libraries for **python-pptx** and optional **WeasyPrint/reportlab** for PDF. Keeps one language ecosystem on the server (your choice: React + FastAPI).

- **OpenAI API (or compatible)** – Structured output (JSON schema) gives reliable slide content (title, bullets) in one call. No need to parse markdown or retry. Other providers (Anthropic, etc.) can be swapped behind a thin service later.

### Export

- **PDF (v1: frontend jsPDF + canvas)** – Easiest path: render each slide to an image from the Fabric canvas, then add pages to jsPDF. No server-side font or layout matching. Trade-off: file size (raster) and no selectable text in PDF unless you add a second path later. **Alternative:** Backend WeasyPrint with HTML per slide gives selectable text and smaller files but requires replicating layout in HTML/CSS.

- **PPTX: python-pptx** – The standard way to generate PowerPoint in Python. Programmatic slides (title, body, shapes) map cleanly to our slide model. Server-side keeps the API key and file logic in one place and avoids reimplementing OOXML in the browser.

- **Element export (SVG/PNG)** – Done in the **frontend** with Fabric: the canvas already has the object tree. `selectedObject.toSVG()` or `toDataURL('image/png')` plus a download link avoids a round-trip and keeps “export this element” instant and simple.

### Design system (JSON)

- **Layouts and themes as JSON** – Shareable between frontend (rendering on canvas) and backend (e.g. PPTX layout or future server-side PDF). Rule-based layout selection (e.g. first slide = hero) stays simple and predictable; no need for an LLM to decide layout in v1.

---

## Part 2: Step-by-step implementation plan

Execute in order. Each step produces a testable outcome.

### Phase 1 – Foundation (Week 1–2)

| Step | Task | Outcome |
|------|------|---------|
| 1.1 | Create repo structure: `frontend/`, `backend/`, `design-system/`. | Folders and root README. |
| 1.2 | Scaffold **frontend**: `npm create vite@latest frontend -- --template react-ts`, add Tailwind, add `VITE_API_URL` in `.env`. | React app runs; Tailwind works. |
| 1.3 | Scaffold **backend**: FastAPI app, `uvicorn`, CORS for frontend origin, `.env` for `OPENAI_API_KEY`. | `GET /health` or `/docs` works. |
| 1.4 | Define **design-system schema**: JSON shape for layouts (type, regions) and themes (colors, fontScale, spacing). | `design-system/layouts/schema.json` and `themes/schema.json` (or one combined schema). |
| 1.5 | Add **one layout** (e.g. `hero.json`) and **one theme** (e.g. `default.json`) under `design-system/`. | Valid JSON files that match the schema. |
| 1.6 | **Backend:** Pydantic schemas: `GenerateRequest(prompt)`, `SlideContent(title, subtitle?, bullets?)`, `GenerateResponse(slides)`. | `app/schemas/slides.py`. |
| 1.7 | **Backend:** `POST /api/generate`: call OpenAI with structured output (JSON schema for slide list), map response to `GenerateResponse`. | Endpoint returns `{ "slides": [...] }` for a test prompt. |
| 1.8 | **Frontend:** `src/services/api.ts` – `generateSlides(prompt)` calling `POST /api/generate`. | API client ready. |
| 1.9 | **Frontend:** Prompt textarea + “Generate” button; on success, display slide titles and bullets in simple cards/list (no canvas). | End-to-end: prompt → API → displayed content. |
| 1.10 | Add 2–4 more layouts (two-column, bullet-list, image+text, title-only) and one more theme. | Design system ready for Phase 2. |

### Phase 2 – Canvas and layout (Week 3–4)

| Step | Task | Outcome |
|------|------|---------|
| 2.1 | **Frontend:** Add Fabric.js; create a single canvas in a React component (useRef, one Fabric.Canvas per mount), cleanup on unmount. | Blank canvas renders; no duplicate instances on re-render. |
| 2.2 | **Frontend:** Load layout and theme JSON (from `public/` or import); define TypeScript types for Layout and Theme. | `src/design-system/loadLayoutsThemes.ts` and types. |
| 2.3 | **Layout renderer:** Function that takes (slideContent, layoutKey, theme) and returns Fabric object specs or creates Fabric objects on a canvas (title, subtitle, bullets, placeholders). Apply theme fonts and colors from theme JSON. | One slide can be drawn on the canvas from content + layout + theme. |
| 2.4 | **Frontend:** State: `slides: SlideModel[]`, `currentSlideIndex`, `themeId`. Render current slide on the canvas using the layout renderer. | Switching “current slide” or changing content updates the canvas. |
| 2.5 | **Theme picker UI:** Dropdown or buttons to set `themeId`; re-run layout renderer for current slide with new theme. | User can change theme and see the slide update. |
| 2.6 | **Backend (optional):** Assign `layout` per slide (e.g. first → hero, rest → bullet-list) in `POST /api/generate` response. Frontend uses `slides[i].layout` when rendering. | Consistent layout assignment. |
| 2.7 | **Editing:** Use Fabric IText/Textbox for title and bullets; persist changes back to `slides` state (e.g. on object:modified or blur). | User can edit text and move elements; state stays in sync. |
| 2.8 | **Slide list:** Thumbnails or list of slide titles; click to set `currentSlideIndex`. | User can navigate between slides. |

### Phase 3 – Export (Week 4–5)

| Step | Task | Outcome |
|------|------|---------|
| 3.1 | **PDF (frontend):** For each slide, render to image (canvas.toDataURL('image/png')), add to jsPDF as a page, trigger download. | “Export PDF” downloads a multi-page PDF. |
| 3.2 | **Backend:** Pydantic schema for export request: list of slides (title, subtitle, bullets, layout). `POST /api/export/pptx` builds file with python-pptx, returns StreamingResponse (file download). | PPTX download works from API. |
| 3.3 | **Frontend:** “Export PPTX” button calls `POST /api/export/pptx` with current `slides` and triggers download of the response file. | User can export deck as PPTX. |
| 3.4 | **Export element:** On Fabric selection, show “Export as SVG” and “Export as PNG”. SVG: `selectedObject.toSVG()`; PNG: canvas with only that object (or object.toDataURL). Trigger download via blob URL. | User can export a single selected element as SVG or PNG. |

### Phase 4 – Polish and “Gamma feel” (Week 5–6)

| Step | Task | Outcome |
|------|------|---------|
| 4.1 | Add more layouts (e.g. quote, comparison, timeline) and 1–2 more themes; enforce consistent typography and spacing from theme. | Richer design system. |
| 4.2 | Loading states for “Generate” and “Export”; error handling (API errors, no API key). | Clear feedback and errors. |
| 4.3 | Slide reorder (e.g. drag in thumbnail list), duplicate slide, delete slide. | Full deck editing. |
| 4.4 | Optional: Image placeholder region – accept URL or leave for “AI image” later; layout stays rule-based. | Placeholder for future images. |

---

## Summary

- **Why these models/tech:** React + TS + Vite + Tailwind for a maintainable, typed frontend with a design-system-friendly UI; Fabric.js for editable canvas and **per-element export**; FastAPI + OpenAI for async, documented API and reliable structured slide content; python-pptx for PPTX; jsPDF + canvas for a simple first PDF path; JSON design system for shared, rule-based layouts and themes.
- **Implementation plan:** Four phases (Foundation → Canvas & layout → Export → Polish) with ordered steps and clear outcomes so you can build and test incrementally toward a Gamma-level slide generator with export of individual elements.

## USP: PowerPoint‑ready & classy by design

Our unique selling point is **PowerPoint‑ready, fully editable PPTX + matching PDFs**, wrapped in a **curated, classy design system**.

### PowerPoint‑ready, editable PPTX

- Slide data is modeled to match PowerPoint concepts (titles, subtitles, bullet frames, image placeholders, accent shapes), not arbitrary HTML or markdown.
- The PPTX export uses `python-pptx` to create real text frames and shapes for every region, never flattening whole slides into images.
- Each layout in our JSON design system has a direct mapping to:
  - Fabric canvas positions (what the user sees while editing).
  - A specific PowerPoint slide layout and set of text boxes (what they get when exporting).
- Fonts, sizes, and colors are taken from a small, compatible theme set and applied identically in both the canvas preview and the PPTX, so decks open cleanly and stay editable.

### PDF that follows the deck

- Version 1 builds PDFs by rendering each slide from the Fabric canvas and assembling them with jsPDF, guaranteeing visual fidelity.
- A later enhancement path uses the same layout/theme JSON to generate HTML/CSS per slide and render via WeasyPrint, giving smaller, selectable‑text PDFs while keeping the look aligned with the PPTX.

### Classy, curated design system

- Instead of random AI styling, we provide a small set of hand‑crafted themes (e.g. SerifElegant, ModernMinimal, Noir) with carefully chosen palettes, type scales, and spacing.
- Layouts encode margins, gutters, and alignment rules to enforce whitespace and balance, so every generated slide feels intentional and professional.
- Simple “polish rules” (auto-capitalized titles, cleaned bullets, limited items per slide) keep output closer to a designer‑made deck than a typical AI dump.