import type { SlideProps } from "./types"

export const HeroSlide = ({ slide }: SlideProps) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-canvas px-20 text-center">
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
      <h1 className="max-w-[820px] text-[64px] font-black leading-[1.1] tracking-tight text-slate-100">
        {slide.title}
      </h1>

      {/* Accent line */}
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Subtitle */}
      {slide.subtitle && (
        <p className="max-w-xl text-2xl font-light leading-relaxed text-slate-400">
          {slide.subtitle}
        </p>
      )}
    </div>

    {/* Bottom decoration */}
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  </div>
)
