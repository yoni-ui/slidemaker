# Slide Generator

Gamma-style slide generator: prompt → AI content → classy layouts → export to **editable PPTX** and **PDF**.

## Quick start

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  

### 2. Frontend (Next.js)

```bash
cd frontend-next
npm install
cp .env.local.example .env.local
npm run dev
```

- App: http://localhost:3000  
- Editor: http://localhost:3000/editor — enter a prompt and click **Generate slides** to call the backend and display slides.

### 3. Integrate

With both running, open the **Editor**, type a prompt (e.g. “5 slides about AI in education”), and click **Generate slides**. The backend returns slide content; the editor shows thumbnails and the current slide (title, subtitle, bullets).

## Repo layout

- **backend/** — FastAPI app: `POST /api/generate`, health, (later) export PPTX/PDF.
- **frontend-next/** — Next.js App Router UI (landing, dashboard, editor, templates, team, shared, settings). Editor calls the backend for generation.
- **design-system/** — Layout and theme JSON (for future canvas/export).
- **IMPLEMENTATION_PLAN_AND_RATIONALE.md** — Plan and tech choices.

## Env

- **Backend**: optional `backend/.env` (see `backend/.env.example`), e.g. `OPENAI_API_KEY` for future AI.
- **Frontend**: `frontend-next/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000` if the API is not on that URL.
