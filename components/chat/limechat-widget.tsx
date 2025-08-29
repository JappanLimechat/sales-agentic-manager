"use client"

import { useEffect, useMemo } from "react"

interface LimeChatWidgetProps {
  websiteToken?: string
  width?: number | string
  height?: number | string
  className?: string
}

export function LimeChatWidget({ 
  websiteToken = "cmfooppPp6JE6s6bhFewUxYY", 
  width = 400, 
  height = 700,
  className 
}: LimeChatWidgetProps) {
  const widgetURL = useMemo(() => {
    return `https://app.limechat.ai/widget?website_token=${websiteToken}#/`
  }, [websiteToken])

  const sendMessage = (message: string) => {
    const iframe = document.querySelector('iframe[title="limechat-widget"]')
    if (!iframe) return

    const iframeWindow = (iframe as HTMLIFrameElement).contentWindow
    if (iframeWindow) {
      iframeWindow.postMessage(message, '*')
    }
  }

  // Expose sendMessage function for external use
  useEffect(() => {
    ;(window as any).sendMessageToLimeChat = sendMessage
  }, [])

  return (
    <div className={className}>
      <iframe
        title="limechat-widget"
        width={width}
        height={height}
        src={widgetURL}
        style={{
          border: 'none',
          borderRadius: '8px',
        }}
        onLoad={() => {
          // Optional: Send message when iframe loads
          setTimeout(() => sendMessage('Hi'), 500)
        }}
      />
    </div>
  )
}