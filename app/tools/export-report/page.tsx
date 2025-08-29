"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toCSV, downloadText, formatINR, formatIST } from "@/lib/export"

// Demo dataset (self-contained). Replace with your POCs later if desired.
type POC = {
  company: string
  industry: string
  region: "North" | "South" | "East" | "West"
  stage: "New" | "In Discussion" | "Negotiation" | "Won" | "Lost"
  dealValue: number
  sentiment: "Positive" | "Neutral" | "Negative"
  lastMeeting: string // ISO string
}

const demo: POC[] = [
  {
    company: "Reliance Retail",
    industry: "Retail",
    region: "West",
    stage: "In Discussion",
    dealValue: 8500000,
    sentiment: "Positive",
    lastMeeting: "2025-07-15T10:30:00Z",
  },
  {
    company: "Tata Motors",
    industry: "Automotive",
    region: "West",
    stage: "Negotiation",
    dealValue: 12500000,
    sentiment: "Neutral",
    lastMeeting: "2025-08-01T07:00:00Z",
  },
  {
    company: "HDFC Bank",
    industry: "BFSI",
    region: "West",
    stage: "New",
    dealValue: 4000000,
    sentiment: "Positive",
    lastMeeting: "2025-07-10T11:00:00Z",
  },
  {
    company: "ITC Foods",
    industry: "FMCG",
    region: "East",
    stage: "In Discussion",
    dealValue: 5200000,
    sentiment: "Negative",
    lastMeeting: "2025-08-05T09:45:00Z",
  },
  {
    company: "Zomato",
    industry: "Food Tech",
    region: "North",
    stage: "Negotiation",
    dealValue: 3100000,
    sentiment: "Neutral",
    lastMeeting: "2025-08-12T12:30:00Z",
  },
]

export default function Page() {
  const now = useMemo(() => new Date(), [])
  const totals = useMemo(() => {
    const pipeline = demo.reduce((sum, d) => sum + d.dealValue, 0)
    const byIndustry = Array.from(
      demo.reduce<Map<string, number>>(
        (acc, d) => acc.set(d.industry, (acc.get(d.industry) || 0) + d.dealValue),
        new Map(),
      ),
    ).map(([industry, value]) => ({ industry, value }))
    return { pipeline, byIndustry }
  }, [])

  function exportPOCs() {
    const rows = demo.map((d) => ({
      Company: d.company,
      Industry: d.industry,
      Region: d.region,
      Stage: d.stage,
      "Deal Value (INR)": formatINR(d.dealValue),
      Sentiment: d.sentiment,
      "Last Meeting (IST)": formatIST(new Date(d.lastMeeting)),
    }))
    const csv = toCSV(rows)
    downloadText(`poc-report-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  function exportSummary() {
    const rows = [
      { Metric: "Generated At", Value: formatIST(now) },
      { Metric: "Total Pipeline", Value: formatINR(totals.pipeline) },
      ...totals.byIndustry.map((b) => ({ Metric: `Industry: ${b.industry}`, Value: formatINR(b.value) })),
    ]
    const csv = toCSV(rows)
    downloadText(`summary-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  function printReport() {
    window.print()
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-pretty">Report Export</h1>
        <div className="text-sm text-muted-foreground">Indian formats (INR, IST)</div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Quick Actions</CardTitle>
          <CardDescription>Export CSVs or print a clean report preview.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button onClick={exportPOCs}>Export POC Table CSV</Button>
          <Button variant="secondary" onClick={exportSummary}>
            Export Summary CSV
          </Button>
          <Button variant="outline" onClick={printReport}>
            Print Report
          </Button>
        </CardContent>
      </Card>

      <Card className="print:block">
        <CardHeader>
          <CardTitle className="text-pretty">Print-Friendly Report</CardTitle>
          <CardDescription>Use your browser’s Print to save as PDF.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Generated At</div>
              <div className="text-lg font-semibold">{formatIST(now)}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Total Pipeline</div>
              <div className="text-lg font-semibold">{formatINR(totals.pipeline)}</div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Records</div>
              <div className="text-lg font-semibold">{demo.length}</div>
            </div>
          </div>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Pipeline by Industry</h2>
            <ul className="grid gap-2 md:grid-cols-2">
              {totals.byIndustry.map((b) => (
                <li key={b.industry} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{b.industry}</span>
                  <span className="font-medium">{formatINR(b.value)}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">POC Table (Preview)</h2>
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-2 border-b p-2 text-xs text-muted-foreground">
                <div>Company</div>
                <div>Industry</div>
                <div>Region</div>
                <div>Stage</div>
                <div className="text-right">Deal Value</div>
                <div className="text-right">Last Meeting</div>
              </div>
              {demo.map((d) => (
                <div key={d.company} className="grid grid-cols-6 gap-2 p-2 text-sm">
                  <div>{d.company}</div>
                  <div>{d.industry}</div>
                  <div>{d.region}</div>
                  <div>{d.stage}</div>
                  <div className="text-right">{formatINR(d.dealValue)}</div>
                  <div className="text-right">{formatIST(new Date(d.lastMeeting))}</div>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>

      <section className="text-xs text-muted-foreground">
        Colors used: primary (indigo), neutrals (background/foreground/gray), accents (saffron/orange and green). Total:
        5 colors.
      </section>
    </main>
  )
}
