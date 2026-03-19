import { pollinationsUrl } from "@/lib/pollinations"
import type { SlideProps } from "./types"

/** Image-text layout with Pollinations imagePrompt support (Stitch upgrade) */
export const ImageTextSlide = ({ slide, editMode, onUpdate, onUpdateBullet }: SlideProps) => {
  const imageSrc = slide.imagePrompt
    ? pollinationsUrl(slide.imagePrompt, 432, 540)
    : null

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Left: Image or placeholder */}
      <div className="relative flex w-1/2 flex-shrink-0 flex-col overflow-hidden bg-slate-200">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(#FF0000 1px, transparent 1px), linear-gradient(90deg, #FF0000 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5" />
            <div className="relative z-10 flex flex-col items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: 40 }}
                >
                  image
                </span>
              </div>
              <span className="text-sm font-medium text-slate-600">
                Add image prompt in editor
              </span>
            </div>
          </>
        )}
      </div>

      {/* Right: Text */}
      <div className="flex flex-1 flex-col justify-center gap-6 p-12 lg:p-16">
        <div className="space-y-2">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Section 01 — Strategy
          </span>
          {editMode && onUpdate ? (
            <h1
              contentEditable
              suppressContentEditableWarning
              className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 outline-none focus:ring-0 lg:text-5xl"
              onBlur={(e) => onUpdate({ title: e.currentTarget.textContent ?? "" })}
            >
              {slide.title}
            </h1>
          ) : (
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-5xl">
              {slide.title}
            </h1>
          )}
        </div>
        <div className="space-y-4">
          {editMode && onUpdate ? (
            <p
              contentEditable
              suppressContentEditableWarning
              className="text-lg leading-relaxed text-slate-600 outline-none focus:ring-0"
              onBlur={(e) => onUpdate({ subtitle: e.currentTarget.textContent?.trim() || null })}
            >
              {slide.subtitle ?? ""}
            </p>
          ) : (
            slide.subtitle && (
              <p className="text-lg leading-relaxed text-slate-600">
                {slide.subtitle}
              </p>
            )
          )}
          <ul className="space-y-3">
            {slide.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary">
                  check_circle
                </span>
                {editMode && onUpdateBullet ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    className="outline-none focus:ring-0"
                    onBlur={(e) => onUpdateBullet(i, e.currentTarget.textContent ?? "")}
                  >
                    {bullet}
                  </span>
                ) : (
                  <span>{bullet}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
