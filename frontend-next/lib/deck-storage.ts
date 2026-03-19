import type { EditableSlide } from "@/components/slides/types"

const STORAGE_KEY = "slidemaker-decks"

export type StoredDeck = {
  id: string
  title: string
  slides: EditableSlide[]
  updatedAt: string
  deletedAt?: string
}

export const generateDeckId = (): string =>
  `deck_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

const getStored = (): Record<string, StoredDeck> => {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, StoredDeck>) : {}
  } catch {
    return {}
  }
}

const setStored = (decks: Record<string, StoredDeck>) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks))
  } catch {
    // ignore
  }
}

export const saveDeck = (
  deckId: string,
  title: string,
  slides: EditableSlide[]
): StoredDeck => {
  const decks = getStored()
  const now = new Date().toISOString()
  const deck: StoredDeck = {
    id: deckId,
    title,
    slides,
    updatedAt: now,
    ...(decks[deckId]?.deletedAt ? {} : {}),
  }
  decks[deckId] = deck
  setStored(decks)
  return deck
}

export const loadDeck = (deckId: string): StoredDeck | null => {
  const decks = getStored()
  const deck = decks[deckId]
  if (!deck || deck.deletedAt) return null
  return deck
}

export const getAllDecks = (includeDeleted = false): StoredDeck[] => {
  const decks = getStored()
  const list = Object.values(decks)
  if (includeDeleted) return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return list
    .filter((d) => !d.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export const getTrashedDecks = (): StoredDeck[] => {
  const decks = getStored()
  return Object.values(decks)
    .filter((d) => d.deletedAt)
    .sort((a, b) => (b.deletedAt ?? "").localeCompare(a.deletedAt ?? ""))
}

export const deleteDeck = (deckId: string, soft = true): void => {
  const decks = getStored()
  const deck = decks[deckId]
  if (!deck) return
  if (soft) {
    deck.deletedAt = new Date().toISOString()
    decks[deckId] = deck
  } else {
    delete decks[deckId]
  }
  setStored(decks)
}

export const restoreDeck = (deckId: string): void => {
  const decks = getStored()
  const deck = decks[deckId]
  if (!deck) return
  delete deck.deletedAt
  decks[deckId] = deck
  setStored(decks)
}
