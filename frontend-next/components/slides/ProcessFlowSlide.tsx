import type { SlideProps } from "./types"

const ICONS = ["search", "strategy", "terminal", "verified_user", "rocket_launch"]

/** Parse bullet: "Step title | Description" */
const parseStep = (bullet: string) => {
  const [title = bullet, desc = ""] = bullet.split("|").map((s) => s.trim())
  return { title, desc }
}

export const ProcessFlowSlide = ({ slide, editMode, onUpdate, onUpdateBullet }: SlideProps) => {
  const steps = slide.bullets.map(parseStep)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-10 py-6">
        <div className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-3xl font-bold">
            account_tree
          </span>
          {editMode && onUpdate ? (
            <h2
              contentEditable
              suppressContentEditableWarning
              className="text-xl font-extrabold tracking-tight text-slate-900 outline-none focus:ring-0"
              onBlur={(e) => onUpdate({ title: e.currentTarget.textContent ?? "" })}
            >
              {slide.title}
            </h2>
          ) : (
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              {slide.title}
            </h2>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center px-10 py-8">
        {editMode && onUpdate ? (
          <p
            contentEditable
            suppressContentEditableWarning
            className="mb-12 max-w-2xl text-lg text-slate-500 outline-none focus:ring-0"
            onBlur={(e) => onUpdate({ subtitle: e.currentTarget.textContent?.trim() || null })}
          >
            {slide.subtitle ?? ""}
          </p>
        ) : (
          slide.subtitle && (
            <p className="mb-12 max-w-2xl text-lg text-slate-500">
              {slide.subtitle}
            </p>
          )
        )}

        <div className="relative flex items-start justify-between gap-4">
          <div className="absolute left-0 top-10 z-0 hidden h-0.5 w-full bg-slate-200 lg:block" />

          {steps.map((step, i) => (
            <div key={i} className="group z-10 flex flex-1 flex-col items-center text-center">
              <div
                className={`mb-6 flex size-20 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                  i === 0
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "border-2 border-primary/20 bg-white text-primary"
                }`}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                >
                  {ICONS[i % ICONS.length]}
                </span>
              </div>
              <div className="space-y-2 px-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    i === 0 ? "text-primary" : "text-slate-400"
                  }`}
                >
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                {editMode && onUpdateBullet ? (
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    className="text-lg font-bold text-slate-900 outline-none focus:ring-0"
                    onBlur={(e) => {
                      const title = e.currentTarget.textContent ?? ""
                      onUpdateBullet(i, `${title} | ${step.desc}`.trim())
                    }}
                  >
                    {step.title}
                  </h3>
                ) : (
                  <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                )}
                {editMode && onUpdateBullet ? (
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    className="text-sm leading-relaxed text-slate-500 outline-none focus:ring-0"
                    onBlur={(e) => onUpdateBullet(i, `${step.title} | ${e.currentTarget.textContent ?? ""}`.trim())}
                  >
                    {step.desc}
                  </p>
                ) : (
                  step.desc && (
                    <p className="text-sm leading-relaxed text-slate-500">
                      {step.desc}
                    </p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
