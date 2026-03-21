/**
 * Remove .next (fixes corrupt Turbopack cache / dev lock issues).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const fe = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const nextDir = path.join(fe, ".next")

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true })
  console.log("Removed frontend-next/.next")
} else {
  console.log("No .next folder to remove.")
}
