import type { SlideProps } from "./types"

const PHASE_ICONS = ["search", "lightbulb", "code", "rocket_launch", "verified"]

/** Parse bullet: "Q1 2024 | Phase | Description" */
const parsePhase = (bullet: string) => {
  const [period = "Phase", title = "Step", desc = ""] = bullet
    .split("|")
    .map((s) => s.trim())
  return { period, title, desc }
}

export const TimelineSlide = ({ slide }: SlideProps) => {
  const phases = slide.bullets.map(parsePhase)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between px-10 py-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-3xl">route</span>
            <h2 className="text-sm font-bold uppercase tracking-widest">
              Project Framework
            </h2>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-lg text-slate-500">{slide.subtitle}</p>
          )}
        </div>
      </header>

      <main className="relative flex flex-1 flex-col justify-center px-10 pb-12">
        <div className="absolute top-1/2 left-10 right-10 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, (phases.length / 5) * 100)}%` }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-5 gap-4">
          {phases.map((p, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-3xl">
                    {PHASE_ICONS[i % PHASE_ICONS.length]}
                  </span>
                </div>
                <span className="mb-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                  {p.period}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
              </div>
              <div className="mb-8 size-4 rounded-full border-4 border-white bg-primary" />
              {p.desc && (
                <p className="px-2 text-sm leading-relaxed text-slate-500">
                  {p.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
