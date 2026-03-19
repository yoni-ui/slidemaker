"use client"

import { useCallback, useState, useEffect } from "react"
import type { SlideProps, SlideElement } from "./types"
import { SLIDE_W, SLIDE_H, GRID_CELL } from "@/lib/design-system"

const snap = (v: number) => Math.round(v / GRID_CELL) * GRID_CELL

export const FreeformSlide = ({
  slide,
  editMode,
  onUpdate,
}: SlideProps) => {
  const elements = slide.elements ?? []
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, el: SlideElement) => {
      if (!editMode || !onUpdate) return
      e.preventDefault()
      setDragging(el.id)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elX: el.x,
        elY: el.y,
      })
    },
    [editMode, onUpdate]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !onUpdate) return
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      const newX = Math.max(0, Math.min(SLIDE_W - 100, snap(dragStart.elX + dx)))
      const newY = Math.max(0, Math.min(SLIDE_H - 40, snap(dragStart.elY + dy)))
      const updated = (slide.elements ?? []).map((el) =>
        el.id === dragging ? { ...el, x: newX, y: newY } : el
      )
      onUpdate({ elements: updated })
    },
    [dragging, dragStart, onUpdate, slide.elements]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const handleContentChange = useCallback(
    (id: string, content: string) => {
      if (!onUpdate) return
      const updated = (slide.elements ?? []).map((el) =>
        el.id === id ? { ...el, content } : el
      )
      onUpdate({ elements: updated })
    },
    [onUpdate, slide.elements]
  )

  const handleAddElement = useCallback(() => {
    if (!onUpdate) return
    const newEl: SlideElement = {
      id: `el_${Date.now()}`,
      type: "text",
      x: snap(48),
      y: snap(48),
      w: 200,
      h: 40,
      content: "Text box",
    }
    onUpdate({
      elements: [...(slide.elements ?? []), newEl],
    })
  }, [onUpdate, slide.elements])

  const handleRemoveElement = useCallback(
    (id: string) => {
      if (!onUpdate) return
      onUpdate({
        elements: (slide.elements ?? []).filter((el) => el.id !== id),
      })
    },
    [onUpdate, slide.elements]
  )

  useEffect(() => {
    if (!dragging) return
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute ${editMode ? "cursor-move" : ""} ${dragging === el.id ? "z-20 ring-2 ring-primary" : ""}`}
          style={{
            left: el.x,
            top: el.y,
            width: el.w,
            minHeight: el.h,
          }}
          onMouseDown={(e) => handleMouseDown(e, el)}
        >
          {editMode ? (
            <div className="group relative">
              <div
                contentEditable
                suppressContentEditableWarning
                className="min-h-[24px] rounded border border-transparent bg-white px-2 py-1 text-slate-900 outline-none transition-colors hover:border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/30"
                style={{ fontSize: el.fontSize ?? 18 }}
                onBlur={(e) =>
                  handleContentChange(el.id, e.currentTarget.textContent ?? "")
                }
              >
                {el.content}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveElement(el.id)}
                className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600 group-hover:block"
                aria-label="Remove element"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  close
                </span>
              </button>
            </div>
          ) : (
            <div
              style={{ fontSize: el.fontSize ?? 18 }}
              className="text-slate-900"
            >
              {el.content}
            </div>
          )}
        </div>
      ))}
      {editMode && (
        <button
          type="button"
          onClick={handleAddElement}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <span className="material-symbols-outlined">add</span>
          Add text box
        </button>
      )}
    </div>
  )
}
