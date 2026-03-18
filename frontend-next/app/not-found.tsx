import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f6f8] text-slate-600 font-display">
      <span className="material-symbols-outlined mb-4 text-6xl text-primary">
        search_off
      </span>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">404</h1>
      <p className="mb-6 text-lg">Page not found</p>
      <Link
        href="/dashboard"
        className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}
