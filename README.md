# Slide Generator

Gamma-style slide generator: prompt → AI content → classy layouts → export to **editable PPTX** and **PDF**.

## Quick start

### One command (frontend + API)

From the **repo root**:

```bash
npm install
cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && cd ..
cd frontend-next && npm install && cd ..
```

Create `frontend-next/.env.local` (copy from `frontend-next/.env.local.example`) and set:

- **`GROQ_API_KEY`** — required for AI generation ([Groq console](https://console.groq.com/keys))
- **`NEXT_PUBLIC_DISABLE_AUTH=true`** — use the app locally without Supabase (browser-only decks)

Then from the repo root:

```powershell
npm run dev:all
```

This runs **both** in **one** terminal (mixed logs). For two separate windows instead: `npm run dev:all:windows` (PowerShell).

- **Web app:** http://localhost:3000 (or the next free port if 3000 is busy)  
- **Python API:** http://localhost:8001 — [Swagger docs](http://localhost:8001/docs)  
- **Health:** http://localhost:8001/health  

By default the Next.js app uses **built-in** `/api/generate` (same machine). To send generate/export traffic to Python instead, add to `.env.local`:

`NEXT_PUBLIC_API_URL=http://localhost:8001`

### Or run separately

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --reload-dir app --host 127.0.0.1 --port 8001
```

**Frontend**

```bash
cd frontend-next
npm install
copy .env.local.example .env.local
npm run dev
```

## Repo layout

- **backend/** — FastAPI app: `POST /api/generate`, health, (later) export PPTX/PDF.
- **frontend-next/** — Next.js App Router UI (landing, dashboard, editor, templates, team, shared, settings). Editor calls the backend for generation.
- **design-system/** — Layout and theme JSON (for future canvas/export).
- **IMPLEMENTATION_PLAN_AND_RATIONALE.md** — Plan and tech choices.

## Vercel deployment

Set **Root Directory** to `frontend-next` in your Vercel project settings:

1. Project Settings → Build & Deployment → Root Directory
2. Enter `frontend-next` and save

This ensures Vercel builds the Next.js app correctly. Add `GROQ_API_KEY` in Vercel environment variables for AI generation.

## Env

- **Backend**: optional `backend/.env` (see `backend/.env.example`), e.g. `OPENAI_API_KEY` for future AI.
- **Frontend**: `frontend-next/.env.local` — see `.env.local.example`. Optional: `NEXT_PUBLIC_API_URL=http://localhost:8001` to use the Python API for generate/export instead of Next.js routes.
