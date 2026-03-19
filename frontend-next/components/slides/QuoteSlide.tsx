import type { SlideProps } from "./types"

/** Full-bleed primary bg, oversized quote marks, white text (Stitch upgrade) */
export const QuoteSlide = ({ slide, editMode, onUpdate }: SlideProps) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-primary px-12 py-16 text-center lg:px-24">
    <div
      className="pointer-events-none absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    />

    <div className="absolute top-12 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/40" />

    <div className="relative z-10 flex flex-col items-center gap-8">
      <span className="material-symbols-outlined text-6xl text-white/40 lg:text-8xl">
        format_quote
      </span>
      {editMode && onUpdate ? (
        <h1
          contentEditable
          suppressContentEditableWarning
          className="max-w-5xl text-4xl font-extrabold italic leading-[1.1] tracking-tight text-white outline-none focus:ring-0 md:text-5xl lg:text-7xl"
          onBlur={(e) => onUpdate({ title: e.currentTarget.textContent ?? "" })}
        >
          {slide.title}
        </h1>
      ) : (
        <h1 className="max-w-5xl text-4xl font-extrabold italic leading-[1.1] tracking-tight text-white md:text-5xl lg:text-7xl">
          {slide.title}
        </h1>
      )}
      <div className="flex flex-col items-center gap-2">
        <div className="mb-4 h-px w-24 bg-white/60" />
        {editMode && onUpdate ? (
          <h2
            contentEditable
            suppressContentEditableWarning
            className="text-xl font-semibold tracking-wide text-white/90 outline-none focus:ring-0 md:text-2xl"
            onBlur={(e) => onUpdate({ subtitle: e.currentTarget.textContent?.trim() || null })}
          >
            — {slide.subtitle ?? ""}
          </h2>
        ) : (
          slide.subtitle && (
            <h2 className="text-xl font-semibold tracking-wide text-white/90 md:text-2xl">
              — {slide.subtitle}
            </h2>
          )
        )}
      </div>
    </div>
  </div>
)
