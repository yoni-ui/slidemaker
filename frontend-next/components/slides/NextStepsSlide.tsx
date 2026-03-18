import type { SlideProps } from "./types"

/** Parse bullet: "✓ Action item" (done) or "○ Action item" (pending) */
const parseItem = (bullet: string) => {
  const done = bullet.startsWith("✓") || bullet.startsWith("✔")
  const text = bullet.replace(/^[✓✔○]\s*/, "").trim()
  return { done, text }
}

export const NextStepsSlide = ({ slide }: SlideProps) => {
  const items = slide.bullets.map(parseItem)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 -translate-x-1/2 skew-x-12 bg-primary/5" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-12 py-12 md:px-24">
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1 w-12 rounded-full bg-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Action Plan
            </span>
          </div>
          <h1 className="text-6xl font-black leading-tight tracking-tight text-slate-900 md:text-7xl">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mt-4 max-w-xl text-xl leading-relaxed text-slate-500">
              {slide.subtitle}
            </p>
          )}
        </div>

        <div className="max-w-2xl space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex shrink-0 items-center justify-center">
                <div
                  className={`flex size-7 items-center justify-center rounded-lg border-2 ${
                    item.done
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 bg-transparent"
                  }`}
                >
                  {item.done && (
                    <span className="material-symbols-outlined text-sm">
                      check
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
