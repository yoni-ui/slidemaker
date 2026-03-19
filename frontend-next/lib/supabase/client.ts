import { createBrowserClient } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValid = url && anonKey && url !== "https://your-project.supabase.co" && anonKey !== "your-anon-key-here"

export const createClient = () => {
  if (!isValid) return null
  return createBrowserClient(url, anonKey)
}
