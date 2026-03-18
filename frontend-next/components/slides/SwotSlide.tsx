import type { SlideProps } from "./types"

type Quadrant = "S" | "W" | "O" | "T"

const QUAD_CONFIG: Record<
  Quadrant,
  {
    label: string
    title: string
    icon: string
    labelCls: string
    titleCls: string
    boxCls: string
    iconCls: string
    bulletCls: string
    bulletIcon: string
  }
> = {
  S: {
    label: "Internal / Helpful",
    title: "Strengths",
    icon: "star",
    labelCls: "text-emerald-600",
    titleCls: "text-emerald-800",
    boxCls: "bg-emerald-50 border-emerald-200",
    iconCls: "text-emerald-500",
    bulletCls: "text-emerald-500",
    bulletIcon: "check_circle",
  },
  W: {
    label: "Internal / Harmful",
    title: "Weaknesses",
    icon: "gpp_maybe",
    labelCls: "text-rose-600",
    titleCls: "text-rose-800",
    boxCls: "bg-rose-50 border-rose-200",
    iconCls: "text-rose-500",
    bulletCls: "text-rose-500",
    bulletIcon: "cancel",
  },
  O: {
    label: "External / Helpful",
    title: "Opportunities",
    icon: "lightbulb",
    labelCls: "text-blue-600",
    titleCls: "text-blue-800",
    boxCls: "bg-blue-50 border-blue-200",
    iconCls: "text-blue-500",
    bulletCls: "text-blue-500",
    bulletIcon: "check_circle",
  },
  T: {
    label: "External / Harmful",
    title: "Threats",
    icon: "warning",
    labelCls: "text-amber-600",
    titleCls: "text-amber-800",
    boxCls: "bg-amber-50 border-amber-200",
    iconCls: "text-amber-500",
    bulletCls: "text-amber-500",
    bulletIcon: "priority_high",
  },
}

/** Parse bullets: "S: item", "W: item", "O: item", "T: item" */
const parseSwot = (bullets: string[]) => {
  const quad: Record<Quadrant, string[]> = {
    S: [],
    W: [],
    O: [],
    T: [],
  }
  for (const b of bullets) {
    const match = b.match(/^([SWOT]):\s*(.+)$/i)
    if (match) {
      const q = match[1].toUpperCase() as Quadrant
      if (quad[q]) quad[q].push(match[2].trim())
    }
  }
  return quad
}

export const SwotSlide = ({ slide }: SlideProps) => {
  const quad = parseSwot(slide.bullets)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-10 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">
              tactic
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-sm font-medium text-slate-500">
                {slide.subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-2 grid-rows-2 gap-6 p-8">
        {(["S", "W", "O", "T"] as Quadrant[]).map((q) => {
          const cfg = QUAD_CONFIG[q]
          const items = quad[q]
          return (
            <div
              key={q}
              className={`group relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${cfg.boxCls}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span
                    className={`text-xs font-black uppercase tracking-widest ${cfg.labelCls}`}
                  >
                    {cfg.label}
                  </span>
                  <h2 className={`mt-1 text-2xl font-bold ${cfg.titleCls}`}>
                    {cfg.title}
                  </h2>
                </div>
                <span
                  className={`material-symbols-outlined text-4xl opacity-50 transition-transform group-hover:scale-110 ${cfg.iconCls}`}
                >
                  {cfg.icon}
                </span>
              </div>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span
                      className={`material-symbols-outlined mt-1 text-sm ${cfg.bulletCls}`}
                    >
                      {cfg.bulletIcon}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </main>
    </div>
  )
}
