# Deployment

## Vercel (Frontend)

1. **Import the repo** at [vercel.com/new](https://vercel.com/new) and select this GitHub repository.

2. **Set Root Directory** to `frontend-next`:
   - Project Settings → General → Root Directory → Edit → `frontend-next`

3. **Environment variables** (optional): Add `NEXT_PUBLIC_API_URL` if using an external API.

4. **Deploy** — Vercel auto-deploys on every push to `main`.

## CI/CD

GitHub Actions runs on every push and PR to `main`:
- Lint (`npm run lint`)
- Build (`npm run build`)

Vercel deployments are triggered automatically when the repo is connected.
