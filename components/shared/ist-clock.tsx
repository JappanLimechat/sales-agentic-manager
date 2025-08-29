"use client"

import { useEffect, useState } from "react"

export function ISTClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    // Initialize with current time only on client
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Return placeholder during SSR to prevent hydration mismatch
  if (!now) {
    return <span aria-live="polite">--:-- IST</span>
  }

  const text = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now)

  return <span aria-live="polite">{text} IST</span>
}
