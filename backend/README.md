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
uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

## Endpoints

- `POST /api/generate` – body: `{ "prompt": "5 slides about AI" }` → `{ "slides": [...] }`
- `GET /health` – `{ "status": "ok" }`

Frontend (Next.js) should set `NEXT_PUBLIC_API_URL=http://localhost:8000` when calling the API.
