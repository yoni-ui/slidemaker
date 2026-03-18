import type { SlideProps } from "./types"

/** Parse bullet: "Label | Value" or "Label | Value | +12.5%" (trend) */
const parseStat = (bullet: string) => {
  const parts = bullet.split("|").map((s) => s.trim())
  const label = parts[0] || ""
  const value = parts[1] || ""
  const trend = parts[2] || ""
  const positive = trend.startsWith("+") || !trend.startsWith("-")
  return { label, value, trend, positive }
}

export const DataChartSlide = ({ slide }: SlideProps) => {
  const stats = slide.bullets.slice(0, 4).map(parseStat)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-10 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2 text-primary">
            <span className="material-symbols-outlined text-3xl">analytics</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
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

      <main className="flex flex-1 flex-col overflow-hidden px-10 py-8">
        <div className="mb-8 grid grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                {s.label}
              </p>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              {s.trend && (
                <div
                  className={`mt-1 flex items-center gap-1 text-sm font-bold ${
                    s.positive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {s.positive ? "trending_up" : "trending_down"}
                  </span>
                  <span>{s.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8">
          <div className="grid h-full grid-cols-6 items-end gap-8 px-6">
            {[65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-primary transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs font-medium text-slate-500">
                  Q{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
