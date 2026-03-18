"use client";

import Link from "next/link";

export function AppHeader() {
  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl dark:border-white/5 dark:bg-background-dark/80">
      <div className="max-w-xl flex-1">
        <div className="group relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            type="text"
            placeholder="Search your decks, folders, and assets..."
            className="w-full rounded-xl border-none bg-slate-100 py-2.5 pl-11 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-white/5 dark:placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/editor"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create New Deck
        </Link>
        <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-6 dark:border-white/10">
          <button
            type="button"
            className="relative p-2 text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-primary dark:border-background-dark" />
          </button>
          <button
            type="button"
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-transparent transition-all hover:border-primary"
          >
            <div className="flex h-full w-full items-center justify-center bg-slate-600 text-xs font-bold text-white">
              JD
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
