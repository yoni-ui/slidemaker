import type { SlideProps } from "./types"

/** 4×3 grid of logo placeholders — bullets can be brand initials, we show first 12 */
const LOGO_PLACEHOLDERS = Array.from({ length: 12 }, (_, i) =>
  String.fromCharCode(65 + (i % 26))
)

export const PartnerLogosSlide = ({ slide }: SlideProps) => {
  const logos = slide.bullets.length > 0
    ? slide.bullets.slice(0, 12).map((b) => b.slice(0, 2).toUpperCase() || "XX")
    : LOGO_PLACEHOLDERS

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="flex flex-col gap-2 px-16 pb-8 pt-16">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-xl">handshake</span>
          <span className="text-xs font-bold uppercase tracking-widest">
            Global Network
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="mt-2 max-w-2xl text-lg text-slate-500">
            {slide.subtitle}
          </p>
        )}
      </div>

      <main className="flex-1 px-16 pb-12">
        <div className="grid h-full grid-cols-4 grid-rows-3 gap-4">
          {logos.map((initials, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 transition-all hover:border-primary/30 hover:bg-white"
            >
              <span className="text-2xl font-bold text-slate-400">
                {initials}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 px-16 py-4">
        <p className="text-sm text-slate-500">50+ other global organizations</p>
      </footer>
    </div>
  )
}
