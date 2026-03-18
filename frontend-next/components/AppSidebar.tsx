"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/editor", label: "My Presentations", icon: "present_to_all" },
  { href: "/shared", label: "Shared with Me", icon: "group" },
  { href: "/templates", label: "Templates", icon: "description" },
  { href: "#", label: "Trash", icon: "delete" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white dark:border-white/5 dark:bg-sidebar-dark">
      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">layers</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">DeckShare</h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Presentation Platform
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1.5">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-primary font-semibold text-white shadow-md shadow-primary/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">cloud</span>
              Storage
            </div>
            <span className="text-slate-900 dark:text-white">6.5GB / 10GB</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div
              className="h-full bg-primary"
              style={{ width: "65%" }}
            />
          </div>
          <p className="text-center text-[10px] font-medium text-slate-500">
            65% of your storage used
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
            Upgrade to Pro
          </p>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Get unlimited storage and premium templates.
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
