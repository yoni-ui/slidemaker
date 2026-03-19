import type { SlideProps } from "./types"

export const BulletListSlide = ({
  slide,
  editMode,
  onUpdate,
  onUpdateBullet,
  onAddBullet,
  onRemoveBullet,
}: SlideProps) => (
  <div className="flex h-full w-full flex-col overflow-hidden bg-white">
    {/* Header region */}
    <div className="flex-shrink-0 border-b border-primary/20 bg-slate-50 px-12 py-8">
      <div className="mb-2 h-0.5 w-10 rounded-full bg-primary" />
      {editMode && onUpdate ? (
        <h1
          contentEditable
          suppressContentEditableWarning
          className="cursor-text rounded px-2 py-1 text-[42px] font-bold leading-tight tracking-tight text-slate-900 outline-none ring-0 hover:ring-2 hover:ring-primary/20 focus:ring-2 focus:ring-primary/30"
          onBlur={(e) =>
            onUpdate({ title: e.currentTarget.textContent ?? "" })
          }
        >
          {slide.title}
        </h1>
      ) : (
        <h1 className="text-[42px] font-bold leading-tight tracking-tight text-slate-900">
          {slide.title}
        </h1>
      )}
    </div>

    {/* Bullets region */}
    <div className="flex flex-1 flex-col justify-center gap-4 px-12 py-8">
      {slide.bullets.map((bullet, i) => (
        <div key={i} className="group flex items-start gap-4">
          <div className="mt-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          {editMode && onUpdateBullet ? (
            <div className="flex flex-1 items-center gap-2">
              <p
                contentEditable
                suppressContentEditableWarning
                className="min-h-[28px] flex-1 cursor-text rounded px-2 py-1 text-[22px] leading-snug text-slate-900 outline-none ring-0 hover:ring-2 hover:ring-primary/20 focus:ring-2 focus:ring-primary/30"
                onBlur={(e) =>
                  onUpdateBullet(i, e.currentTarget.textContent ?? "")
                }
              >
                {bullet}
              </p>
              {onRemoveBullet && (
                <button
                  type="button"
                  onClick={() => onRemoveBullet(i)}
                  className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  aria-label="Remove bullet"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    close
                  </span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-[22px] leading-snug text-slate-900">{bullet}</p>
          )}
        </div>
      ))}
      {editMode && onAddBullet && (
        <button
          type="button"
          onClick={onAddBullet}
          className="flex items-center gap-4 rounded-lg border-2 border-dashed border-slate-200 px-4 py-2 text-slate-500 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              add
            </span>
          </div>
          Add bullet
        </button>
      )}
    </div>

    {/* Slide number */}
    <div className="absolute bottom-4 right-6 text-xs font-medium text-slate-500">
      {slide.layout}
    </div>
  </div>
)
