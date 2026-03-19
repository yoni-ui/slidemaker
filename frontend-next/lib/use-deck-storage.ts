"use client"

import { useCallback } from "react"
import { useSupabase } from "@/components/SupabaseProvider"
import {
  saveDeckWithClient,
  loadDeckWithClient,
  getAllDecksWithClient,
  deleteDeckWithClient,
  getTrashedDecksWithClient,
  restoreDeckWithClient,
  generateDeckId,
} from "./deck-storage"
import type { StoredDeck } from "./deck-storage"
import type { EditableSlide } from "@/components/slides/types"

export { generateDeckId }
export type { StoredDeck }

export const useDeckStorage = () => {
  const { client: supabase } = useSupabase()

  const saveDeck = useCallback(
    async (
      deckId: string,
      title: string,
      slides: EditableSlide[],
      isDraft = true
    ) => saveDeckWithClient(supabase, deckId, title, slides, isDraft),
    [supabase]
  )

  const loadDeck = useCallback(
    async (deckId: string) => loadDeckWithClient(supabase, deckId),
    [supabase]
  )

  const getAllDecks = useCallback(
    async (includeDeleted = false) =>
      getAllDecksWithClient(supabase, includeDeleted),
    [supabase]
  )

  const deleteDeck = useCallback(
    async (deckId: string, soft = true) =>
      deleteDeckWithClient(supabase, deckId, soft),
    [supabase]
  )

  const getTrashedDecks = useCallback(
    async () => getTrashedDecksWithClient(supabase),
    [supabase]
  )

  const restoreDeck = useCallback(
    async (deckId: string) => restoreDeckWithClient(supabase, deckId),
    [supabase]
  )

  return {
    saveDeck,
    loadDeck,
    getAllDecks,
    deleteDeck,
    getTrashedDecks,
    restoreDeck,
    generateDeckId,
  }
}
