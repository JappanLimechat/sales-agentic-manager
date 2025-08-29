"use client"

import { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LimeChatWidget } from "./limechat-widget"

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
  const salesPrompts = useMemo(() => {
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
      "How to handle price objections from startups?",
      "What's our competitive advantage over Intercom?",
      "Generate demo script for e-commerce clients",
      "Create pricing proposal for enterprise clients",
      "What are common integration challenges?",
    ]
  }, [])

  const sendMessage = useCallback((message: string) => {
    console.log('sending message', message);
    
    const iframe = document.querySelector('iframe')
    if (!iframe) return

    const iframeWindow = (iframe as HTMLIFrameElement).contentWindow
    console.log("iframeWindow",iframeWindow);
    
    if (iframeWindow) {
      iframeWindow.postMessage(message, '*')
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col">
      {/* Sales Prompts Section */}
      <div className="border-b border-border px-4 py-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="sales-prompts">
            <AccordionTrigger className="text-sm font-medium">
              Sales Assistant Prompts
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {salesPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    size="sm"
                    className="justify-start cursor-pointer text-xs h-auto py-2 px-3 whitespace-normal text-left"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Widget Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        <LimeChatWidget 
          websiteToken="cmfooppPp6JE6s6bhFewUxYY"
          width="100%"
          height="100%"
          className="w-full max-w-md h-full"
        />
      </div>
    </div>
  )
}
