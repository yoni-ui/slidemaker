import type { SlideProps } from "./types"

export const TwoColumnSlide = ({ slide }: SlideProps) => {
  const mid = Math.ceil(slide.bullets.length / 2)
  const left = slide.bullets.slice(0, mid)
  const right = slide.bullets.slice(mid)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Title */}
      <div className="flex-shrink-0 border-b border-primary/20 bg-slate-50 px-12 py-7">
        <div className="mb-2 h-0.5 w-10 rounded-full bg-primary" />
        <h1 className="text-[38px] font-bold leading-tight tracking-tight text-slate-900">
          {slide.title}
        </h1>
      </div>

      {/* Two columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column */}
        <div className="flex flex-1 flex-col justify-center gap-3 border-r border-primary/15 px-10 py-6">
          {left.map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <p className="text-[18px] leading-snug text-slate-800">{bullet}</p>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col justify-center gap-3 px-10 py-6">
          {right.map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
              <p className="text-[18px] leading-snug text-slate-600">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
