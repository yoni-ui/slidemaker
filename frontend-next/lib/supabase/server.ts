import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"

const isValid =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-anon-key-here"

export const createClient = async (): Promise<SupabaseClient | null> => {
  if (!isValid) return null

  // `@supabase/ssr` is dynamically imported so the app can still build/run
  // when the package isn't fully available in a given environment.
  type CreateServerClientFn = (
    url: string,
    key: string,
    options: any
  ) => SupabaseClient

  let createServerClient: CreateServerClientFn
  try {
    // Avoid bundler resolution errors when @supabase/ssr is not installed.
    const mod = await import(/* webpackIgnore: true */ "@supabase/ssr")
    createServerClient = mod.createServerClient as CreateServerClientFn
  } catch {
    return null
  }
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: any }>
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            ;(cookieStore as any).set(name, value, options)
          })
        } catch {
          // Server Component — ignore
        }
      },
    },
  })
}
