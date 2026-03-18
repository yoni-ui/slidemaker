import { pollinationsUrl } from "@/lib/pollinations"
import type { SlideProps } from "./types"

/** First 2 bullets = "Metric | Value" for stats overlay; rest = solution items */
const parseCaseStudy = (bullets: string[]) => {
  const stats = bullets.slice(0, 2).map((b) => {
    const [label = "", value = ""] = b.split("|").map((s) => s.trim())
    return { label, value }
  })
  const solutionItems = bullets.slice(2)
  return { stats, solutionItems }
}

export const CaseStudySlide = ({ slide }: SlideProps) => {
  const { stats, solutionItems } = parseCaseStudy(slide.bullets)
  const imageSrc = slide.imagePrompt
    ? pollinationsUrl(slide.imagePrompt, 540, 540)
    : null

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Left: Image */}
      <div className="relative flex w-1/2 flex-col p-10 pr-5">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-200">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-slate-400">
                image
              </span>
            </div>
          )}
          {stats.some((s) => s.label && s.value) && (
            <div className="absolute bottom-6 left-6 right-6 rounded-lg border-l-4 border-primary bg-white/90 p-6 shadow-lg backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4">
                {stats.filter((s) => s.label && s.value).map((s, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {s.label}
                    </p>
                    <p className="text-2xl font-black text-primary">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Text */}
      <div className="flex w-1/2 flex-col justify-center gap-8 p-10 pl-5">
        <div>
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Case Study
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900">
            {slide.title}
          </h1>
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              report_problem
            </span>
            <h3 className="text-lg font-bold text-slate-900">The Challenge</h3>
          </div>
          {slide.subtitle && (
            <p className="text-base leading-relaxed text-slate-600">
              {slide.subtitle}
            </p>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              lightbulb
            </span>
            <h3 className="text-lg font-bold text-slate-900">The Solution</h3>
          </div>
          <ul className="space-y-4">
            {solutionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5 text-lg text-primary">
                  check_circle
                </span>
                <span className="text-base text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
