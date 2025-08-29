'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatINR } from '@/lib/india';
import { cn } from '@/lib/utils';
import type { POCRecord } from '@/data/pocs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip } from 'recharts';

export function AEView({ records }: { records: POCRecord[] }) {
  // Calculate AE metrics
  const aeMetrics = React.useMemo(() => {
    const sentimentScore: Record<POCRecord["sentiment"], number> = {
      "At-Risk": 0.4,
      Engaged: 0.7,
      Progressing: 0.85,
    }
    
    const totalSentiment = records.reduce((sum, r) => sum + sentimentScore[r.sentiment], 0)
    const avgSentiment = Math.round((totalSentiment / records.length) * 100)
    const activePOCs = records.length
    
    // Calculate average deal cycle (mock calculation)
    const avgDealCycle = Math.round(records.reduce((sum, r) => {
      const stageOrder: Record<POCRecord["stage"], number> = {
        Discovery: 30,
        Proposal: 45,
        Negotiation: 60,
        Pilot: 75,
        Contract: 90,
      }
      return sum + stageOrder[r.stage]
    }, 0) / records.length)
    
    return {
      avgSentiment,
      activePOCs,
      avgDealCycle,
    }
  }, [records])

  // Sentiment trend data (mock)
  const sentimentTrend = React.useMemo(() => [
    { week: "Week 1", sentiment: 72 },
    { week: "Week 2", sentiment: 75 },
    { week: "Week 3", sentiment: 78 },
    { week: "Week 4", sentiment: aeMetrics.avgSentiment },
  ], [aeMetrics.avgSentiment])

  // POC Priority data with enhanced information
  const pocPriority = React.useMemo(() => 
    records.slice(0, 8).map((r, i) => ({
      ...r,
      lastContact: ["2 days ago", "5 days ago", "1 week ago", "3 days ago", "1 day ago", "4 days ago", "6 days ago", "2 weeks ago"][i],
      nextAction: ["Follow up proposal", "Schedule demo", "Send contract", "Technical call", "Pricing discussion", "Implementation planning", "Final approval", "Onboarding prep"][i]
    })), [records])

  // Follow-up reminders data
  const followupReminders = React.useMemo(() => [
    {
      company: "Reliance Retail",
      pocName: "Amit Kumar",
      aeName: "Priya Sharma",
      channel: "WhatsApp",
      message: "Hi Amit, following up on our API integration discussion. Can we schedule a tech call this week?",
      sentDate: "Jan 28, 10:30 AM",
      nextFollowup: "Jan 30, 2:00 PM",
      status: "Sent"
    },
    {
      company: "Flipkart",
      pocName: "Rohit Singh",
      aeName: "Priya Sharma", 
      channel: "Email",
      message: "Proposal for seller onboarding automation with regional language support",
      sentDate: "Jan 27, 4:15 PM",
      nextFollowup: "Jan 29, 10:00 AM",
      status: "Delivered"
    },
    {
      company: "Tata Digital",
      pocName: "Sneha Patel",
      aeName: "Priya Sharma",
      channel: "WhatsApp",
      message: "Sharing the pricing breakdown for enterprise plan as discussed",
      sentDate: "Jan 26, 11:20 AM", 
      nextFollowup: "Jan 31, 9:00 AM",
      status: "Read"
    },
  ], [])

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Company Sentiment</p>
                <p className="text-2xl font-bold text-[#667eea]">{aeMetrics.avgSentiment}%</p>
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
                <p className="text-sm text-muted-foreground">Active POCs</p>
                <p className="text-2xl font-bold text-[#22c55e]">{aeMetrics.activePOCs}</p>
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
                <p className="text-sm text-muted-foreground">Avg Deal Cycle</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{aeMetrics.avgDealCycle}d</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
                ⏰
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trend (Last 4 Weeks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[60, 100]} />
                <RTooltip />
                <Line 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: "#667eea", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* POC Priority Table */}
      <Card>
        <CardHeader>
          <CardTitle>POC Priority Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Deal Size</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>AE</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pocPriority.map((poc, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{poc.company}</TableCell>
                    <TableCell>{formatINR(poc.dealSizeINR)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{poc.stage}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{poc.lastContact}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          poc.sentiment === 'At-Risk' && 'bg-red-100 text-red-800',
                          poc.sentiment === 'Engaged' && 'bg-yellow-100 text-yellow-800', 
                          poc.sentiment === 'Progressing' && 'bg-green-100 text-green-800'
                        )}
                      >
                        {poc.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell>{poc.ae}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-xs">
                        {poc.nextAction}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Follow-up Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Follow-up Reminders & Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {followupReminders.map((reminder, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{reminder.company}</h4>
                    <p className="text-sm text-muted-foreground">POC: {reminder.pocName} • AE: {reminder.aeName}</p>
                  </div>
                  <div className="text-right text-sm">
                    <Badge 
                      className={cn(
                        reminder.channel === 'WhatsApp' && 'bg-green-100 text-green-800',
                        reminder.channel === 'Email' && 'bg-blue-100 text-blue-800'
                      )}
                    >
                      {reminder.channel}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded text-sm">
                  <p>{reminder.message}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Sent: {reminder.sentDate}</span>
                  <span>Next Follow-up: {reminder.nextFollowup}</span>
                  <Badge 
                    variant="outline"
                    className={cn(
                      reminder.status === 'Sent' && 'border-yellow-500 text-yellow-700',
                      reminder.status === 'Delivered' && 'border-blue-500 text-blue-700',
                      reminder.status === 'Read' && 'border-green-500 text-green-700'
                    )}
                  >
                    {reminder.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Meeting Insights */}
      <MeetingInsights />
    </div>
  );
}

function MeetingInsights() {
  const examples = [
    {
      company: 'Reliance Retail',
      language: 'Regional + Hindi',
      summary: 'Need 10 regional languages by Q2; focus on catalog automation.',
      objections: ['Integration effort', 'Timeline risk'],
      features: ['Vernacular', 'ONDC catalog'],
      next: 'Share phased rollout plan and sample Hindi/Kannada scripts.',
      sentiment: 'Engaged',
    },
    {
      company: 'Flipkart',
      language: 'English',
      summary: 'Seller onboarding automation for Bharat users; peak season scaling.',
      objections: ['WhatsApp cost'],
      features: ['Hinglish', 'UPI status'],
      next: 'Quantify ROI with WhatsApp session pricing; provide template copy.',
      sentiment: 'Progressing',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Meeting Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {examples.map((m, i) => (
            <AccordionItem key={i} value={`m-${i}`}>
              <AccordionTrigger>
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-medium">{m.company}</span>
                  <span className="text-xs text-muted-foreground">{m.language}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <Row label="Summary" value={m.summary} />
                  <Row label="Objections" value={m.objections.join(', ')} />
                  <Row label="Feature requests" value={m.features.join(', ')} />
                  <Row label="Next steps" value={m.next} />
                  <Row label="Sentiment" value={m.sentiment} tone={m.sentiment} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'At-Risk' | 'Engaged' | 'Progressing' }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          'col-span-2 text-sm',
          tone === 'Engaged' && 'text-[#a16207]',
          tone === 'Progressing' && 'text-[#15803d]',
          tone === 'At-Risk' && 'text-[#ef4444]',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function MyPOCs({ records }: { records: POCRecord[] }) {
  return (
    <Card className='overflow-y-auto'>
      <CardHeader>
        <CardTitle>My POCs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[420px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pr-2">
            {records.slice(0, 9).map(r => {
              const stageIndex = ['Discovery', 'Proposal', 'Negotiation', 'Pilot', 'Contract'].indexOf(r.stage as any) + 1;
              const pct = Math.min(100, stageIndex * 20);
              return (
                <div key={r.company} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.company}</div>
                    <span className="text-xs text-muted-foreground">{r.city}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {r.sector} • AE: {r.ae}
                  </div>
                  <div className="mt-2 text-sm font-medium">{formatINR(r.dealSizeINR)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded px-2 py-0.5 text-xs',
                        r.sentiment === 'At-Risk' && 'bg-[#ef4444]/20 text-[#ef4444]',
                        r.sentiment === 'Engaged' && 'bg-[#eab308]/20 text-[#a16207]',
                        r.sentiment === 'Progressing' && 'bg-[#22c55e]/20 text-[#15803d]',
                      )}
                    >
                      {r.sentiment}
                    </span>
                    <Button size="sm" variant="secondary" onClick={() => openWhatsApp(r.company)}>
                      Send WhatsApp
                    </Button>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-1.5 rounded-full bg-[#667eea]" style={{ width: `${pct}%` }} aria-hidden />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Progress: {pct}%</div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function openWhatsApp(company: string) {
  const text = encodeURIComponent(`Hi ${company} team, following up on our discussion. Can we schedule next steps?`);
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
}

// simple hook to fetch records from the POC context in dashboard-shell via DOM event bridge
