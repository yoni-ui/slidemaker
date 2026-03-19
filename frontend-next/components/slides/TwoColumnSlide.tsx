import type { SlideProps } from "./types"

export const TwoColumnSlide = ({ slide, editMode, onUpdate, onUpdateBullet }: SlideProps) => {
  const mid = Math.ceil(slide.bullets.length / 2)
  const left = slide.bullets.slice(0, mid)
  const right = slide.bullets.slice(mid)
  const leftIndices = Array.from({ length: left.length }, (_, i) => i)
  const rightIndices = Array.from({ length: right.length }, (_, i) => mid + i)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Title */}
      <div className="flex-shrink-0 border-b border-primary/20 bg-slate-50 px-12 py-7">
        <div className="mb-2 h-0.5 w-10 rounded-full bg-primary" />
        {editMode && onUpdate ? (
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-[38px] font-bold leading-tight tracking-tight text-slate-900 outline-none focus:ring-0"
            onBlur={(e) => onUpdate({ title: e.currentTarget.textContent ?? "" })}
          >
            {slide.title}
          </h1>
        ) : (
          <h1 className="text-[38px] font-bold leading-tight tracking-tight text-slate-900">
            {slide.title}
          </h1>
        )}
      </div>

      {/* Two columns */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col justify-center gap-3 border-r border-primary/15 px-10 py-6">
          {left.map((bullet, idx) => {
            const i = leftIndices[idx]
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {editMode && onUpdateBullet ? (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    className="text-[18px] leading-snug text-slate-800 outline-none focus:ring-0"
                    onBlur={(e) => onUpdateBullet(i, e.currentTarget.textContent ?? "")}
                  >
                    {bullet}
                  </p>
                ) : (
                  <p className="text-[18px] leading-snug text-slate-800">{bullet}</p>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 px-10 py-6">
          {right.map((bullet, idx) => {
            const i = rightIndices[idx]
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                {editMode && onUpdateBullet ? (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    className="text-[18px] leading-snug text-slate-600 outline-none focus:ring-0"
                    onBlur={(e) => onUpdateBullet(i, e.currentTarget.textContent ?? "")}
                  >
                    {bullet}
                  </p>
                ) : (
                  <p className="text-[18px] leading-snug text-slate-600">{bullet}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
