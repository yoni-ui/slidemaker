# Launch Next.js (frontend) and FastAPI (backend) in separate windows.
$Root = $PSScriptRoot
$fe = Join-Path $Root "frontend-next"

Write-Host "Starting SlideMaker — two windows will open (web + API)." -ForegroundColor Cyan
Write-Host "  Web:  http://localhost:3000 (or next free port)" -ForegroundColor Gray
Write-Host "  API:  http://localhost:8001/docs" -ForegroundColor Gray

Start-Process pwsh -ArgumentList @(
  "-NoExit", "-NoProfile",
  "-Command",
  "Set-Location -LiteralPath '$fe'; Write-Host 'Next.js' -ForegroundColor Cyan; npm run dev"
)

Start-Process pwsh -ArgumentList @(
  "-NoExit", "-NoProfile",
  "-Command",
  "Set-Location -LiteralPath '$Root'; Write-Host 'FastAPI' -ForegroundColor Magenta; node .\scripts\run-backend.mjs"
)
