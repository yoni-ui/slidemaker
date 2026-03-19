import type { EditableSlide } from "@/components/slides/types"
import { createSupabaseDeckStorage } from "@/lib/deck-storage-supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

const STORAGE_KEY = "slidemaker-decks"

export type StoredDeck = {
  id: string
  title: string
  slides: EditableSlide[]
  updatedAt: string
  deletedAt?: string
  isDraft?: boolean
}

export const generateDeckId = (): string =>
  `deck_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export type DeckStorage = {
  saveDeck: (
    deckId: string,
    title: string,
    slides: EditableSlide[],
    isDraft?: boolean
  ) => Promise<StoredDeck>
  loadDeck: (deckId: string) => Promise<StoredDeck | null>
  getAllDecks: (includeDeleted?: boolean) => Promise<StoredDeck[]>
  getTrashedDecks: () => Promise<StoredDeck[]>
  deleteDeck: (deckId: string, soft?: boolean) => Promise<void>
  restoreDeck: (deckId: string) => Promise<void>
}

const getLocalStored = (): Record<string, StoredDeck> => {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredDeck>) : {}
  } catch {
    return {}
  }
}

const setLocalStored = (decks: Record<string, StoredDeck>) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks))
  } catch {
    // ignore
  }
}

const localStorageAdapter: DeckStorage = {
  saveDeck: async (deckId, title, slides, isDraft = true) => {
    const decks = getLocalStored()
    const now = new Date().toISOString()
    const deck: StoredDeck = {
      id: deckId,
      title,
      slides,
      updatedAt: now,
      isDraft,
    }
    decks[deckId] = deck
    setLocalStored(decks)
    return deck
  },
  loadDeck: async (deckId) => {
    const decks = getLocalStored()
    const deck = decks[deckId]
    if (!deck || deck.deletedAt) return null
    return deck
  },
  getAllDecks: async (includeDeleted = false) => {
    const decks = getLocalStored()
    const list = Object.values(decks)
    if (includeDeleted)
      return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return list
      .filter((d) => !d.deletedAt)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
  getTrashedDecks: async () => {
    const decks = getLocalStored()
    return Object.values(decks)
      .filter((d) => d.deletedAt)
      .sort((a, b) =>
        (b.deletedAt ?? "").localeCompare(a.deletedAt ?? "")
      )
  },
  deleteDeck: async (deckId, soft = true) => {
    const decks = getLocalStored()
    const deck = decks[deckId]
    if (!deck) return
    if (soft) {
      deck.deletedAt = new Date().toISOString()
      decks[deckId] = deck
    } else {
      delete decks[deckId]
    }
    setLocalStored(decks)
  },
  restoreDeck: async (deckId) => {
    const decks = getLocalStored()
    const deck = decks[deckId]
    if (!deck) return
    delete deck.deletedAt
    decks[deckId] = deck
    setLocalStored(decks)
  },
}

export const getDeckStorage = async (
  supabase: SupabaseClient | null
): Promise<DeckStorage> => {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        return createSupabaseDeckStorage(supabase) as unknown as DeckStorage
      }
    } catch {
      // fall through to localStorage
    }
  }
  return localStorageAdapter
}

export const saveDeckWithClient = async (
  supabase: SupabaseClient | null,
  deckId: string,
  title: string,
  slides: EditableSlide[],
  isDraft = true
): Promise<StoredDeck> => {
  const storage = await getDeckStorage(supabase)
  return storage.saveDeck(deckId, title, slides, isDraft)
}

export const loadDeckWithClient = async (
  supabase: SupabaseClient | null,
  deckId: string
): Promise<StoredDeck | null> => {
  const storage = await getDeckStorage(supabase)
  return storage.loadDeck(deckId)
}

export const getAllDecksWithClient = async (
  supabase: SupabaseClient | null,
  includeDeleted = false
): Promise<StoredDeck[]> => {
  const storage = await getDeckStorage(supabase)
  return storage.getAllDecks(includeDeleted)
}

export const deleteDeckWithClient = async (
  supabase: SupabaseClient | null,
  deckId: string,
  soft = true
): Promise<void> => {
  const storage = await getDeckStorage(supabase)
  return storage.deleteDeck(deckId, soft)
}

export const getTrashedDecksWithClient = async (
  supabase: SupabaseClient | null
): Promise<StoredDeck[]> => {
  const storage = await getDeckStorage(supabase)
  return storage.getTrashedDecks()
}

export const restoreDeckWithClient = async (
  supabase: SupabaseClient | null,
  deckId: string
): Promise<void> => {
  const storage = await getDeckStorage(supabase)
  return storage.restoreDeck(deckId)
}

export const saveDeck = async (
  deckId: string,
  title: string,
  slides: EditableSlide[],
  isDraft = true
): Promise<StoredDeck> => {
  return saveDeckWithClient(null, deckId, title, slides, isDraft)
}

export const loadDeck = async (deckId: string): Promise<StoredDeck | null> => {
  return loadDeckWithClient(null, deckId)
}

export const getAllDecks = async (
  includeDeleted = false
): Promise<StoredDeck[]> => {
  return getAllDecksWithClient(null, includeDeleted)
}

export const getTrashedDecks = async (): Promise<StoredDeck[]> => {
  return getTrashedDecksWithClient(null)
}

export const deleteDeck = async (
  deckId: string,
  soft = true
): Promise<void> => {
  return deleteDeckWithClient(null, deckId, soft)
}

export const restoreDeck = async (deckId: string): Promise<void> => {
  return restoreDeckWithClient(null, deckId)
}
