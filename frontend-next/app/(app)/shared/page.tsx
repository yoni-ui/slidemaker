export default function SharedPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Shared with Me
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Decks and folders others have shared with you
        </p>
      </div>
      <div className="rounded-2xl border border-border-default bg-surface-card p-8 dark:border-white/5 dark:bg-card-dark">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">share</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No shared presentations yet. When someone shares a deck with you, it
            will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
