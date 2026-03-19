import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const FREE_DAILY_LIMIT = 5

export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({
        remaining: FREE_DAILY_LIMIT,
        limit: FREE_DAILY_LIMIT,
        used: 0,
        authenticated: false,
      })
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({
        remaining: FREE_DAILY_LIMIT,
        limit: FREE_DAILY_LIMIT,
        used: 0,
        authenticated: false,
      })
    }

    const today = new Date().toISOString().slice(0, 10)
    const { data: row } = await supabase
      .from("user_usage")
      .select("generations_count")
      .eq("user_id", user.id)
      .eq("usage_date", today)
      .single()

    const used = row?.generations_count ?? 0
    const remaining = Math.max(0, FREE_DAILY_LIMIT - used)

    return NextResponse.json({
      remaining,
      limit: FREE_DAILY_LIMIT,
      used,
      authenticated: true,
    })
  } catch {
    return NextResponse.json(
      {
        remaining: FREE_DAILY_LIMIT,
        limit: FREE_DAILY_LIMIT,
        used: 0,
        authenticated: false,
      },
      { status: 200 }
    )
  }
}
