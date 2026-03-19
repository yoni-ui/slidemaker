"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/editor", label: "My Presentations", icon: "present_to_all" },
  { href: "/shared", label: "Shared with Me", icon: "group" },
  { href: "/templates", label: "Templates", icon: "description" },
  { href: "/trash", label: "Trash", icon: "delete" },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col justify-between border-r border-border-default bg-surface-card">
      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
            <span className="material-symbols-outlined">layers</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none text-slate-900">SlideMaker</h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Presentations
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
      <div className="flex flex-col gap-6 border-t border-border-default p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">cloud</span>
              Storage
            </span>
            <span className="text-slate-900">6.5GB / 10GB</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-primary" style={{ width: "65%" }} />
          </div>
        </div>
        <div className="rounded-2xl border border-border-default bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-900">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-slate-600">
            Unlimited storage and premium templates.
          </p>
          <Link
            href="/settings"
            className="mt-3 block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </aside>
  );
}
