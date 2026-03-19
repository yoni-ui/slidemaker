import { cookies } from "next/headers"

const isValid =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-anon-key-here"

export const createClient = async () => {
  if (!isValid) return null
  let createServerClient: (
    url: string,
    key: string,
    options: object
  ) => unknown
  try {
    // Avoid bundler resolution errors when @supabase/ssr is not installed.
    ;({ createServerClient } = await import(/* webpackIgnore: true */ "@supabase/ssr"))
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
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — ignore
        }
      },
    },
  })
}
