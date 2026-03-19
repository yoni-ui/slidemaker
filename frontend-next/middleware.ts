import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_PATHS = [
  "/dashboard",
  "/editor",
  "/trash",
  "/shared",
  "/team",
  "/settings",
  "/templates",
  "/reset-password",
]

const isProtectedPath = (pathname: string) =>
  PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))

const isAuthPath = (pathname: string) =>
  pathname === "/login" ||
  pathname === "/signup" ||
  pathname === "/forgot-password"

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
    return NextResponse.next()
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          response.cookies.set(name, value)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPath(request.nextUrl.pathname) && user) {
    const redirect = request.nextUrl.searchParams.get("redirect") ?? "/dashboard"
    return NextResponse.redirect(new URL(redirect, request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|terms|privacy).*)",
  ],
}
