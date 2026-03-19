import { NextRequest, NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"
import { PDFParse } from "pdf-parse"
import mammoth from "mammoth"
import { extractPptxSlides } from "pptx-content-extractor"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

type ImportResult = {
  text: string
  source: "pdf" | "txt" | "docx" | "pptx"
}

async function parsePDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  try {
    const result = await parser.getText()
    await parser.destroy()
    return result.text ?? ""
  } catch (e) {
    await parser.destroy()
    throw e
  }
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value ?? ""
}

async function parsePPTX(buffer: Buffer): Promise<string> {
  const tmpDir = tmpdir()
  const tmpPath = join(tmpDir, `import-${Date.now()}-${Math.random().toString(36).slice(2)}.pptx`)
  try {
    await writeFile(tmpPath, buffer)
    const slides = await extractPptxSlides(tmpPath)
    const parts: string[] = []
    slides.forEach((slide, i) => {
      const texts: string[] = []
      slide.content?.forEach((block) => {
        if (block.text?.length) {
          texts.push(block.text.join(" ").trim())
        }
      })
      const slideText = texts.filter(Boolean).join("\n")
      if (slideText) {
        parts.push(`Slide ${i + 1}:\n${slideText}`)
      }
    })
    return parts.join("\n\n")
  } finally {
    try {
      await unlink(tmpPath)
    } catch {
      // ignore cleanup errors
    }
  }
}

function parseTXT(buffer: Buffer): string {
  return buffer.toString("utf-8")
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json(
        { detail: "No file provided. Use form field 'file'." },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { detail: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
        { status: 400 }
      )
    }

    const contentType = file.type
    const name = (file.name || "").toLowerCase()

    let source: ImportResult["source"]
    let text: string

    if (
      contentType === "application/pdf" ||
      name.endsWith(".pdf")
    ) {
      source = "pdf"
      const buffer = Buffer.from(await file.arrayBuffer())
      text = await parsePDF(buffer)
    } else if (
      contentType === "text/plain" ||
      name.endsWith(".txt")
    ) {
      source = "txt"
      const buffer = Buffer.from(await file.arrayBuffer())
      text = parseTXT(buffer)
    } else if (
      contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx")
    ) {
      source = "docx"
      const buffer = Buffer.from(await file.arrayBuffer())
      text = await parseDOCX(buffer)
    } else if (
      contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      name.endsWith(".pptx")
    ) {
      source = "pptx"
      const buffer = Buffer.from(await file.arrayBuffer())
      text = await parsePPTX(buffer)
    } else {
      return NextResponse.json(
        {
          detail:
            "Unsupported file type. Supported: PDF (.pdf), Text (.txt), Word (.docx), PowerPoint (.pptx).",
        },
        { status: 400 }
      )
    }

    const trimmed = text.trim()
    if (!trimmed) {
      return NextResponse.json(
        { detail: "No text could be extracted from this file." },
        { status: 400 }
      )
    }

    return NextResponse.json({ text: trimmed, source } satisfies ImportResult)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { detail: `Import failed: ${msg}` },
      { status: 500 }
    )
  }
}
