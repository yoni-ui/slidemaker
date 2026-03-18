import type { SlideProps } from "./types"

/** bullets = "Region | Offices | Count" — positions are fixed for map pins */
const REGION_POSITIONS = [
  { top: "25%", left: "18%" },
  { top: "20%", left: "48%" },
  { top: "45%", left: "65%" },
  { top: "35%", left: "80%" },
  { top: "60%", left: "25%" },
]

/** Parse bullet: "Region | Offices | Count" */
const parseRegion = (bullet: string) => {
  const [region = "Region", offices = "0", count = ""] = bullet
    .split("|")
    .map((s) => s.trim())
  return { region, offices, count }
}

export const GlobalPresenceSlide = ({ slide }: SlideProps) => {
  const regions = slide.bullets.map(parseRegion)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="z-10 flex items-center justify-between bg-white px-12 py-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">
              public
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {slide.title}
            </h1>
          </div>
          {slide.subtitle && (
            <p className="ml-11 text-lg text-slate-500">{slide.subtitle}</p>
          )}
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden bg-slate-100">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "linear-gradient(rgba(248,250,252,0.95), rgba(248,250,252,0.95)), url(https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {regions.map((r, i) => {
          const pos = REGION_POSITIONS[i % REGION_POSITIONS.length]
          return (
            <div
              key={i}
              className="group absolute z-10"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="relative flex flex-col items-center">
                <div className="size-4 animate-pulse rounded-full bg-primary ring-4 ring-primary/30" />
                <div className="h-8 w-0.5 bg-primary/40" />
                <div className="min-w-[140px] rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {r.region}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {r.offices}
                  </h3>
                  {r.count && (
                    <p className="text-xs text-slate-500">{r.count}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
