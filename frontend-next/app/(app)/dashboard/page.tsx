import Link from "next/link";

export default function DashboardPage() {
  const decks = [
    {
      title: "Quarterly Business Review",
      edited: "2 hours ago",
      id: "1",
    },
    {
      title: "Product Launch 2024",
      edited: "Yesterday",
      id: "2",
    },
    {
      title: "Team Onboarding",
      edited: "3 days ago",
      id: "3",
    },
    {
      title: "Investor Pitch",
      edited: "1 week ago",
      id: "4",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Recent Presentations
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Pick up where you left off
          </p>
        </div>
        <button
          type="button"
          className="group flex items-center gap-1 text-sm font-bold text-primary hover:underline"
        >
          View All{" "}
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
            chevron_right
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {decks.map((deck) => (
          <Link
            key={deck.id}
            href={`/editor?deck=${deck.id}`}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-2xl hover:shadow-primary/10 dark:border-white/5 dark:bg-card-dark"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-black/20">
              <div className="h-full w-full bg-gradient-to-br from-slate-700 to-slate-900 transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="translate-y-4 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg transition-transform duration-300 group-hover:translate-y-0">
                  Edit Presentation
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                {deck.title}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Edited {deck.edited}
                </p>
                <span className="material-symbols-outlined text-[20px] text-slate-400 transition-colors hover:text-primary">
                  more_vert
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
