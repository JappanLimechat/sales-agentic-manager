"use client"

import React from "react"
import type { POCRecord } from "@/data/pocs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/india"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, Legend } from "recharts"

export function ManagerView({ records }: { records: POCRecord[] }) {
  const byRegion = React.useMemo(() => {
    const map = new Map<string, { region: string; count: number; total: number; avgStage: number }>()
    const stageOrder: Record<POCRecord["stage"], number> = {
      Discovery: 1,
      Proposal: 2,
      Negotiation: 3,
      Pilot: 4,
      Contract: 5,
    }
    for (const r of records) {
      const key = r.cityRegion
      const prev = map.get(key) ?? { region: key, count: 0, total: 0, avgStage: 0 }
      const count = prev.count + 1
      const total = prev.total + r.dealSizeINR
      const avgStage = (prev.avgStage * prev.count + stageOrder[r.stage]) / count
      map.set(key, { region: key, count, total, avgStage })
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [records])

  const byAE = React.useMemo(() => {
    const map = new Map<string, { ae: string; count: number; total: number; avgStage: number; quality: number }>()
    const stageOrder: Record<POCRecord["stage"], number> = {
      Discovery: 1,
      Proposal: 2,
      Negotiation: 3,
      Pilot: 4,
      Contract: 5,
    }
    const sentimentScore: Record<POCRecord["sentiment"], number> = {
      "At-Risk": 0.4,
      Engaged: 0.7,
      Progressing: 0.85,
    }
    for (const r of records) {
      const key = r.ae
      const prev = map.get(key) ?? { ae: key, count: 0, total: 0, avgStage: 0, quality: 0 }
      const count = prev.count + 1
      const total = prev.total + r.dealSizeINR
      const avgStage = (prev.avgStage * prev.count + stageOrder[r.stage]) / count
      const quality = (prev.quality * prev.count + sentimentScore[r.sentiment]) / count
      map.set(key, { ae: key, count, total, avgStage, quality })
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [records])

  const bySectorConv = React.useMemo(() => {
    const map = new Map<string, { sector: string; conv: number; total: number }>()
    const stageOrder: Record<POCRecord["stage"], number> = {
      Discovery: 1,
      Proposal: 2,
      Negotiation: 3,
      Pilot: 4,
      Contract: 5,
    }
    const counts = new Map<string, { s: number; n: number }>()
    for (const r of records) {
      const key = r.sector
      const prev = counts.get(key) ?? { s: 0, n: 0 }
      counts.set(key, { s: prev.s + stageOrder[r.stage], n: prev.n + 1 })
    }
    for (const [sector, { s, n }] of counts.entries()) {
      const conv = Math.round((s / n / 5) * 100)
      map.set(sector, { sector, conv, total: n })
    }
    return Array.from(map.values()).sort((a, b) => b.conv - a.conv)
  }, [records])

  return (
    <div className="grid gap-4">
      {/* Team Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance (Regional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {byRegion.map((r) => {
              const conv = Math.round((r.avgStage / 5) * 100)
              return (
                <div key={r.region} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.region}</div>
                    <span className="text-xs text-muted-foreground">{r.count} POCs</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Pipeline</span>
                      <span className="font-medium">{formatINR(r.total)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-muted-foreground">Conversion</span>
                      <span className="font-medium text-[#22c55e]">{conv}%</span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-1.5 rounded-full bg-[#667eea]" style={{ width: `${conv}%` }} aria-hidden />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AE Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Individual AE Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {byAE.map((a) => {
              const conv = Math.round((a.avgStage / 5) * 100)
              const quality = Math.round(a.quality * 100)
              return (
                <div key={a.ae} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{a.ae}</div>
                    <span className="text-xs text-muted-foreground">{a.count} POCs</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pipeline</span>
                      <span className="font-medium">{formatINR(a.total)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-muted-foreground">Conversion</span>
                      <span className="font-medium text-[#22c55e]">{conv}%</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-muted-foreground">Meeting Quality</span>
                      <span
                        className={cn(
                          "font-medium",
                          quality >= 80 ? "text-[#22c55e]" : quality >= 65 ? "text-[#eab308]" : "text-[#ef4444]",
                        )}
                      >
                        {quality}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-1.5 rounded-full bg-[#FF6B35]" style={{ width: `${quality}%` }} aria-hidden />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline by Industry */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview (Conversion by Industry)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySectorConv} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <RTooltip />
                <Legend />
                <Bar dataKey="conv" name="Conversion %" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bySectorConv.map((s) => (
              <div key={s.sector} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.sector}</div>
                  <span className="text-xs text-muted-foreground">{s.total} POCs</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Conversion</span>
                  <span className="font-medium text-[#22c55e]">{s.conv}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
