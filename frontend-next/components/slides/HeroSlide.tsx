import type { SlideProps } from "./types"

export const HeroSlide = ({
  slide,
  editMode,
  onUpdate,
}: SlideProps) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white px-20 text-center">
    {/* Ambient glow */}
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-96 w-96 rounded-full bg-primary/10 blur-[80px]" />
    </div>

    {/* Top accent bar */}
    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

    <div className="relative z-10 flex flex-col items-center gap-6">
      {/* Badge */}
      <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Presentation
        </span>
      </div>

      {/* Title */}
      {editMode && onUpdate ? (
        <h1
          contentEditable
          suppressContentEditableWarning
          className="max-w-[820px] cursor-text rounded px-2 py-1 text-[64px] font-black leading-[1.1] tracking-tight text-slate-900 outline-none ring-0 hover:ring-2 hover:ring-primary/20 focus:ring-2 focus:ring-primary/30"
          onBlur={(e) =>
            onUpdate({ title: e.currentTarget.textContent ?? "" })
          }
        >
          {slide.title}
        </h1>
      ) : (
        <h1 className="max-w-[820px] text-[64px] font-black leading-[1.1] tracking-tight text-slate-900">
          {slide.title}
        </h1>
      )}

      {/* Accent line */}
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Subtitle */}
      {editMode && onUpdate ? (
        <p
          contentEditable
          suppressContentEditableWarning
          className="max-w-xl cursor-text rounded px-2 py-1 text-2xl font-light leading-relaxed text-slate-500 outline-none ring-0 hover:ring-2 hover:ring-primary/20 focus:ring-2 focus:ring-primary/30"
          onBlur={(e) =>
            onUpdate({
              subtitle: e.currentTarget.textContent?.trim() || null,
            })
          }
        >
          {slide.subtitle ?? ""}
        </p>
      ) : (
        slide.subtitle && (
          <p className="max-w-xl text-2xl font-light leading-relaxed text-slate-500">
            {slide.subtitle}
          </p>
        )
      )}
    </div>

    {/* Bottom decoration */}
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  </div>
)
