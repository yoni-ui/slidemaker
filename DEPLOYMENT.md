# Deployment

## Quick Fix: "Supabase is not configured" on Vercel

1. Go to [vercel.com](https://vercel.com) → your project → **Settings** → **Environment Variables**
2. Add these (use your Supabase project values):

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key from Supabase |
   | `GROQ_API_KEY` | Your Groq API key |

3. Redeploy: **Deployments** → latest → **⋯** → **Redeploy**

---

## Important: Where to Put API Keys

**DO NOT put API keys or secrets in GitHub.** They must never be committed. Use:

- **Local dev:** `frontend-next/.env.local` (gitignored)
- **Vercel:** Project Settings → Environment Variables

---

## Vercel (Frontend)

### 1. Import the Repo

Import at [vercel.com/new](https://vercel.com/new) and select this GitHub repository.

### 2. Set Root Directory

- Project Settings → General → Root Directory → Edit → `frontend-next`
- Your Next.js app lives in this subfolder; Vercel must build from here.

### 3. Add Environment Variables (Required for Auth and AI)

Go to **Project Settings → Environment Variables** and add:

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `GROQ_API_KEY` | Yes | [console.groq.com/keys](https://console.groq.com/keys) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard → Project Settings → API (anon/public key) |

Add these for **Production**, **Preview**, and **Development** (or at least Production).

**Without these, you will see "Supabase is not configured" on login and AI generation will fail.**

### 4. Optional Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Point at standalone Python backend (e.g. `http://localhost:8001`) |

### 5. Build Settings

- Framework Preset: **Next.js**
- Build Command: `npm run build` (default)
- Install Command: `npm install` (default)

### 6. Deploy

Vercel auto-deploys on every push to `main`. After adding env vars, trigger a redeploy (Deployments → … → Redeploy).

---

## Supabase Setup (Required for Auth)

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Run `frontend-next/supabase/migrations/001_create_decks.sql` in SQL Editor
3. Run `frontend-next/supabase/migrations/002_draft_and_usage.sql` in SQL Editor
4. In Authentication → URL Configuration, add your Vercel URL to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/**` (or your custom domain)
5. Enable Email and Google providers in Authentication → Providers

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| Supabase is not configured | Env vars missing on Vercel | Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel, then redeploy |
| AI generation fails | `GROQ_API_KEY` missing | Add `GROQ_API_KEY` in Vercel |
| No Output Directory named "public" | Wrong framework | Set Framework Preset to **Next.js** |
| Multiple lockfiles | Wrong root | Set Root Directory to `frontend-next` |

---

## CI/CD

GitHub Actions runs on every push and PR to `main`:
- Lint (`npm run lint`)
- Build (`npm run build`)

Vercel deployments are triggered automatically when the repo is connected.
