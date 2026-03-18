export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-[960px] flex-1 px-6 py-8 lg:px-40">
      <div className="mb-8 flex flex-col gap-6 items-center">
        <div className="relative group">
          <div className="flex size-32 min-h-32 items-center justify-center rounded-full border-4 border-primary/20 bg-slate-600 text-4xl font-bold text-white shadow-xl">
            JD
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            Account
          </h1>
          <p className="text-center text-base font-medium text-primary">
            user@example.com
          </p>
        </div>
      </div>
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max gap-8 border-b border-slate-200 dark:border-primary/20">
          <a
            href="#"
            className="flex items-center justify-center gap-2 border-b-2 border-primary pb-3 px-2 text-primary"
          >
            <span className="material-symbols-outlined text-sm">person</span>
            <span className="text-sm font-bold">Personal</span>
          </a>
          <button
            type="button"
            className="flex items-center justify-center gap-2 pb-3 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="text-sm font-bold">Security</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 pb-3 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">payments</span>
            <span className="text-sm font-bold">Billing</span>
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/5 dark:bg-card-dark">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Profile
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Update your name, email, and profile photo.
        </p>
      </div>
    </div>
  );
}
