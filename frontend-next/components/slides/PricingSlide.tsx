import type { SlideProps } from "./types"

/** Parse bullet: "Plan | Price | Feature1, Feature2" */
const parsePlan = (bullet: string) => {
  const parts = bullet.split("|").map((s) => s.trim())
  const plan = parts[0] || "Plan"
  const price = parts[1] || "$0"
  const features = parts[2]
    ? parts[2].split(",").map((f) => f.trim())
    : []
  return { plan, price, features }
}

export const PricingSlide = ({ slide }: SlideProps) => {
  const plans = slide.bullets.map(parsePlan)
  const featuredIndex = Math.min(1, plans.length - 1)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="px-12 pb-8 pt-12">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
            Pricing Plans
          </h2>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="text-lg text-slate-500">{slide.subtitle}</p>
          )}
        </div>
      </header>

      <main className="flex-1 px-12 pb-12">
        <div className="grid h-full grid-cols-3 gap-6">
          {plans.map((p, i) => {
            const featured = i === featuredIndex
            return (
              <div
                key={i}
                className={`relative flex flex-col rounded-xl border p-8 ${
                  featured
                    ? "z-10 scale-105 border-2 border-primary bg-white shadow-xl"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                {featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{p.plan}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-black tracking-tighter ${
                        featured ? "text-primary" : "text-slate-900"
                      }`}
                    >
                      {p.price}
                    </span>
                    <span className="font-medium text-slate-500">/mo</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  {p.features.map((f, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <span className="material-symbols-outlined text-xl text-primary">
                        check_circle
                      </span>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className={`mt-8 w-full rounded-lg px-4 py-3 text-sm font-bold transition-colors ${
                    featured
                      ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                      : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  }`}
                >
                  {featured ? "Start 14-day Trial" : "Get Started"}
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
