import type { SlideProps } from "./types"

const DEFAULT_ICONS = ["mail", "language", "alternate_email", "share"]

/** Parse bullet: "icon | Label | Value" or "Label | Value" */
const parseContact = (bullet: string) => {
  const parts = bullet.split("|").map((s) => s.trim())
  if (parts.length >= 3)
    return { icon: parts[0], label: parts[1], value: parts[2] }
  if (parts.length >= 2) return { icon: "link", label: parts[0], value: parts[1] }
  return { icon: "link", label: "Contact", value: bullet }
}

export const ThankYouSlide = ({ slide }: SlideProps) => {
  const contacts = slide.bullets.map(parseContact)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 origin-top-right -skew-x-12 bg-primary/5" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 lg:px-20">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-4xl">
              check_circle
            </span>
          </div>
          <h1 className="mb-4 text-6xl font-bold tracking-tight text-slate-900">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mx-auto max-w-2xl text-xl font-medium text-slate-600">
              {slide.subtitle}
            </p>
          )}
        </div>

        <div className="mb-12 grid w-full max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-6"
            >
              <span
                className="material-symbols-outlined mb-3 text-primary"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
              >
                {c.icon || DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
              </span>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                {c.label}
              </p>
              <p className="w-full truncate text-center font-semibold text-slate-900">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Have any questions? Let&apos;s connect.
        </h2>
      </div>
    </div>
  )
}
