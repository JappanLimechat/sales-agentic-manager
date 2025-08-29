"use client"

import { useMemo, useState, useEffect } from "react"
import { DashboardShell } from "@/components/sales/dashboard-shell"
import { AssistantPanel } from "@/components/chat/assistant-panel"
import { defaultPOCs, type POCRecord, Views, Regions, TimeRanges } from "@/data/pocs"

export default function Page() {
  const [query, setQuery] = useState("")
  const [view, setView] = useState<(typeof Views)[number]>("Manager")
  const [region, setRegion] = useState<(typeof Regions)[number]>("All India")
  const [timeRange, setTimeRange] = useState<(typeof TimeRanges)[number]>("This Month")
  const [language, setLanguage] = useState<"EN" | "HI">("EN")

  // load persisted filters on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("limechat.filters")
      if (raw) {
        const f = JSON.parse(raw)
        if (f.query) setQuery(f.query)
        if (f.view && Views.includes(f.view)) setView(f.view)
        if (f.region && Regions.includes(f.region)) setRegion(f.region)
        if (f.timeRange && (TimeRanges as readonly string[]).includes(f.timeRange)) setTimeRange(f.timeRange)
        if (f.language && (["EN", "HI"] as const).includes(f.language)) setLanguage(f.language)
      }
    } catch {}
  }, [])

  // persist on change
  useEffect(() => {
    const data = { query, view, region, timeRange, language }
    try {
      localStorage.setItem("limechat.filters", JSON.stringify(data))
    } catch {}
  }, [query, view, region, timeRange, language])

  const filtered: POCRecord[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    return defaultPOCs.filter((p) => {
      const byQuery = q.length === 0 || p.company.toLowerCase().includes(q)
      const byRegion = region === "All India" || p.cityRegion === region
      const byTime = true
      return byQuery && byRegion && byTime
    })
  }, [query, region])

  return (
    <main className="h-dvh w-full overflow-hidden">
      <div className="flex h-full">
        <section className="flex-1 basis-[70%] min-w-0 border-r border-border">
          <DashboardShell
            view={view}
            onViewChange={setView}
            query={query}
            onQueryChange={setQuery}
            region={region}
            onRegionChange={setRegion}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            records={filtered}
          />
        </section>

        <aside className="basis-[30%] min-w-[320px] max-w-[560px] hidden md:flex">
          <AssistantPanel language={language} onLanguageChange={setLanguage} currentView={view} currentQuery={query} />
        </aside>
      </div>
    </main>
  )
}
