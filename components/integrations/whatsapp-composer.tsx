"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type TemplateKey = "meeting-reminder" | "roi-followup" | "festival-greeting"

const TEMPLATES: Record<TemplateKey, string> = {
  "meeting-reminder": "Hi {name}, quick reminder for our call on {date} at {time}. See you! – {aeName} from {company}",
  "roi-followup":
    "Hi {name}, following up on ROI: estimated savings ₹{amount}/mo for {company}. Shall we plan a quick chat?",
  "festival-greeting":
    "Namaste {name}! Wishing you a very Happy {festival}. May this season bring growth for {company}!",
}

const TEMPLATES_HINGLISH: Record<TemplateKey, string> = {
  "meeting-reminder":
    "Hi {name}, ek chhota reminder – kal {date} ko {time} call hai. Milte hain! – {aeName}, {company}",
  "roi-followup": "Hi {name}, ROI update: approx ₹{amount}/mahina bachat {company} ke liye. Jaldi ek short call karen?",
  "festival-greeting":
    "Namaste {name}! {festival} ki hardik shubhkamnayein. Is season mein {company} ko aur growth mile!",
}

function normalizeIndianPhone(input: string): string {
  const digits = (input || "").replace(/\D/g, "")
  // Add default +91 if a 10-digit Indian mobile number
  if (digits.length === 10) return `91${digits}`
  if (digits.startsWith("91")) return digits
  return digits // fallback as-is; wa.me supports various country codes if provided
}

function fillTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl
    .replaceAll("{name}", vars.name || "")
    .replaceAll("{date}", vars.date || "")
    .replaceAll("{time}", vars.time || "")
    .replaceAll("{aeName}", vars.aeName || "")
    .replaceAll("{company}", vars.company || "")
    .replaceAll("{amount}", vars.amount || "")
    .replaceAll("{festival}", vars.festival || "")
}

export default function WhatsAppComposer({
  className,
  defaultTemplate = "meeting-reminder",
}: {
  className?: string
  defaultTemplate?: TemplateKey
}) {
  const [template, setTemplate] = useState<TemplateKey>(defaultTemplate)
  const [hinglish, setHinglish] = useState(false)

  const [vars, setVars] = useState({
    phone: "",
    name: "",
    date: "",
    time: "",
    aeName: "",
    company: "",
    amount: "",
    festival: "",
  })

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const t = params.get("template") as TemplateKey | null
      if (t && (t === "meeting-reminder" || t === "roi-followup" || t === "festival-greeting")) {
        setTemplate(t)
      }
      const h = params.get("hinglish")
      if (h && ["1", "true", "yes", "on"].includes(h.toLowerCase())) setHinglish(true)

      const keys = ["phone", "name", "date", "time", "aeName", "company", "amount", "festival"] as const
      setVars((prev) => {
        const next = { ...prev }
        for (const k of keys) {
          const v = params.get(k)
          if (v != null) (next as any)[k] = v
        }
        return next
      })
    } catch {
      // ignore parse errors
    }
  }, [])

  const baseTemplate = hinglish ? TEMPLATES_HINGLISH[template] : TEMPLATES[template]

  const preview = useMemo(() => fillTemplate(baseTemplate, vars), [baseTemplate, vars])

  const waHref = useMemo(() => {
    const phone = normalizeIndianPhone(vars.phone)
    const encoded = encodeURIComponent(preview)
    return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`
  }, [vars.phone, preview])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(preview)
    } catch {
      // ignore
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-pretty">WhatsApp Template Composer</CardTitle>
        <CardDescription>
          Create a personalized message and open WhatsApp to send. This uses a mock flow via wa.me links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={template} onValueChange={(v) => setTemplate(v as TemplateKey)}>
                <SelectTrigger aria-label="Select template">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting-reminder">Meeting Reminder</SelectItem>
                  <SelectItem value="roi-followup">ROI Follow-up</SelectItem>
                  <SelectItem value="festival-greeting">Festival Greeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <Label>Use Hinglish</Label>
                <p className="text-xs text-muted-foreground">Friendlier tone for Indian audiences</p>
              </div>
              <Switch checked={hinglish} onCheckedChange={setHinglish} aria-label="Toggle Hinglish" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Recipient Phone (optional)</Label>
              <Input
                id="phone"
                placeholder="e.g. 9876543210 or 919876543210"
                value={vars.phone}
                onChange={(e) => setVars((s) => ({ ...s, phone: e.target.value }))}
                inputMode="tel"
              />
              <p className="text-xs text-muted-foreground">
                If 10 digits, we add +91 automatically. Otherwise include country code.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={vars.name} onChange={(e) => setVars((s) => ({ ...s, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={vars.company}
                  onChange={(e) => setVars((s) => ({ ...s, company: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  placeholder="DD-MM-YYYY"
                  value={vars.date}
                  onChange={(e) => setVars((s) => ({ ...s, date: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  placeholder="IST, e.g. 3:30 PM"
                  value={vars.time}
                  onChange={(e) => setVars((s) => ({ ...s, time: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aeName">Your Name (AE)</Label>
                <Input
                  id="aeName"
                  value={vars.aeName}
                  onChange={(e) => setVars((s) => ({ ...s, aeName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  inputMode="numeric"
                  value={vars.amount}
                  onChange={(e) => setVars((s) => ({ ...s, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="festival">Festival</Label>
                <Input
                  id="festival"
                  placeholder="Diwali, Holi, etc."
                  value={vars.festival}
                  onChange={(e) => setVars((s) => ({ ...s, festival: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <Textarea value={preview} readOnly rows={6} className="resize-none" />
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={handleCopy}>
                  Copy
                </Button>
                <Button asChild>
                  <a href={waHref} target="_blank" rel="noopener noreferrer">
                    Open WhatsApp
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This is a mock workflow via wa.me links. No actual API call is made.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
