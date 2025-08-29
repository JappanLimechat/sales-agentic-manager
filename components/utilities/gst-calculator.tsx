"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { formatINR } from "@/lib/india"

export function GSTCalculator() {
  const [base, setBase] = useState<number>(1000000)
  const [rate, setRate] = useState<number>(18)

  const { gst, total } = useMemo(() => {
    const gst = Math.max(0, base) * (Math.max(0, rate) / 100)
    return { gst, total: Math.max(0, base) + gst }
  }, [base, rate])

  function shareWhatsApp() {
    const text = `Quote (INR): Base ${formatINR(base)}, GST @${rate}% ${formatINR(gst)}, Total ${formatINR(total)}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="base">Deal Value (before GST)</Label>
        <Input id="base" type="number" value={base} onChange={(e) => setBase(Number(e.target.value || 0))} min={0} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rate">GST Rate %</Label>
        <Input id="rate" type="number" value={rate} onChange={(e) => setRate(Number(e.target.value || 0))} min={0} />
      </div>

      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">GST Amount</div>
        <div className="text-lg font-semibold">{formatINR(Math.round(gst))}</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">Total (incl. GST)</div>
        <div className="text-lg font-semibold">{formatINR(Math.round(total))}</div>
      </div>

      <div className="sm:col-span-2 flex items-center gap-2">
        <Button className="bg-[#FF6B35] hover:bg-[#e65f2f]" onClick={shareWhatsApp}>
          Share on WhatsApp
        </Button>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${formatINR(total)}`)}>
          Copy Total
        </Button>
      </div>
    </div>
  )
}
