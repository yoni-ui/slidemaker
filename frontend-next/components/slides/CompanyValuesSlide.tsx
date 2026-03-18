import type { SlideProps } from "./types"

const VALUE_ICONS = [
  "lightbulb",
  "verified_user",
  "groups",
  "workspace_premium",
  "favorite",
  "bolt",
]

/** Parse bullet: "Value name | Description" */
const parseValue = (bullet: string) => {
  const [name = bullet, desc = ""] = bullet.split("|").map((s) => s.trim())
  return { name, desc }
}

export const CompanyValuesSlide = ({ slide }: SlideProps) => {
  const values = slide.bullets.map(parseValue)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="px-16 pb-8 pt-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary p-2 text-white">
            <span className="material-symbols-outlined text-2xl">
              corporate_fare
            </span>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
            Our Foundation
          </h3>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-slate-900">
          {slide.title}
        </h1>
        <div className="mt-6 h-1.5 w-24 rounded-full bg-primary" />
      </header>

      <main className="flex-1 px-16 pb-12">
        <div className="grid h-full grid-cols-3 gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-8 transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                <span
                  className="material-symbols-outlined text-5xl text-primary"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                >
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-extrabold text-slate-900">
                {value.name}
              </h2>
              {value.desc && (
                <p className="text-center text-sm leading-relaxed text-slate-500">
                  {value.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
