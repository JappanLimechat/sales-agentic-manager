"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function AssistantPanel({
  language,
  onLanguageChange,
  currentView,
  currentQuery,
}: {
  language: "EN" | "HI"
  onLanguageChange: (l: "EN" | "HI") => void
  currentView: string
  currentQuery: string
}) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Namaste! I'm your AI Sales Assistant. Ask about POCs, meetings, or get sales help.",
    },
  ])
  const [draft, setDraft] = useState("")

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem("limechat.chat")
      if (raw) {
        const { messages: m, draft: d } = JSON.parse(raw)
        if (Array.isArray(m) && m.length) setMessages(m)
        if (typeof d === "string") setDraft(d)
      }
    } catch {}
  }, [])

  // save on change
  useEffect(() => {
    try {
      localStorage.setItem("limechat.chat", JSON.stringify({ messages, draft }))
    } catch {}
  }, [messages, draft])

  const suggestions = useMemo(() => {
    return [
      "What are Reliance Retail's main concerns about implementation?",
      "Draft a follow-up email for Flipkart team in Hindi",
      "Summarize Tata Digital's requirements",
      "What features is Nykaa most interested in?",
      "Show me D2C brands close to conversion",
      "Generate ROI calculation for Myntra",
      "What did Swiggy say about API integration?",
      "Compare our pricing with Freshworks for BigBasket",
      "Create Diwali campaign proposal for Amazon India",
      "List ONDC integration queries from retailers",
    ]
  }, [])

  const onClear = useCallback(() => {
    setMessages([
      { role: "assistant", content: "Chat cleared. How can I help? Ask about POCs, meetings, or sales strategy." },
    ])
    setDraft("")
    try {
      localStorage.removeItem("limechat.chat")
    } catch {}
  }, [])

  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }, [])

  const shareWA = useCallback((text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  function send() {
    const content = draft.trim()
    if (!content) return
    setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: "Working on it... (mock)" }])
    setDraft("")
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold">AI Sales Assistant</span>
          <span className="relative inline-flex items-center">
            <span className="size-2 rounded-full bg-[#22c55e]" aria-hidden />
            <span className="sr-only">Online</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-input">
            <Button
              variant={language === "EN" ? "default" : "ghost"}
              size="sm"
              className={cn(language === "EN" ? "bg-[#667eea] text-white hover:bg-[#5a6de0]" : "")}
              onClick={() => onLanguageChange("EN")}
            >
              EN
            </Button>
            <Button
              variant={language === "HI" ? "default" : "ghost"}
              size="sm"
              className={cn(language === "HI" ? "bg-[#667eea] text-white hover:bg-[#5a6de0]" : "")}
              onClick={() => onLanguageChange("HI")}
            >
              HI
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </header>

      <div className="border-b border-border px-4 py-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="suggest">
            <AccordionTrigger>Suggested Prompts</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((s) => (
                  <Button key={s} variant="secondary" className="justify-start" onClick={() => setDraft(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] rounded-md px-3 py-2 text-sm",
                m.role === "user" ? "ml-auto bg-[#667eea] text-white" : "mr-auto bg-muted",
              )}
            >
              {m.content}
              {m.role === "assistant" && (
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copyText(m.content)}>
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => shareWA(m.content)}>
                    Share on WhatsApp
                  </Button>
                  <div className="ml-auto flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2" aria-label="thumbs up">
                      👍
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2" aria-label="thumbs down">
                      👎
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about POCs, meetings, or get sales help..."
            className="min-h-[44px] max-h-[140px]"
          />
          <div className="flex flex-col gap-2">
            <Button onClick={send} className="bg-[#FF6B35] hover:bg-[#e65f2f]">
              Send
            </Button>
            <Button variant="outline">Attach</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
