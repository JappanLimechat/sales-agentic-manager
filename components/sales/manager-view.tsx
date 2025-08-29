"use client"

import React from "react"
import type { POCRecord } from "@/data/pocs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatINR } from "@/lib/india"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, Legend, AreaChart, Area } from "recharts"

export function ManagerView({ records }: { records: POCRecord[] }) {
  // Calculate key metrics
  const overallMetrics = React.useMemo(() => {
    const sentimentScore: Record<POCRecord["sentiment"], number> = {
      "At-Risk": 0.4,
      Engaged: 0.7,
      Progressing: 0.85,
    }
    
    const totalSentiment = records.reduce((sum, r) => sum + sentimentScore[r.sentiment], 0)
    const avgSentiment = Math.round((totalSentiment / records.length) * 100)
    
    // Meeting quality based on sentiment
    const meetingQuality = Math.round(avgSentiment * 0.9) // Slightly lower than sentiment
    
    // Feature requests trend (mock data)
    const featureRequests = 24
    
    // Competitor mentions (mock)
    const competitorMentions = 8
    
    return {
      meetingQuality,
      avgSentiment,
      featureRequests,
      competitorMentions,
    }
  }, [records])

  // Feature request trends over time (mock data)
  const featureTrends = React.useMemo(() => [
    { month: "Oct", requests: 18, sentiment: 72 },
    { month: "Nov", requests: 22, sentiment: 75 },
    { month: "Dec", requests: 24, sentiment: 78 },
    { month: "Jan", requests: 28, sentiment: 82 },
  ], [])

  // Competitor analysis
  const competitorData = React.useMemo(() => [
    { competitor: "Intercom", mentions: 5, sentiment: "Price concerns" },
    { competitor: "Freshworks", mentions: 3, sentiment: "Feature gaps" },
    { competitor: "Zendesk", mentions: 2, sentiment: "Complex setup" },
  ], [])

  // Prospect blockers
  const blockers = React.useMemo(() => [
    { blocker: "Integration complexity", count: 12, severity: "high" },
    { blocker: "WhatsApp pricing", count: 8, severity: "medium" },
    { blocker: "Timeline concerns", count: 6, severity: "medium" },
    { blocker: "Feature gaps", count: 4, severity: "low" },
  ], [])

  // AI Generated Summary
  const aiSummary = `Based on recent data analysis, our sales performance shows strong momentum with 82% company sentiment score and 78% meeting quality index. Key opportunities: Focus on simplifying integration messaging (12 prospects cited complexity), competitive pricing strategy against Intercom, and accelerating feature delivery timeline. Recommend prioritizing technical content for demos and establishing integration partnerships.`

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Meeting Quality Index</p>
                <p className="text-2xl font-bold text-[#22c55e]">{overallMetrics.meetingQuality}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                📊
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Company Sentiment</p>
                <p className="text-2xl font-bold text-[#667eea]">{overallMetrics.avgSentiment}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#667eea]/20 flex items-center justify-center">
                💭
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feature Requests</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{overallMetrics.featureRequests}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                🚀
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Competitor Mentions</p>
                <p className="text-2xl font-bold text-[#ef4444]">{overallMetrics.competitorMentions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center">
                ⚔️
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Request Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Request & Sentiment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={featureTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RTooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stackId="1"
                  stroke="#FF6B35" 
                  fill="#FF6B35" 
                  fillOpacity={0.6}
                  name="Feature Requests"
                />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  name="Sentiment %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis & Prospect Blockers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Competitor Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorData.map((comp, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{comp.competitor}</p>
                    <p className="text-sm text-muted-foreground">{comp.sentiment}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{comp.mentions}</p>
                    <p className="text-xs text-muted-foreground">mentions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prospect Blockers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blockers.map((blocker, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{blocker.blocker}</p>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      blocker.severity === "high" && "bg-red-100 text-red-800",
                      blocker.severity === "medium" && "bg-yellow-100 text-yellow-800",
                      blocker.severity === "low" && "bg-green-100 text-green-800"
                    )}>
                      {blocker.severity} priority
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{blocker.count}</p>
                    <p className="text-xs text-muted-foreground">prospects</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Generated Summary */}
      <Card>
        <CardHeader>
          <CardTitle>AI Generated Insights Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">{aiSummary}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] text-xs rounded-full">Action Items Generated</span>
            <span className="px-3 py-1 bg-[#667eea]/20 text-[#667eea] text-xs rounded-full">Updated 2 hours ago</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
