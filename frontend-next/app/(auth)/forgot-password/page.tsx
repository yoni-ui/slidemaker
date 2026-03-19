"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSupabase } from "@/components/SupabaseProvider"

const NOT_CONFIGURED_MSG =
  "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (or Vercel env vars), then restart."

function ForgotPasswordForm() {
  const { client: supabase, isConfigured } = useSupabase()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!isConfigured || !supabase) {
      setError(NOT_CONFIGURED_MSG)
      setLoading(false)
      return
    }
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f6f8] px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">
            mark_email_read
          </span>
          <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
          <p className="mt-2 text-slate-600">
            We sent a password reset link to {email}. Click it to set a new password.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white transition-all hover:brightness-110"
          >
            Back to Log in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f6f8] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-primary">
            layers
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            DeckShare
          </h1>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Reset password</h2>
        <p className="mb-6 text-sm text-slate-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f6f6f8]">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  )
}
