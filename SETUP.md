# SlideMaker — Get Everything Working

Follow these steps so AI generation, auth (optional), and export all work.

---

## 1. API keys you need

| Key | Required for | Where to get it |
|-----|----------------|------------------|
| **GROQ_API_KEY** | Yes — AI slide generation | [Groq Console](https://console.groq.com/keys) (free tier) |
| **NEXT_PUBLIC_SUPABASE_URL** | Optional — login & saved decks | [Supabase](https://supabase.com/dashboard) → Project Settings → API |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | Optional — same as above | Same page as URL |
| **SUPABASE_SERVICE_ROLE_KEY** | Optional — test user script | Same page (keep secret) |

---

## 2. Frontend env (required for AI)

1. In the project root, go to `frontend-next/`.
2. Copy the example env file:
   ```bash
   cd frontend-next
   copy .env.local.example .env.local
   ```
3. Open `frontend-next/.env.local` and set:

   **Minimum (AI only, no login):**
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
   NEXT_PUBLIC_DISABLE_AUTH=true
   ```
   Use your real Groq key. With `NEXT_PUBLIC_DISABLE_AUTH=true` you can use the app without Supabase; decks are stored in the browser (localStorage).

   **Full (auth + cloud decks):**
   ```env
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Do **not** set `NEXT_PUBLIC_DISABLE_AUTH` (or set it to `false`). Then run the Supabase migrations (step 3).

---

## 3. Supabase (only if you use auth)

1. Create a project at [Supabase](https://supabase.com/dashboard).
2. In the SQL Editor, run these in order:
   - Contents of `frontend-next/supabase/migrations/001_create_decks.sql`
   - Contents of `frontend-next/supabase/migrations/002_draft_and_usage.sql`
3. In Authentication → URL Configuration, set Site URL to `http://localhost:3000` (for dev) and add `http://localhost:3000/**` to Redirect URLs.
4. Put the project URL and anon key in `frontend-next/.env.local` as in step 2.

---

## 4. Run the project

**Terminal 1 — frontend (Next.js):**
```bash
cd frontend-next
npm install
npm run dev
```
Open http://localhost:3000. Use **Editor** to enter a prompt and generate slides.

**Optional — backend (Python):**  
Only needed if you use `NEXT_PUBLIC_API_URL` to point at the Python backend. Otherwise the Next.js API routes (`/api/generate`, `/api/export/pptx`, etc.) handle everything.
```bash
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

---

## 5. Quick test without Supabase

1. Set in `.env.local`:
   - `GROQ_API_KEY=<your-groq-key>`
   - `NEXT_PUBLIC_DISABLE_AUTH=true`
2. `npm run dev` in `frontend-next`.
3. Open http://localhost:3000/editor and generate slides. Decks are stored in the browser.

---

## 6. If something fails

- **"GROQ_API_KEY is not configured"** — Add `GROQ_API_KEY` to `frontend-next/.env.local` and restart `npm run dev`.
- **Redirect to login on /dashboard** — Set `NEXT_PUBLIC_DISABLE_AUTH=true` to bypass auth, or configure Supabase and run the migrations.
- **Daily limit reached** — You’re logged in and the `user_usage` table is in use. Wait until the next day or use an anonymous session with `NEXT_PUBLIC_DISABLE_AUTH=true`.
