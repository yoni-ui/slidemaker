/**
 * Run Next.js + FastAPI in one terminal (no concurrently / extra PowerShell windows).
 */
import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const fe = path.join(root, "frontend-next")
/** Run Next CLI with Node (avoids Windows spawn EINVAL on .cmd shims). */
const nextCli = path.join(fe, "node_modules", "next", "dist", "bin", "next")
const backendScript = path.join(root, "scripts", "run-backend.mjs")

if (!fs.existsSync(nextCli)) {
  console.error("Missing Next.js. Run: cd frontend-next && npm install")
  process.exit(1)
}

/** Stale lock after a crash blocks `next dev`; safe if no other dev server is running. */
const lockPath = path.join(fe, ".next", "dev", "lock")
if (fs.existsSync(lockPath)) {
  try {
    fs.unlinkSync(lockPath)
    console.warn(
      "\x1b[33m[web]\x1b[0m Removed stale .next/dev/lock. If two dev servers fight, stop the other one first.\n"
    )
  } catch {
    /* ignore */
  }
}

if (!fs.existsSync(backendScript)) {
  console.error("Missing scripts/run-backend.mjs")
  process.exit(1)
}

const children = []

function shutdown() {
  for (const c of children) {
    try {
      c.kill("SIGTERM")
    } catch {
      /* ignore */
    }
  }
  setTimeout(() => process.exit(0), 500).unref()
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

console.log("\n\x1b[36m[web]\x1b[0m Next.js  → http://localhost:3000 (or next free port)")
console.log("\x1b[35m[api]\x1b[0m FastAPI  → http://127.0.0.1:8001/docs\n")

const api = spawn(process.execPath, [backendScript], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  shell: false,
})
children.push(api)

/** --webpack avoids Turbopack cache corruption (missing .sst) on some Windows setups */
const web = spawn(process.execPath, [nextCli, "dev", "--webpack"], {
  cwd: fe,
  stdio: "inherit",
  env: process.env,
  shell: false,
})
children.push(web)

api.on("exit", (code, signal) => {
  if (signal !== "SIGTERM") {
    console.error(`\n\x1b[35m[api]\x1b[0m exited (${code ?? signal})`)
    shutdown()
  }
})

web.on("exit", (code, signal) => {
  if (signal !== "SIGTERM") {
    console.error(`\n\x1b[36m[web]\x1b[0m exited (${code ?? signal})`)
    shutdown()
  }
})
