import type { SlideProps } from "./types"

export const BulletListSlide = ({ slide }: SlideProps) => (
  <div className="flex h-full w-full flex-col overflow-hidden bg-canvas">
    {/* Header region */}
    <div className="flex-shrink-0 border-b border-primary/20 bg-background-dark px-12 py-8">
      <div className="mb-2 h-0.5 w-10 rounded-full bg-primary" />
      <h1 className="text-[42px] font-bold leading-tight tracking-tight text-slate-100">
        {slide.title}
      </h1>
    </div>

    {/* Bullets region */}
    <div className="flex flex-1 flex-col justify-center gap-4 px-12 py-8">
      {slide.bullets.map((bullet, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className="mt-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <p className="text-[22px] leading-snug text-slate-200">{bullet}</p>
        </div>
      ))}
    </div>

    {/* Slide number */}
    <div className="absolute bottom-4 right-6 text-xs font-medium text-slate-600">
      {slide.layout}
    </div>
  </div>
)
