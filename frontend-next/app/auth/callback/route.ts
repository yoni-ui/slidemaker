import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const { searchParams } = requestUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocal = process.env.NODE_ENV === "development"
  const origin = isLocal
    ? requestUrl.origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : requestUrl.origin

  if (code) {
    try {
      const supabase = await createClient()
      if (!supabase) return NextResponse.redirect(`${origin}/login?error=auth_callback`)
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        const path = next.startsWith("/") ? next : `/${next}`
        return NextResponse.redirect(`${origin}${path}`)
      }
    } catch {
      // Fall through to error redirect
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
