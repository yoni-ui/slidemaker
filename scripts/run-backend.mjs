/**
 * Start FastAPI with the backend/.venv interpreter (works on Windows + Unix).
 */
import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const backendDir = path.join(root, "backend")
const winPy = path.join(backendDir, ".venv", "Scripts", "python.exe")
const unixPy = path.join(backendDir, ".venv", "bin", "python")
const python = fs.existsSync(winPy) ? winPy : unixPy

if (!fs.existsSync(python)) {
  console.error(
    "Missing backend/.venv. Run:\n  cd backend\n  python -m venv .venv\n  .venv\\Scripts\\pip install -r requirements.txt"
  )
  process.exit(1)
}

const child = spawn(
  python,
  [
    "-m",
    "uvicorn",
    "app.main:app",
    "--reload",
    "--reload-dir",
    "app",
    "--host",
    "127.0.0.1",
    "--port",
    "8001",
  ],
  { cwd: backendDir, stdio: "inherit", shell: false }
)

child.on("exit", (code) => process.exit(code ?? 0))
