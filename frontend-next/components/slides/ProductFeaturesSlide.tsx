import type { SlideProps } from "./types"

const FEATURE_ICONS = ["bolt", "shield_lock", "speed", "cloud_sync", "security", "sync"]

/** Parse bullet: "Feature | Description" */
const parseFeature = (bullet: string) => {
  const [name = bullet, desc = ""] = bullet.split("|").map((s) => s.trim())
  return { name, desc }
}

export const ProductFeaturesSlide = ({ slide }: SlideProps) => {
  const features = slide.bullets.map(parseFeature)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="absolute top-0 left-0 flex w-full items-center justify-between px-12 py-8">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-xl">layers</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {slide.subtitle || "Value Proposition"}
          </h2>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-12 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              {slide.subtitle}
            </p>
          )}
        </div>

        <div className="grid w-full max-w-7xl grid-cols-12 gap-8 items-center">
          <div className="col-span-12 order-2 flex flex-col gap-16 lg:col-span-3 lg:order-1">
            {features.slice(0, 2).map((f, i) => (
              <div key={i} className="relative group">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">
                      {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                </div>
                {f.desc && (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {f.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="col-span-12 order-1 flex items-center justify-center lg:col-span-6 lg:order-2">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 rounded-[3rem] bg-primary/5 blur-2xl" />
              <div className="relative flex items-center justify-center rounded-[2.5rem] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-slate-700">
                  <span className="material-symbols-outlined text-4xl text-slate-400">
                    smartphone
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 order-3 flex flex-col gap-16 lg:col-span-3">
            {features.slice(2, 4).map((f, i) => (
              <div key={i} className="relative group">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">
                      {FEATURE_ICONS[(i + 2) % FEATURE_ICONS.length]}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                </div>
                {f.desc && (
                  <p className="text-sm leading-relaxed text-slate-600">
                    {f.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
