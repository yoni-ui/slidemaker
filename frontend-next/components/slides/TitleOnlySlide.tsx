import type { SlideProps } from "./types"

export const TitleOnlySlide = ({ slide }: SlideProps) => (
  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-canvas text-center">
    {/* Decorative ring */}
    <div className="pointer-events-none absolute h-[420px] w-[420px] rounded-full border border-primary/10" />
    <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full border border-primary/15" />

    {/* Glow */}
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="h-64 w-64 rounded-full bg-primary/8 blur-[60px]" />
    </div>

    {/* Section label */}
    <div className="absolute left-12 top-10 flex items-center gap-3">
      <div className="h-px w-8 bg-primary/50" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
        Section
      </span>
    </div>

    <div className="relative z-10 flex flex-col items-center gap-5 px-20">
      <h1 className="text-[58px] font-black leading-[1.1] tracking-tight text-slate-100">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-xl font-light text-slate-400">{slide.subtitle}</p>
      )}
    </div>

    {/* Bottom left decoration */}
    <div className="absolute bottom-10 right-12 text-[120px] font-black leading-none text-primary/5 select-none">
      §
    </div>
  </div>
)
