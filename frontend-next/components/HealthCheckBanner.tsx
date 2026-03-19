"use client"

import { useState, useEffect } from "react"
import { healthCheck } from "@/lib/api"

export function HealthCheckBanner() {
  const [apiDown, setApiDown] = useState(false)

  useEffect(() => {
    healthCheck()
      .then(() => setApiDown(false))
      .catch(() => setApiDown(true))
  }, [])

  if (!apiDown) return null

  return (
    <div
      className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white"
      role="alert"
    >
      API connection issue. Generation and export may not work. Check that the
      backend is running.
    </div>
  )
}
