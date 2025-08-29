"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatINR } from "@/lib/india"

export function ROICalculator() {
  const [monthlyConversations, setMonthlyConversations] = useState(50000)
  const [engagementRate, setEngagementRate] = useState(0.78) // 78%
  const [leadConversion, setLeadConversion] = useState(0.06) // 6%
  const [avgDealINR, setAvgDealINR] = useState(250000) // ₹2.5L
  const [months, setMonths] = useState(12)
  const [costPerConversation, setCostPerConversation] = useState(0.72) // INR
  const [includeGST, setIncludeGST] = useState(true)

  const calc = useMemo(() => {
    const convos = Math.max(0, monthlyConversations) * Math.max(1, months)
    const engaged = convos * clamp(engagementRate, 0, 1)
    const leads = engaged * clamp(leadConversion, 0, 1)
    const revenue = leads * Math.max(0, avgDealINR)
    let cost = convos * Math.max(0, costPerConversation)
    if (includeGST) cost = cost * 1.18
    const profit = revenue - cost
    const roiPct = cost > 0 ? (profit / cost) * 100 : 0
    return { convos, engaged, leads, revenue, cost, profit, roiPct }
  }, [monthlyConversations, engagementRate, leadConversion, avgDealINR, months, costPerConversation, includeGST])

  function shareWhatsApp() {
    const text = [
      `ROI Estimate (INR)`,
      `Conversations: ${calc.convos.toLocaleString("en-IN")}`,
      `Revenue: ${formatINR(Math.round(calc.revenue))}`,
      `Cost${includeGST ? " (incl. GST)" : ""}: ${formatINR(Math.round(calc.cost))}`,
      `Profit: ${formatINR(Math.round(calc.profit))}`,
      `ROI: ${calc.roiPct.toFixed(1)}%`,
    ].join("\n")
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Monthly Conversations" value={monthlyConversations} onChange={setMonthlyConversations} />
        <FieldPercent label="Engagement Rate" value={engagementRate} onChange={setEngagementRate} />
        <FieldPercent label="Lead Conversion" value={leadConversion} onChange={setLeadConversion} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Average Deal (₹)" value={avgDealINR} onChange={setAvgDealINR} />
        <Field label="Months" value={months} onChange={setMonths} />
        <Field
          label="Cost / Conversation (₹)"
          value={costPerConversation}
          onChange={setCostPerConversation}
          step="0.01"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="include-gst"
          type="checkbox"
          checked={includeGST}
          onChange={(e) => setIncludeGST(e.target.checked)}
        />
        <Label htmlFor="include-gst">Include 18% GST in costs</Label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Total Conversations" value={calc.convos.toLocaleString("en-IN")} />
        <Result label="Estimated Leads" value={calc.leads.toLocaleString("en-IN")} />
        <Result label="Engaged Users" value={calc.engaged.toLocaleString("en-IN")} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Revenue" value={formatINR(Math.round(calc.revenue))} />
        <Result label={`Cost${includeGST ? " (incl. GST)" : ""}`} value={formatINR(Math.round(calc.cost))} />
        <Result label="Profit" value={formatINR(Math.round(calc.profit))} />
      </div>
      <div className="text-lg font-semibold">ROI: {calc.roiPct.toFixed(1)}%</div>

      <div className="flex items-center gap-2">
        <Button className="bg-[#FF6B35] hover:bg-[#e65f2f]" onClick={shareWhatsApp}>
          Share on WhatsApp
        </Button>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${calc.roiPct.toFixed(1)}%`)}>
          Copy ROI
        </Button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  step?: string
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value || 0))} step={step} />
    </div>
  )
}

function FieldPercent({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={(value * 100).toFixed(1)}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          step="0.1"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
    </div>
  )
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
