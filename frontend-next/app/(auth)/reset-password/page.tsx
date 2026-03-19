"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/SupabaseProvider"

const NOT_CONFIGURED_MSG =
  "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (or Vercel env vars), then restart."

function ResetPasswordForm() {
  const router = useRouter()
  const { client: supabase, isConfigured } = useSupabase()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login")
      }
    })
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    if (!isConfigured || !supabase) {
      setError(NOT_CONFIGURED_MSG)
      setLoading(false)
      return
    }
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) {
      setError(err.message)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background-light px-4">
        <div className="w-full max-w-md rounded-xl border border-border-default bg-surface-card p-8 shadow-card-hover text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">
            check_circle
          </span>
          <h2 className="text-xl font-bold text-slate-900">Password updated</h2>
          <p className="mt-2 text-slate-600">
            Your password has been reset. Redirecting to dashboard…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-md rounded-xl border border-border-default bg-surface-card p-8 shadow-card-hover">
        <div className="mb-8 flex items-center gap-2">
          <img
            src="/logo.png"
            alt="SlideMaker logo"
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            SlideMaker
          </span>
        </div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Set new password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Repeat your password"
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
            {loading ? "Updating…" : "Update password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background-light">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
