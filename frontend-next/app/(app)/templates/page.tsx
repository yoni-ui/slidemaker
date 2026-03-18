import Link from "next/link";

export default function TemplatesPage() {
  const categories = [
    { name: "Business", icon: "business_center" },
    { name: "Education", icon: "school" },
    { name: "Marketing", icon: "campaign" },
    { name: "Pitch", icon: "rocket_launch" },
  ];

  const templates = [
    { name: "Modern Pitch", category: "Business" },
    { name: "Annual Report", category: "Business" },
    { name: "Lesson Plan", category: "Education" },
    { name: "Product Launch", category: "Marketing" },
  ];

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="flex w-full flex-col gap-8 border-r border-slate-200 p-6 dark:border-primary/10 lg:w-64">
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-primary/60">
            Workspace
          </h3>
          <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 font-semibold text-primary">
            <span className="material-symbols-outlined">dashboard</span>
            <p className="text-sm">Templates</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-primary/5"
          >
            <span className="material-symbols-outlined">folder_open</span>
            My Projects
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-primary/5"
          >
            <span className="material-symbols-outlined">star</span>
            Favorites
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-primary/60">
            Categories
          </h3>
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-primary/5"
            >
              <span className="material-symbols-outlined">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </aside>
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Templates Library
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start from a template or create from scratch
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link
              key={t.name}
              href="/editor"
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-xl dark:border-white/5 dark:bg-card-dark"
            >
              <div className="aspect-video bg-slate-100 dark:bg-black/20" />
              <div className="p-4">
                <h3 className="font-bold text-slate-900 group-hover:text-primary dark:text-white">
                  {t.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
