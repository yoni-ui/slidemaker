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

1. **Backend** (optional – for external API): from project root, `cd backend` then `uvicorn app.main:app --reload --reload-dir app --port 8001`. Set `NEXT_PUBLIC_API_URL=http://localhost:8001` in `.env.local` to use it.
2. **Frontend**: `npm install` then `npm run dev`. Copy `.env.local.example` to `.env.local` and add `GROQ_API_KEY` for AI generation.

Open [http://localhost:3000](http://localhost:3000). Use **Editor** (`/editor`) to enter a prompt and generate slides. Export PPTX works via Next.js API or the Python backend.

### Test user (development)

| Field | Value |
|-------|-------|
| Email | yonas.yishac@gmail.com |
| Password | 123456 |

Create this user in [Supabase Dashboard](https://supabase.com/dashboard) → Authentication → Users → Add user, or sign up via the app.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (theme from Stitch: primary, background-dark, surface-dark, etc.)
- Public Sans + Material Symbols Outlined

## Design source

UI is derived from the HTML in `frontend/stitch/*/code.html`. The editor supports AI generation, deck persistence (localStorage), export to PPTX, present mode, share, and undo/redo.
