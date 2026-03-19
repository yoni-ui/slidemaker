export default function TeamPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Team & Workspace
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Manage your team and workspaces
        </p>
      </div>
      <div className="rounded-2xl border border-border-default bg-surface-card p-8 dark:border-white/5 dark:bg-card-dark">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Your workspace
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Invite members and manage roles
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Team management UI – connect your backend when ready.
        </p>
      </div>
    </div>
  );
}
