"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ISTClock } from "@/components/shared/ist-clock"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type POCRecord, Regions, Views, TimeRanges } from "@/data/pocs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { formatINR } from "@/lib/india"
import React from "react"
import { AEView } from "@/components/sales/ae-view"
import { ManagerView } from "@/components/sales/manager-view"
import { UtilitiesPanel } from "@/components/utilities/utilities-panel"
import Link from "next/link"
import RemindersPanel from "@/components/sales/reminders-panel"
import Image from "next/image"

type Props = {
  view: (typeof Views)[number]
  onViewChange: (v: (typeof Views)[number]) => void
  query: string
  onQueryChange: (q: string) => void
  region: (typeof Regions)[number]
  onRegionChange: (r: (typeof Regions)[number]) => void
  timeRange: (typeof TimeRanges)[number]
  onTimeRangeChange: (t: (typeof TimeRanges)[number]) => void
  records: POCRecord[]
}

const POCContext = React.createContext<{ records: POCRecord[] } | null>(null)

function usePOCContext() {
  const ctx = React.useContext(POCContext)
  if (!ctx) throw new Error("POC context missing")
  return ctx
}

export function DashboardShell(props: Props) {
  const { view, onViewChange, query, onQueryChange, region, onRegionChange, timeRange, onTimeRangeChange, records } =
    props

  const totals = useMemo(() => {
    const activePOCs = records.length
    // placeholders for future calculations
    return { activePOCs }
  }, [records])

  return (
    <POCContext.Provider value={{ records }}>
      <div className="flex h-full w-full flex-col">
        <header className="border-b border-border">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded bg-[#667eea]">
                <Image src="/SAM-logo.png" alt="LimeChat" width={48} height={48} className="object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none text-pretty">
                  <span className="text-foreground">LimeChat's</span>{" "}
                  <span className="text-muted-foreground">Ai Sales Agentic Manager (SAM)</span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  IST <ISTClock />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="hidden sm:inline-flex bg-transparent">
                <Link href="/tools/export-report">Export Report</Link>
              </Button>
              <Button asChild variant="secondary" className="hidden sm:inline-flex">
                <Link href="/tools/whatsapp-composer">Compose WhatsApp</Link>
              </Button>
              <ModeToggle />
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[220px]">
                <Input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Search POCs/companies..."
                />
              </div>

              <div className="flex items-center gap-2">
                {TimeRanges.map((t) => (
                  <Button
                    key={t}
                    variant={t === timeRange ? "default" : "outline"}
                    onClick={() => onTimeRangeChange(t)}
                    className={cn("h-9", t === timeRange ? "bg-[#667eea] text-white hover:bg-[#5a6de0]" : "")}
                  >
                    {t}
                  </Button>
                ))}
              </div>

              <Select value={view} onValueChange={(v) => onViewChange(v as (typeof Views)[number])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  {Views.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v} View
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={region} onValueChange={(r) => onRegionChange(r as (typeof Regions)[number])}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {Regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Filters:</span>
              <Badge variant="secondary">{view} View</Badge>
              <Badge variant="secondary">{region}</Badge>
              <Badge variant="secondary">{timeRange}</Badge>
              <Badge variant="outline">{records.length} results</Badge>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {view === "Executive" && <ExecutiveView activeCount={totals.activePOCs} />}
          {view === "AE" && <AEView records={records} />}
          {view === "Manager" && <ManagerView records={records} />}

          <div className="mt-4">
            <RemindersPanel />
          </div>

          {/* <div className="mt-4">
            <UtilitiesPanel />
          </div> */}
        </div>
      </div>
    </POCContext.Provider>
  )
}

function ExecutiveView({ activeCount }: { activeCount: number }) {
  const sentimentData = [
    { month: "Apr", score: 7.6 },
    { month: "May", score: 7.9 },
    { month: "Jun", score: 8.0 },
    { month: "Jul", score: 8.1 },
    { month: "Aug", score: 8.2 },
    { month: "Sep", score: 8.2 },
  ]

  const featureData = [
    { name: "WhatsApp API (IN)", count: 42 },
    { name: "UPI status", count: 35 },
    { name: "Hinglish", count: 33 },
    { name: "ONDC catalog", count: 28 },
    { name: "GST invoices", count: 24 },
    { name: "Vernacular", count: 22 },
  ]

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI title="Company Sentiment Score" value="8.2/10" trend="+0.3" color="text-[#22c55e]" />
        <KPI title="Active POCs" value={String(activeCount)} trend="+12 new this month" color="text-[#667eea]" />
        <KPI title="Average Deal Cycle" value="45 days" trend="-5 days" color="text-[#22c55e]" />
        <KPI title="WhatsApp Engagement Rate" value="78%" trend="+3%" color="text-[#22c55e]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[6, 10]} />
                  <RTooltip />
                  <Line type="monotone" dataKey="score" stroke="#667eea" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Feature Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <RTooltip />
                  <Legend />
                  <Bar dataKey="count" name="Mentions" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <POCPriorityTable />

      {/* <IndustryInsights /> */}
    </div>
  )
}

function AEViewPlaceholder() {
  return (
    <div className="rounded border border-dashed border-muted-foreground/20 p-8 text-center text-sm text-muted-foreground">
      AE View: Kanban, Meeting Insights, My POCs (next task)
    </div>
  )
}

function ManagerViewPlaceholder() {
  return (
    <div className="rounded border border-dashed border-muted-foreground/20 p-8 text-center text-sm text-muted-foreground">
      Manager View: Team metrics, AE cards, Pipeline by industry (next task)
    </div>
  )
}

function KPI({ title, value, trend, color }: { title: string; value: string; trend: string; color?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-semibold", color)}>{value}</div>
        <div className="text-xs text-muted-foreground">{trend}</div>
      </CardContent>
    </Card>
  )
}

function POCPriorityTable() {
  const { records } = usePOCContext()
  type SortKey = "company" | "sector" | "dealSizeINR" | "stage" | "city" | "sentiment" | "ae"
  const [sortKey, setSortKey] = React.useState<SortKey>("dealSizeINR")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc")
  const [page, setPage] = React.useState(1)
  const pageSize = 8

  const sorted = React.useMemo(() => {
    const factor = sortDir === "asc" ? 1 : -1
    return [...records].sort((a, b) => {
      const A = a[sortKey]
      const B = b[sortKey]
      if (typeof A === "number" && typeof B === "number") return (A - B) * factor
      return String(A).localeCompare(String(B)) * factor
    })
  }, [records, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const start = (page - 1) * pageSize
  const pageRows = sorted.slice(start, start + pageSize)

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(1)
  }

  function rowTone(sentiment: POCRecord["sentiment"]) {
    switch (sentiment) {
      case "At-Risk":
        return "bg-[#ef4444]/10"
      case "Engaged":
        return "bg-[#eab308]/10"
      case "Progressing":
        return "bg-[#22c55e]/10"
    }
  }

  function lastContactFromIndex(i: number) {
    const d = new Date()
    d.setDate(d.getDate() - (i % 14))
    return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(d)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>POC Priority Table</CardTitle>
        <div className="text-xs text-muted-foreground">Sortable • {records.length} items</div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <Th onClick={() => toggleSort("company")} label="Company" active={sortKey === "company"} dir={sortDir} />
              <Th onClick={() => toggleSort("sector")} label="Sector" active={sortKey === "sector"} dir={sortDir} />
              <Th
                onClick={() => toggleSort("dealSizeINR")}
                label="Deal Size (₹)"
                active={sortKey === "dealSizeINR"}
                dir={sortDir}
              />
              <Th onClick={() => toggleSort("stage")} label="Stage" active={sortKey === "stage"} dir={sortDir} />
              <th className="py-2 px-2 text-left">Last Contact</th>
              <Th onClick={() => toggleSort("city")} label="City" active={sortKey === "city"} dir={sortDir} />
              <Th
                onClick={() => toggleSort("sentiment")}
                label="Sentiment"
                active={sortKey === "sentiment"}
                dir={sortDir}
              />
              <Th onClick={() => toggleSort("ae")} label="AE" active={sortKey === "ae"} dir={sortDir} />
              <th className="py-2 px-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={r.company} className={cn("border-b", rowTone(r.sentiment))}>
                <td className="py-2 px-2">{r.company}</td>
                <td className="py-2 px-2">{r.sector}</td>
                <td className="py-2 px-2 font-medium">{formatINR(r.dealSizeINR)}</td>
                <td className="py-2 px-2">{r.stage}</td>
                <td className="py-2 px-2">{lastContactFromIndex(i + start)}</td>
                <td className="py-2 px-2">{r.city}</td>
                <td className="py-2 px-2">
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-xs",
                      r.sentiment === "At-Risk" && "bg-[#ef4444]/20 text-[#ef4444]",
                      r.sentiment === "Engaged" && "bg-[#eab308]/20 text-[#a16207]",
                      r.sentiment === "Progressing" && "bg-[#22c55e]/20 text-[#15803d]",
                    )}
                  >
                    {r.sentiment}
                  </span>
                </td>
                <td className="py-2 px-2">{r.ae}</td>
                <td className="py-2 px-2">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">
                      View Insights
                    </Button>
                    <Button size="sm" className="bg-[#FF6B35] hover:bg-[#e65f2f] text-white" asChild>
                      <Link
                        href={
                          `/tools/whatsapp-composer?template=roi-followup` +
                          `&company=${encodeURIComponent(r.company)}` +
                          `&aeName=${encodeURIComponent(r.ae)}` +
                          `&amount=${encodeURIComponent(String(Math.round(r.dealSizeINR / 12)))}` +
                          `&hinglish=1`
                        }
                      >
                        WhatsApp Follow-up
                      </Link>
                    </Button>
                    <Button size="sm" variant="secondary">
                      Schedule Meeting
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Th({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: "asc" | "desc"
  onClick: () => void
}) {
  return (
    <th
      role="button"
      onClick={onClick}
      className={cn(
        "py-2 px-2 text-left select-none",
        active ? "text-foreground" : "text-muted-foreground",
        "hover:text-foreground",
      )}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <div className="inline-flex items-center gap-1">
        <span>{label}</span>
        {active && <span className="text-xs">{dir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  )
}

function IndustryInsights() {
  const { records } = usePOCContext()
  type StageOrder = { [k in POCRecord["stage"]]: number }
  const stageOrder: StageOrder = {
    Discovery: 1,
    Proposal: 2,
    Negotiation: 3,
    Pilot: 4,
    Contract: 5,
  }

  const grouped = React.useMemo(() => {
    const map = new Map<
      POCRecord["sector"],
      { sector: POCRecord["sector"]; total: number; avgDeal: number; avgStage: number }
    >()
    for (const r of records) {
      const prev = map.get(r.sector) ?? { sector: r.sector, total: 0, avgDeal: 0, avgStage: 0 }
      const total = prev.total + 1
      const avgDeal = (prev.avgDeal * prev.total + r.dealSizeINR) / total
      const avgStage = (prev.avgStage * prev.total + stageOrder[r.stage]) / total
      map.set(r.sector, { sector: r.sector, total, avgDeal, avgStage })
    }
    return Array.from(map.values())
  }, [records])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grouped.map((g) => {
            const conversionRate = Math.round((g.avgStage / 5) * 100)
            return (
              <div key={g.sector} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{g.sector}</div>
                  <span className="text-xs text-muted-foreground">{g.total} POCs</span>
                </div>
                <div className="mt-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Deal</span>
                    <span className="font-medium">{formatINR(Math.round(g.avgDeal))}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground">Conversion</span>
                    <span className="font-medium text-[#22c55e]">{conversionRate}%</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-[#667eea]"
                    style={{ width: `${conversionRate}%` }}
                    aria-hidden
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export { usePOCContext }
