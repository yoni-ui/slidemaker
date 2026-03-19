"use client"

import { useState } from "react"

type Tab = "personal" | "security" | "billing"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal")

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "personal", label: "Personal", icon: "person" },
    { id: "security", label: "Security", icon: "security" },
    { id: "billing", label: "Billing", icon: "payments" },
  ]

  return (
    <div className="mx-auto max-w-[960px] flex-1 px-6 py-8 lg:px-40">
      <div className="mb-8 flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="flex size-32 min-h-32 items-center justify-center rounded-full border-4 border-primary/20 bg-slate-600 text-4xl font-bold text-white shadow-xl">
            JD
          </div>
          <button
            type="button"
            onClick={() => alert("Profile photo upload – connect your storage when ready")}
            className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Edit profile photo"
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 border-b-2 pb-3 px-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span className="text-sm font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border-default bg-surface-card p-6 dark:border-white/5 dark:bg-card-dark">
        {activeTab === "personal" && (
          <>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Profile
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Update your name, email, and profile photo.
            </p>
          </>
        )}
        {activeTab === "security" && (
          <>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Security
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Change your password and manage security settings.
            </p>
            <button
              type="button"
              onClick={() => alert("Change password – connect your auth when ready")}
              className="mt-4 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20"
            >
              Change Password
            </button>
          </>
        )}
        {activeTab === "billing" && (
          <>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Billing
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Upgrade to Pro for unlimited storage and premium templates.
            </p>
            <button
              type="button"
              onClick={() => alert("Upgrade – connect your billing provider when ready")}
              className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            >
              Upgrade to Pro
            </button>
          </>
        )}
      </div>
    </div>
  )
}
