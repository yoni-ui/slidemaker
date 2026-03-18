# Slide Generator – Next.js Frontend

Next.js App Router frontend based on the Stitch designs in `../stitch/`. Dark-first, DeckShare branding, Tailwind with custom theme.

## Routes (mapped from Stitch screens)

| Route | Stitch screen |
|-------|----------------|
| `/` | Dark Mode Landing Page |
| `/dashboard` | Dashboard |
| `/editor` | Slide Editor |
| `/templates` | Templates Library |
| `/team` | Team & Workspace |
| `/shared` | Shared with Me |
| `/settings` | Settings & Profile |

## Run

1. **Backend** (required for Generate in editor): from project root, `cd backend` then `uvicorn app.main:app --reload --port 8000`.
2. **Frontend**: `npm install` then `npm run dev`. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL=http://localhost:8000` if the API runs elsewhere.

Open [http://localhost:3000](http://localhost:3000). Use **Editor** (`/editor`) to enter a prompt and generate slides from the API.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (theme from Stitch: primary, background-dark, surface-dark, etc.)
- Public Sans + Material Symbols Outlined

## Design source

UI is derived from the HTML in `frontend/stitch/*/code.html`. The editor page is the placeholder for wiring the existing slide generator (prompt → API → Fabric canvas) and export (PDF/PPTX).
