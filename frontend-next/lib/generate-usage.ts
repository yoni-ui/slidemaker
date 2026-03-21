import { createClient } from "@/lib/supabase/server"

export const FREE_DAILY_LIMIT = 5

/** Returns user id if signed in; usage checks only apply when non-null. */
export async function getGenerationUserId(): Promise<string | null> {
  try {
    const supabase = await createClient()
    if (!supabase) return null
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

export async function isOverDailyGenerationLimit(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    if (!supabase) return false
    const today = new Date().toISOString().slice(0, 10)
    const { data: row } = await supabase
      .from("user_usage")
      .select("generations_count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single()
    const used = row?.generations_count ?? 0
    return used >= FREE_DAILY_LIMIT
  } catch {
    return false
  }
}

/** Increment after a successful full generation (legacy prompt or design-from-plan). Does not run for /api/plan. */
export async function incrementGenerationCount(userId: string): Promise<void> {
  try {
    const supabase = await createClient()
    if (!supabase) return
    const today = new Date().toISOString().slice(0, 10)
    const { data: row } = await supabase
      .from("user_usage")
      .select("generations_count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .single()

    if (row) {
      await supabase
        .from("user_usage")
        .update({ generations_count: row.generations_count + 1 })
        .eq("user_id", userId)
        .eq("usage_date", today)
    } else {
      await supabase.from("user_usage").insert({
        user_id: userId,
        usage_date: today,
        generations_count: 1,
      })
    }
  } catch {
    // Ignore usage update errors
  }
}
