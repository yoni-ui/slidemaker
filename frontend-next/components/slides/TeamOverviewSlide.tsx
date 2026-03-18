import { pollinationsUrl } from "@/lib/pollinations"
import type { SlideProps } from "./types"

/** Parse bullet: "Name | Position | Quote" */
const parseMember = (bullet: string) => {
  const [name = "Name", position = "Role", quote = ""] = bullet
    .split("|")
    .map((s) => s.trim())
  return { name, position, quote }
}

export const TeamOverviewSlide = ({ slide }: SlideProps) => {
  const members = slide.bullets.map(parseMember)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-12 py-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-2">
            <span className="material-symbols-outlined text-3xl text-primary">
              groups
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900">
              {slide.subtitle || "Core Leadership"}
            </h2>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center px-12 py-12">
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Core Leadership
          </div>
          <h1 className="text-6xl font-black tracking-tight text-slate-900">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="max-w-2xl text-xl font-light text-slate-500">
              {slide.subtitle}
            </p>
          )}
        </div>

        <div className="grid max-w-[1200px] grid-cols-4 gap-10">
          {members.map((m, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary to-blue-400 opacity-20 blur transition-opacity duration-500 group-hover:opacity-40" />
                <div className="relative flex size-48 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl">
                  <img
                    src={pollinationsUrl(
                      `professional headshot portrait ${m.name} business attire`,
                      192,
                      192
                    )}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {m.position}
                </p>
                {m.quote && (
                  <p className="mt-2 text-sm font-medium italic text-slate-500">
                    &quot;{m.quote}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
