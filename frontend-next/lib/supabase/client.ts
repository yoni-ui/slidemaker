import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey || url === "https://your-project.supabase.co" || anonKey === "your-anon-key-here") {
    return null
  }
  return createBrowserClient(url, anonKey)
}
