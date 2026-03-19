import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import {
  getStitchTemplateById,
  stitchToEditableSlide,
} from "@/lib/stitch-mapping"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const template = getStitchTemplateById(id)
  if (!template) {
    return NextResponse.json({ detail: "Template not found" }, { status: 404 })
  }

  const format = req.nextUrl.searchParams.get("format")
  const stitchPath = join(process.cwd(), "..", "stitch", template.path, "code.html")

  try {
    const html = await readFile(stitchPath, "utf-8")
    if (format === "slide") {
      const slide = stitchToEditableSlide(template)
      return NextResponse.json({ html, slide })
    }
    return NextResponse.json({ html })
  } catch (e) {
    console.error("Failed to read stitch template:", e)
    return NextResponse.json(
      { detail: "Template file not found" },
      { status: 404 }
    )
  }
}
