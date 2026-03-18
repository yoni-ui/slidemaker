import type { SlideProps } from "./types"

export const QuoteSlide = ({ slide }: SlideProps) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-canvas px-16 text-center">
    {/* Subtle gradient bg */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

    {/* Top accent */}
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

    {/* Opening quote mark */}
    <div
      className="pointer-events-none absolute left-10 top-8 select-none font-serif leading-none text-primary/20"
      style={{ fontSize: 160, lineHeight: 1 }}
    >
      &ldquo;
    </div>

    <div className="relative z-10 flex max-w-[760px] flex-col items-center gap-7">
      {/* Quote text */}
      <blockquote className="text-[32px] font-medium italic leading-[1.4] text-slate-100">
        {slide.title}
      </blockquote>

      {/* Divider */}
      <div className="h-px w-16 bg-primary/50" />

      {/* Attribution */}
      {slide.subtitle && (
        <cite className="not-italic text-base font-semibold uppercase tracking-widest text-primary">
          — {slide.subtitle}
        </cite>
      )}
    </div>

    {/* Closing quote mark */}
    <div
      className="pointer-events-none absolute bottom-4 right-10 select-none font-serif leading-none text-primary/10"
      style={{ fontSize: 120, lineHeight: 1 }}
    >
      &rdquo;
    </div>
  </div>
)
