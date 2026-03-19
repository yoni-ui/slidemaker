"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getAllDecks } from "@/lib/deck-storage"
import { createClient } from "@/lib/supabase/client"

export function AppHeader() {
  const router = useRouter()
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
    const supabase = createClient()
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data?.user?.email ?? null)
      })
    }
  }, [])

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
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">
      <div className="max-w-xl flex-1" ref={searchRef}>
        <div className="group relative">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400 transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearchDropdown(true)}
            placeholder="Search your decks..."
            className="w-full rounded-xl border-none bg-slate-100 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20"
            aria-label="Search decks"
          />
          {showSearchDropdown && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
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
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create New Deck
        </Link>
        <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-6">
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
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
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
