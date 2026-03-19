"use client"

import { createContext, useContext, useMemo } from "react"
import { createBrowserClient } from "@/lib/supabase/browser-client"
import type { SupabaseClient } from "@supabase/supabase-js"

type SupabaseContextValue = {
  client: SupabaseClient | null
  isConfigured: boolean
}

const SupabaseContext = createContext<SupabaseContextValue>({
  client: null,
  isConfigured: false,
})

export const useSupabase = () => useContext(SupabaseContext)

type SupabaseProviderProps = {
  url: string
  anonKey: string
  children: React.ReactNode
}

export const SupabaseProvider = ({
  url,
  anonKey,
  children,
}: SupabaseProviderProps) => {
  const value = useMemo(() => {
    const isValid =
      url &&
      anonKey &&
      url !== "https://your-project.supabase.co" &&
      anonKey !== "your-anon-key-here"
    const client = isValid ? createBrowserClient(url, anonKey) : null
    return { client, isConfigured: !!client }
  }, [url, anonKey])

  return (
    <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
  )
}
