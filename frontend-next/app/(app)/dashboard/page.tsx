"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getAllDecks, deleteDeck } from "@/lib/deck-storage"

const formatRelativeTime = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  return d.toLocaleDateString()
}

export default function DashboardPage() {
  const [decks, setDecks] = useState<Array<{ id: string; title: string; updatedAt: string }>>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const refresh = () => {
    const list = getAllDecks()
    setDecks(
      list.map((d) => ({
        id: d.id,
        title: d.title,
        updatedAt: d.updatedAt,
      }))
    )
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleMoveToTrash = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    deleteDeck(id, true)
    refresh()
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Recent Presentations
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Pick up where you left off
          </p>
        </div>
        <Link
          href="/editor"
          className="group flex items-center gap-1 text-sm font-bold text-primary hover:underline"
        >
          View All{" "}
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
            chevron_right
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {decks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16">
            <span className="material-symbols-outlined mb-4 text-5xl text-slate-400">
              gallery_thumbnail
            </span>
            <p className="text-sm font-medium text-slate-600">No presentations yet</p>
            <Link
              href="/editor"
              className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            >
              Create your first deck
            </Link>
          </div>
        ) : (
          decks.map((deck) => (
            <div
              key={deck.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-2xl hover:shadow-primary/10"
            >
              <Link href={`/editor?deck=${deck.id}`} className="block">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="translate-y-4 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-lg transition-transform duration-300 group-hover:translate-y-0">
                      Edit Presentation
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-5">
                <Link href={`/editor?deck=${deck.id}`}>
                  <h3 className="truncate text-sm font-bold text-slate-900 transition-colors hover:text-primary">
                    {deck.title}
                  </h3>
                </Link>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Edited {formatRelativeTime(deck.updatedAt)}
                  </p>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setOpenMenuId(openMenuId === deck.id ? null : deck.id)
                      }}
                      className="material-symbols-outlined text-[20px] text-slate-400 transition-colors hover:text-primary"
                      aria-label="Deck options"
                      aria-expanded={openMenuId === deck.id}
                    >
                      more_vert
                    </button>
                    {openMenuId === deck.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                          aria-hidden="true"
                        />
                        <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={(e) => {
                              handleMoveToTrash(e, deck.id)
                              setOpenMenuId(null)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Move to Trash
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
