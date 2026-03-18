import type { SlideProps } from "./types"

/** Parse bullets: ["Name | Title", "Date | Location"] */
const parseFooter = (bullets: string[]) => {
  const [presenter, dateLoc] = bullets
  const [name, title] = (presenter ?? "").split("|").map((s) => s.trim())
  const [date, location] = (dateLoc ?? "").split("|").map((s) => s.trim())
  return { name, title, date, location }
}

export const TitleCardSlide = ({ slide }: SlideProps) => {
  const { name, title, date, location } = parseFooter(slide.bullets)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-full w-2/3 bg-gradient-to-bl from-primary to-transparent" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-12 py-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary p-2 text-white">
            <span className="material-symbols-outlined text-2xl">merge</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            DeckShare
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium uppercase tracking-widest text-slate-500">
            {slide.subtitle ?? "Presentation"}
          </span>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-sm font-medium text-slate-500">
            Confidential
          </span>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-center px-12 pb-16">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            {slide.subtitle ?? "Annual Executive Presentation"}
          </div>
          <h1 className="mb-8 text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 lg:text-7xl">
            {slide.title}
          </h1>
          <div className="mb-8 h-1.5 w-24 rounded-full bg-primary" />
        </div>
      </main>

      <footer className="relative z-10 flex items-end justify-between border-t border-slate-200 px-12 py-10">
        <div className="flex flex-col gap-1">
          {name && (
            <p className="text-lg font-semibold text-slate-900">{name}</p>
          )}
          {title && (
            <p className="text-sm font-normal text-slate-500">{title}</p>
          )}
        </div>
        <div className="flex items-center gap-8">
          {date && (
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                Date
              </p>
              <p className="text-sm font-medium text-slate-600">{date}</p>
            </div>
          )}
          {location && (
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-tighter text-slate-400">
                Location
              </p>
              <p className="text-sm font-medium text-slate-600">{location}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}
