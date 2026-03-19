"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/SupabaseProvider"
import { useDeckStorage } from "@/lib/use-deck-storage"

export function AppHeader() {
  const router = useRouter()
  const { client: supabase } = useSupabase()
  const { getAllDecks } = useDeckStorage()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; title: string }>
  >([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
      setUserEmail(typeof window !== "undefined" ? localStorage.getItem("bypass-auth-email") : null)
      return
    }
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data?.user?.email ?? null)
      })
    }
  }, [supabase])

  useEffect(() => {
    if (searchQuery.trim()) {
      getAllDecks().then((decks) => {
        const filtered = decks
          .filter((d) =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
          .map((d) => ({ id: d.id, title: d.title }))
        setSearchResults(filtered)
        setShowSearchDropdown(true)
      })
    } else {
      setSearchResults([])
      setShowSearchDropdown(false)
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSearchDropdown(false)
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false)
      }
    }
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setShowProfile(false)
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") {
      if (typeof window !== "undefined") localStorage.removeItem("bypass-auth-email")
      router.push("/login")
      router.refresh()
      return
    }
    if (supabase) await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="z-10 flex h-14 items-center justify-between border-b border-border-default bg-surface-card/95 px-6 backdrop-blur-sm lg:px-8">
      <div className="max-w-md flex-1" ref={searchRef}>
        <div className="group relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearchDropdown(true)}
            placeholder="Search decks..."
            className="w-full rounded-lg border border-border-default bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search decks"
          />
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-border-default bg-white py-2 shadow-card-hover">
              {searchResults.length === 0 ? (
                <p className="px-4 py-2 text-sm text-slate-500">
                  No decks found
                </p>
              ) : (
                searchResults.map((deck) => (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => {
                      router.push(`/editor?deck=${deck.id}`)
                      setSearchQuery("")
                      setShowSearchDropdown(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      gallery_thumbnail
                    </span>
                    {deck.title}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/editor"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create deck
        </Link>
        <div className="ml-2 flex items-center gap-2 border-l border-border-default pl-6">
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 text-slate-500 transition-colors hover:text-slate-900"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-primary" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-xl border border-slate-200 bg-white py-4 shadow-lg">
                <p className="px-4 text-center text-sm text-slate-500">
                  No new notifications
                </p>
              </div>
            )}
          </div>
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfile((v) => !v)}
              className="h-9 w-9 overflow-hidden rounded-full border-2 border-transparent transition-all hover:border-primary"
              aria-label="Profile menu"
              aria-expanded={showProfile}
            >
              <div className="flex h-full w-full items-center justify-center bg-slate-600 text-xs font-bold text-white">
                {userEmail
                  ? userEmail.slice(0, 2).toUpperCase()
                  : "?"}
              </div>
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-border-default bg-white py-2 shadow-card-hover">
                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-900 hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    settings
                  </span>
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
