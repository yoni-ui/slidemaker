import type { SlideProps } from "./types"

/** Parse bullet: "01 | Topic Name | Description" */
const parseItem = (bullet: string) => {
  const parts = bullet.split("|").map((s) => s.trim())
  return {
    num: parts[0] ?? "01",
    title: parts[1] ?? bullet,
    desc: parts[2] ?? "",
  }
}

export const AgendaSlide = ({ slide }: SlideProps) => {
  const items = slide.bullets.map(parseItem)

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-10 py-6">
        <div className="flex items-center gap-4">
          <span className="text-primary">
            <span className="material-symbols-outlined text-3xl">category</span>
          </span>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900">
            {slide.title}
          </h2>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-20 py-12">
        <div className="mb-12">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Table of Contents
          </div>
          <h1 className="text-6xl font-black leading-tight tracking-tighter text-slate-900">
            Agenda
          </h1>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-primary" />
        </div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="group flex items-start gap-6 rounded-xl p-4 transition-all hover:bg-slate-50"
            >
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${
                  i === 0 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-primary/10 text-primary"
                }`}
              >
                <span className="text-2xl font-bold">{item.num}</span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xl font-bold leading-normal text-slate-900">
                  {item.title}
                </p>
                {item.desc && (
                  <p className="text-base font-normal text-slate-500">
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="flex h-4 w-full bg-slate-50">
        <div className="h-full w-1/3 bg-primary/20" />
        <div className="h-full w-1/3 bg-primary/40" />
        <div className="h-full w-1/3 bg-primary" />
      </footer>
    </div>
  )
}
