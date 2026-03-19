/**
 * Browser Supabase client. Uses @supabase/supabase-js so the app builds
 * even when @supabase/ssr is not installed. For full SSR cookie handling
 * install @supabase/ssr and use createBrowserClient from there instead.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createBrowserClient(url: string, anonKey: string) {
  return createSupabaseClient(url, anonKey)
}
