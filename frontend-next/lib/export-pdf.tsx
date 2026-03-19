"use client"

import { createRoot } from "react-dom/client"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { SlideRenderer } from "@/components/slides/SlideRenderer"
import type { EditableSlide } from "@/components/slides/types"

const SLIDE_W = 960
const SLIDE_H = 540

export async function exportPDF(
  deckTitle: string,
  slides: EditableSlide[]
): Promise<Blob> {
  if (slides.length === 0) throw new Error("No slides to export")

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [SLIDE_W, SLIDE_H],
  })

  const container = document.createElement("div")
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
    background: white;
    overflow: hidden;
  `
  document.body.appendChild(container)
  const root = createRoot(container)

  try {
    for (let i = 0; i < slides.length; i++) {
      root.render(<SlideRenderer slide={slides[i]} />)
      await new Promise((r) => requestAnimationFrame(r))
      await new Promise((r) => setTimeout(r, 150))

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })
      const imgData = canvas.toDataURL("image/jpeg", 0.92)
      if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], "landscape")
      pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_W, SLIDE_H)
    }

    return pdf.output("blob")
  } finally {
    root.unmount()
    document.body.removeChild(container)
  }
}
