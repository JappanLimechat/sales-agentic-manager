"use client"

import { useEffect, useMemo, useState } from "react"

type Fest = { name: string; dateISO: string; suggestions: string[] }

const FESTIVALS: Fest[] = [
  {
    name: "Dussehra",
    dateISO: "2025-10-02T00:00:00+05:30",
    suggestions: ["Offer festive onboarding discounts", "Promote WhatsApp flows for store assistance"],
  },
  {
    name: "Diwali",
    dateISO: "2025-10-20T00:00:00+05:30",
    suggestions: ["Push cart recovery on WhatsApp", "Launch Hinglish campaign creatives"],
  },
  {
    name: "Holi",
    dateISO: "2026-03-04T00:00:00+05:30",
    suggestions: ["Color-themed product bundles", "UPI cashback promos"],
  },
  {
    name: "Eid al-Fitr",
    dateISO: "2026-03-20T00:00:00+05:30",
    suggestions: ["Evening engagement windows", "COD confirmations and offers"],
  },
  {
    name: "Pongal",
    dateISO: "2026-01-14T00:00:00+05:30",
    suggestions: ["Regional language templates (Tamil)", "Hyperlocal serviceability updates"],
  },
]

export function FestivalCalendar() {
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const list = useMemo(() => {
    const tzNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    return FESTIVALS.map((f) => {
      const date = new Date(f.dateISO)
      const diffMs = date.getTime() - tzNow.getTime()
      const days = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
      return { ...f, date, days }
    }).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [now])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {list.map((f) => (
        <div key={f.name} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{f.name}</div>
            <span className="text-xs text-muted-foreground">
              {f.date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
            </span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Countdown: {f.days} days • IST</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {f.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
