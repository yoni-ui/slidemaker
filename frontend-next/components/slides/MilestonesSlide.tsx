import type { SlideProps } from "./types"

const MILESTONE_ICONS = [
  "rocket_launch",
  "palette",
  "science",
  "campaign",
  "celebration",
]

/** Parse bullet: "Date | Phase | Description" */
const parseMilestone = (bullet: string) => {
  const [date = "", title = "Phase", desc = ""] = bullet
    .split("|")
    .map((s) => s.trim())
  return { date, title, desc }
}

export const MilestonesSlide = ({ slide }: SlideProps) => {
  const milestones = slide.bullets.map(parseMilestone)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-1/3 opacity-5"
        style={{ background: "radial-gradient(circle, #1152d4 0%, transparent 70%)" }}
      />

      <header className="flex items-end justify-between px-16 pb-12 pt-16">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              Q3-Q4 Progress
            </span>
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mt-4 text-lg text-slate-500">{slide.subtitle}</p>
          )}
        </div>
      </header>

      <main className="flex flex-1 items-center px-16">
        <div className="relative w-full">
          <div className="absolute top-1/2 left-0 z-0 h-1 w-full -translate-y-1/2 bg-slate-100" />
          <div
            className="absolute top-1/2 left-0 z-0 h-1 -translate-y-1/2 bg-primary opacity-50"
            style={{ width: `${Math.min(100, (milestones.length / 5) * 100)}%` }}
          />
          <div className="relative z-10 grid grid-cols-5 gap-6">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="group flex flex-col items-center"
              >
                <div className="mb-10 text-center">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-500">
                    {m.date}
                  </span>
                  <h3 className="font-bold text-lg leading-tight text-slate-900">
                    {m.title}
                  </h3>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 ring-8 ring-white">
                  <span className="material-symbols-outlined text-2xl">
                    {MILESTONE_ICONS[i % MILESTONE_ICONS.length]}
                  </span>
                </div>
                <div className="mt-8 px-2 text-center opacity-0 transition-opacity group-hover:opacity-100">
                  {m.desc && (
                    <p className="text-xs text-slate-500">{m.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
