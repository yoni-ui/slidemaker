"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTrashedDecks, restoreDeck, deleteDeck } from "@/lib/deck-storage"

export default function TrashPage() {
  const [decks, setDecks] = useState<
    Array<{ id: string; title: string; deletedAt?: string }>
  >([])

  const refresh = () => {
    getTrashedDecks().then((list) =>
      setDecks(
        list.map((d) => ({
          id: d.id,
          title: d.title,
          deletedAt: d.deletedAt,
        }))
      )
    )
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleRestore = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    restoreDeck(id).then(() => refresh())
  }

  const handleDeletePermanent = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      typeof window !== "undefined" &&
      window.confirm("Permanently delete this deck? This cannot be undone.")
    ) {
      deleteDeck(id, false).then(() => refresh())
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Trash
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Restore or permanently delete decks
        </p>
      </div>
      {decks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16">
          <span className="material-symbols-outlined mb-4 text-5xl text-slate-400">
            delete
          </span>
          <p className="text-sm font-medium text-slate-600">Trash is empty</p>
          <Link
            href="/dashboard"
            className="mt-4 text-sm font-bold text-primary hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-100" />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {deck.title}
                </h3>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleRestore(e, deck.id)}
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                  >
                    Restore
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeletePermanent(e, deck.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
