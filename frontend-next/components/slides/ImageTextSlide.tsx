import type { SlideProps } from "./types"

export const ImageTextSlide = ({ slide }: SlideProps) => (
  <div className="flex h-full w-full overflow-hidden bg-canvas">
    {/* Image placeholder — left half */}
    <div className="relative flex w-[45%] flex-shrink-0 flex-col items-center justify-center overflow-hidden bg-background-dark">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#ec5b13 1px, transparent 1px), linear-gradient(90deg, #ec5b13 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5" />
      {/* Icon */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: 40 }}
          >
            image
          </span>
        </div>
        <span className="text-sm font-medium text-slate-500">
          Visual Placeholder
        </span>
      </div>
      {/* Right edge fade */}
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-canvas" />
    </div>

    {/* Text — right half */}
    <div className="flex flex-1 flex-col justify-center gap-5 px-10 py-10">
      <div className="h-0.5 w-10 rounded-full bg-primary" />
      <h1 className="text-[38px] font-bold leading-tight tracking-tight text-slate-100">
        {slide.title}
      </h1>
      <div className="flex flex-col gap-3">
        {slide.bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            <p className="text-[18px] leading-snug text-slate-200">{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)
