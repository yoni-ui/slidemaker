# Deployment

## Vercel (Frontend)

### Setup

1. **Import the repo** at [vercel.com/new](https://vercel.com/new) and select this GitHub repository.

2. **Set Root Directory** to `frontend-next` (required):
   - Project Settings → General → Root Directory → Edit → `frontend-next`
   - Your Next.js app lives in this subfolder; Vercel must build from here.

3. **Build & Development Settings**:
   - Framework Preset: **Next.js**
   - Output Directory: leave default (Next.js uses `.next`, not `public`)
   - Build Command: `npm run build` (default)
   - Install Command: `npm install` or `npm ci` (default)

4. **Environment variables** (optional): Add `NEXT_PUBLIC_API_URL` if using an external API.

5. **Deploy** — Vercel auto-deploys on every push to `main`.

### Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| No Output Directory named "public" found | Vercel thinks this is a static site | Set Framework Preset to **Next.js** |
| Multiple lockfiles | Root Directory not set | Set Root Directory to `frontend-next` |
| Build fails / wrong folder | Building from repo root | Set Root Directory to `frontend-next` |

## CI/CD

GitHub Actions runs on every push and PR to `main`:
- Lint (`npm run lint`)
- Build (`npm run build`)

Vercel deployments are triggered automatically when the repo is connected.
