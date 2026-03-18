import type { SlideProps } from "./types"

type Stat = { value: string; label: string }

const parseStat = (bullet: string): Stat => {
  const [value = bullet, label = ""] = bullet.split("|").map((s) => s.trim())
  return { value, label }
}

export const StatsSlide = ({ slide }: SlideProps) => {
  const stats: Stat[] = slide.bullets.map(parseStat)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-primary/20 bg-background-dark px-12 py-7">
        <div className="mb-2 h-0.5 w-10 rounded-full bg-primary" />
        <h1 className="text-[38px] font-bold leading-tight tracking-tight text-slate-900">
          {slide.title}
        </h1>
      </div>

      {/* Stats grid */}
      <div className="flex flex-1 items-center justify-around gap-4 px-12 py-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-primary/15 bg-slate-50 px-6 py-8"
          >
            <span
              className="font-black leading-none text-primary"
              style={{ fontSize: 64 }}
            >
              {stat.value}
            </span>
            {stat.label && (
              <span className="text-center text-sm font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
