import { NextRequest, NextResponse } from "next/server"
import pptxgen from "pptxgenjs"

type ExportSlide = {
  title: string
  subtitle?: string | null
  bullets?: string[]
}

export async function POST(req: NextRequest) {
  let body: { deckTitle?: string; slides?: ExportSlide[] }
  try {
    body = (await req.json()) as { deckTitle?: string; slides?: ExportSlide[] }
  } catch {
    return NextResponse.json(
      { detail: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const slides = body.slides ?? []
  if (slides.length === 0) {
    return NextResponse.json(
      { detail: "No slides to export" },
      { status: 400 }
    )
  }

  const deckTitle = (body.deckTitle ?? "presentation").replace(/[^a-zA-Z0-9_-]/g, "_")

  try {
    const pres = new pptxgen()
    pres.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 })
    pres.layout = "CUSTOM"

    for (const s of slides) {
      const slide = pres.addSlide()
      slide.addText(s.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.6,
        fontSize: 28,
        bold: true,
      })

      const bullets = s.bullets ?? []
      const lines: string[] = s.subtitle ? [s.subtitle, ...bullets] : bullets

      if (lines.length > 0) {
        const bulletText = lines.join("\n")
        slide.addText(bulletText, {
          x: 0.5,
          y: 1.1,
          w: 9,
          h: 3.8,
          fontSize: 14,
          bullet: true,
        })
      }
    }

    const buffer = await pres.write({ outputType: "nodebuffer" })
    const filename = `${deckTitle}.pptx`

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (e) {
    console.error("Export error:", e)
    return NextResponse.json(
      { detail: e instanceof Error ? e.message : "Export failed" },
      { status: 500 }
    )
  }
}
