import type { SlideProps } from "./types"

const CARD_ICONS = ["star", "verified", "thumb_up"]

/** Parse bullet: "Quote text | Name | Title" */
const parseTestimonial = (bullet: string) => {
  const parts = bullet.split("|").map((s) => s.trim())
  const quote = parts[0] || ""
  const name = parts[1] || "Name"
  const title = parts[2] || "Title"
  return { quote, name, title }
}

export const TestimonialsSlide = ({ slide }: SlideProps) => {
  const testimonials = slide.bullets.map(parseTestimonial)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex w-full items-end justify-between px-12 pb-6 pt-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">
              format_quote
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Success Stories
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            {slide.title}
          </h1>
        </div>
        {slide.subtitle && (
          <div className="flex items-center gap-4 border-l-4 border-primary pl-6">
            <p className="max-w-[300px] text-sm leading-relaxed text-slate-500">
              {slide.subtitle}
            </p>
          </div>
        )}
      </header>

      <main className="flex-1 grid grid-cols-3 gap-8 items-stretch px-12 py-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`relative flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-8 ${
              i === 1 ? "z-10 scale-105 shadow-xl ring-2 ring-primary/10" : ""
            }`}
          >
            <div className="absolute -top-4 left-8 flex items-center justify-center rounded-lg bg-primary p-2 text-white shadow-lg">
              <span className="material-symbols-outlined text-2xl">
                {CARD_ICONS[i % CARD_ICONS.length]}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="mb-8 text-xl font-medium italic leading-relaxed text-slate-700">
                &quot;{t.quote}&quot;
              </p>
            </div>
            <div className="flex items-center gap-4 border-t border-slate-200 pt-6">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-slate-200">
                <span className="material-symbols-outlined text-slate-500">
                  person
                </span>
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="truncate font-bold text-slate-900">{t.name}</p>
                <p className="truncate text-xs uppercase tracking-tighter text-slate-500">
                  {t.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
