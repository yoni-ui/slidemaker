import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <header className="border-b border-border-default bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">
              layers
            </span>
            <span className="text-lg font-bold text-slate-900">DeckShare</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Back to App
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-500">Last updated: March 2025</p>
        <div className="mt-8 space-y-6 text-slate-600">
          <p>
            DeckShare respects your privacy. This is a placeholder page.
            Replace with your actual privacy policy.
          </p>
          <p>
            For questions, contact us at privacy@deckshare.example.com.
          </p>
        </div>
      </main>
    </div>
  )
}
