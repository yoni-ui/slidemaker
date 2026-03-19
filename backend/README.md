# Slide Generator – Backend (FastAPI)

API for slide content generation and export (PPTX/PDF later).

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env      # optional: add OPENAI_API_KEY when using AI
```

## Run

```bash
uvicorn app.main:app --reload --reload-dir app --port 8001
```

- API: http://localhost:8001  
- Docs: http://localhost:8001/docs  
- Health: http://localhost:8001/health  

## Endpoints

- `POST /api/generate` – body: `{ "prompt": "5 slides about AI" }` → `{ "slides": [...] }`
- `POST /api/export/pptx` – body: `{ "deckTitle": "...", "slides": [...] }` → PPTX file
- `GET /health` – `{ "status": "ok" }`

Frontend (Next.js) should set `NEXT_PUBLIC_API_URL=http://localhost:8001` when calling the API.
