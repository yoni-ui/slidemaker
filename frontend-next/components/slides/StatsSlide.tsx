import type { SlideProps } from "./types"

type Stat = { value: string; label: string }

const parseStat = (bullet: string): Stat => {
  const [value = bullet, label = ""] = bullet.split("|").map((s) => s.trim())
  return { value, label }
}

export const StatsSlide = ({ slide, editMode, onUpdate, onUpdateBullet }: SlideProps) => {
  const stats: Stat[] = slide.bullets.map(parseStat)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-primary/20 bg-background-dark px-12 py-7">
        <div className="mb-2 h-0.5 w-10 rounded-full bg-primary" />
        {editMode && onUpdate ? (
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-[38px] font-bold leading-tight tracking-tight text-slate-900 outline-none focus:ring-0"
            onBlur={(e) => onUpdate({ title: e.currentTarget.textContent ?? "" })}
          >
            {slide.title}
          </h1>
        ) : (
          <h1 className="text-[38px] font-bold leading-tight tracking-tight text-slate-900">
            {slide.title}
          </h1>
        )}
      </div>

      {/* Stats grid */}
      <div className="flex flex-1 items-center justify-around gap-4 px-12 py-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-primary/15 bg-slate-50 px-6 py-8"
          >
            {editMode && onUpdateBullet ? (
              <span
                contentEditable
                suppressContentEditableWarning
                className="font-black leading-none text-primary outline-none focus:ring-0"
                style={{ fontSize: 64 }}
                onBlur={(e) => {
                  const v = e.currentTarget.textContent ?? ""
                  onUpdateBullet(i, `${v} | ${stat.label}`.trim())
                }}
              >
                {stat.value}
              </span>
            ) : (
              <span
                className="font-black leading-none text-primary"
                style={{ fontSize: 64 }}
              >
                {stat.value}
              </span>
            )}
            {editMode && onUpdateBullet ? (
              <span
                contentEditable
                suppressContentEditableWarning
                className="text-center text-sm font-medium uppercase tracking-wider text-slate-500 outline-none focus:ring-0"
                onBlur={(e) => onUpdateBullet(i, `${stat.value} | ${e.currentTarget.textContent ?? ""}`.trim())}
              >
                {stat.label}
              </span>
            ) : (
              stat.label && (
                <span className="text-center text-sm font-medium uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
