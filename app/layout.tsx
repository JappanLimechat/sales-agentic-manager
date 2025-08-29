import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Ai SAM",
  description: "Ai Sales Agentic Manager",
  generator: "LimeChat",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} light`} style={{colorScheme: "light"}}>
      <body className="font-sans">
        <QueryProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem={false}
            disableTransitionOnChange
          >
            <Suspense fallback={null}>
              {children}
              <Analytics />
            </Suspense>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
