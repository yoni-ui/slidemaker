import type { EditableSlide } from "@/components/slides/types"
import type { SupabaseClient } from "@supabase/supabase-js"

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

export const createSupabaseDeckStorage = (supabase: SupabaseClient) => {
  const saveDeck = async (
    deckId: string,
    title: string,
    slides: EditableSlide[],
    isDraft = true
  ): Promise<StoredDeck> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")
    const now = new Date().toISOString()
    const deck: StoredDeck = { id: deckId, title, slides, updatedAt: now, isDraft }
    const { error } = await supabase.from("decks").upsert(
      {
        id: deckId,
        user_id: user.id,
        title,
        slides,
        updated_at: now,
        deleted_at: null,
        is_draft: isDraft,
      },
      { onConflict: "id" }
    )
    if (error) throw new Error(error.message)
    return deck
  }

  const loadDeck = async (deckId: string): Promise<StoredDeck | null> => {
    const { data, error } = await supabase
      .from("decks")
      .select("id, title, slides, updated_at, deleted_at, is_draft")
      .eq("id", deckId)
      .is("deleted_at", null)
      .single()
    if (error || !data) return null
    return {
      id: data.id,
      title: data.title,
      slides: data.slides as EditableSlide[],
      updatedAt: data.updated_at,
      deletedAt: data.deleted_at ?? undefined,
      isDraft: data.is_draft ?? true,
    }
  }

  const getAllDecks = async (
    includeDeleted = false
  ): Promise<StoredDeck[]> => {
    let q = supabase
      .from("decks")
      .select("id, title, slides, updated_at, deleted_at, is_draft")
      .order("updated_at", { ascending: false })
    if (!includeDeleted) q = q.is("deleted_at", null)
    const { data, error } = await q
    if (error) return []
    return (data ?? []).map((d) => ({
      id: d.id,
      title: d.title,
      slides: d.slides as EditableSlide[],
      updatedAt: d.updated_at,
      deletedAt: d.deleted_at ?? undefined,
      isDraft: d.is_draft ?? true,
    }))
  }

  const getTrashedDecks = async (): Promise<StoredDeck[]> => {
    const { data, error } = await supabase
      .from("decks")
      .select("id, title, slides, updated_at, deleted_at, is_draft")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
    if (error) return []
    return (data ?? []).map((d) => ({
      id: d.id,
      title: d.title,
      slides: d.slides as EditableSlide[],
      updatedAt: d.updated_at,
      deletedAt: d.deleted_at ?? undefined,
      isDraft: d.is_draft ?? true,
    }))
  }

  const deleteDeck = async (
    deckId: string,
    soft = true
  ): Promise<void> => {
    if (soft) {
      await supabase
        .from("decks")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", deckId)
    } else {
      await supabase.from("decks").delete().eq("id", deckId)
    }
  }

  const restoreDeck = async (deckId: string): Promise<void> => {
    await supabase
      .from("decks")
      .update({ deleted_at: null })
      .eq("id", deckId)
  }

  return {
    saveDeck,
    loadDeck,
    getAllDecks,
    getTrashedDecks,
    deleteDeck,
    restoreDeck,
  }
}
