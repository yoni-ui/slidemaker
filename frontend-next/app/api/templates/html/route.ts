import { NextResponse } from "next/server"
import { getStitchTemplates } from "@/lib/stitch-mapping"

export async function GET() {
  const templates = getStitchTemplates().map((t) => ({
    id: t.id,
    name: t.name,
    path: t.path,
    layout: t.layout,
  }))
  return NextResponse.json({ templates })
}
