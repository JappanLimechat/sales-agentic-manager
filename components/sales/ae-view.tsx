'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { formatINR } from '@/lib/india';
import { cn } from '@/lib/utils';
import type { POCRecord, TranscriptRecord } from '@/data/pocs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip } from 'recharts';
import Link from 'next/link';
import { Copy, ExternalLink } from 'lucide-react';
import { useTranscriptData } from '@/hooks/use-transcript-data';
import { mergePOCWithTranscriptData, type EnhancedPOCRecord } from '@/utils/poc-data-merger';

export function AEView({ records }: { records: POCRecord[] }) {
  const { data: transcriptData, isLoading, error } = useTranscriptData()
  
  // Combined POC data from static records and transcript API
  const enhancedPOCs = React.useMemo(() => {
    if (!transcriptData?.items) return records.map(r => ({ ...r, lastContact: 'N/A' }))
    
    const mergedData = mergePOCWithTranscriptData(records, transcriptData.items)
    
    // Sort to show API data (with transcripts) at the top
    return mergedData.sort((a, b) => {
      // POCs with transcript data should appear first
      if (a.transcript && !b.transcript) return -1
      if (!a.transcript && b.transcript) return 1
      
      // Among transcript POCs, sort by timestamp (most recent first)
      if (a.transcript && b.transcript) {
        return new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
      }
      
      // For static POCs, maintain original order
      return 0
    })
  }, [records, transcriptData]);

  // Calculate AE metrics using enhanced POC data
  const aeMetrics = React.useMemo(() => {
    const sentimentScore: Record<POCRecord['sentiment'], number> = {
      'At-Risk': 0.4,
      Engaged: 0.7,
      Progressing: 0.85,
    };

    const totalSentiment = enhancedPOCs.reduce((sum, r) => sum + sentimentScore[r.sentiment], 0);
    const avgSentiment = Math.round((totalSentiment / enhancedPOCs.length) * 100);
    const activePOCs = enhancedPOCs.length;

    // Calculate average deal cycle (mock calculation)
    const avgDealCycle = Math.round(
      enhancedPOCs.reduce((sum, r) => {
        const stageOrder: Record<POCRecord['stage'], number> = {
          Discovery: 30,
          Proposal: 45,
          Negotiation: 60,
          Pilot: 75,
          Contract: 90,
        };
        return sum + stageOrder[r.stage];
      }, 0) / enhancedPOCs.length,
    );

    return {
      avgSentiment,
      activePOCs,
      avgDealCycle,
    };
  }, [enhancedPOCs]);

  // Sentiment trend data (mock)
  const sentimentTrend = React.useMemo(
    () => [
      { week: 'Week 1', sentiment: 72 },
      { week: 'Week 2', sentiment: 75 },
      { week: 'Week 3', sentiment: 78 },
      { week: 'Week 4', sentiment: aeMetrics.avgSentiment },
    ],
    [aeMetrics.avgSentiment],
  );

  // Follow-up reminders data
  const followupReminders = React.useMemo(
    () => [
      {
        company: 'Reliance Retail',
        pocName: 'Amit Kumar',
        aeName: 'Priya Sharma',
        channel: 'WhatsApp',
        message: 'Hi Amit, following up on our API integration discussion. Can we schedule a tech call this week?',
        sentDate: 'Jan 28, 10:30 AM',
        nextFollowup: 'Jan 30, 2:00 PM',
        status: 'Sent',
      },
      {
        company: 'Flipkart',
        pocName: 'Rohit Singh',
        aeName: 'Priya Sharma',
        channel: 'Email',
        message: 'Proposal for seller onboarding automation with regional language support',
        sentDate: 'Jan 27, 4:15 PM',
        nextFollowup: 'Jan 29, 10:00 AM',
        status: 'Delivered',
      },
      {
        company: 'Tata Digital',
        pocName: 'Sneha Patel',
        aeName: 'Priya Sharma',
        channel: 'WhatsApp',
        message: 'Sharing the pricing breakdown for enterprise plan as discussed',
        sentDate: 'Jan 26, 11:20 AM',
        nextFollowup: 'Jan 31, 9:00 AM',
        status: 'Read',
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-2">Error loading transcript data</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Prospect's Sentiment</p>
                <p className="text-2xl font-bold text-[#667eea]">{aeMetrics.avgSentiment}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#667eea]/20 flex items-center justify-center">💭</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active POCs</p>
                <p className="text-2xl font-bold text-[#22c55e]">{enhancedPOCs.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#22c55e]/20 flex items-center justify-center">📊</div>
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
              <div className="h-12 w-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">⏰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Trend Chart */}
      {/* <Card>
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
      </Card> */}

      {/* POC Priority Dashboard */}
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
                  <TableHead>Next Action</TableHead>
                  <TableHead>AE</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enhancedPOCs.map((poc, index) => (
                  <TableRow key={poc.id || `static-${index}`}>
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
                          poc.sentiment === 'Progressing' && 'bg-green-100 text-green-800',
                        )}
                      >
                        {poc.sentiment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{poc.nextAction}</TableCell>
                    <TableCell>{poc.ae}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {poc.transcript && <TranscriptInsightsModal transcript={poc} />}
                        <WhatsAppFollowupModal poc={poc} />
                      </div>
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
                    <p className="text-sm text-muted-foreground">
                      POC: {reminder.pocName} • AE: {reminder.aeName}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <Badge
                      className={cn(
                        reminder.channel === 'WhatsApp' && 'bg-green-100 text-green-800',
                        reminder.channel === 'Email' && 'bg-blue-100 text-blue-800',
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
                      reminder.status === 'Read' && 'border-green-500 text-green-700',
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
      {/* <MeetingInsights /> */}
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
    <Card className="overflow-y-auto">
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

// Transcript Insights Modal Component
function TranscriptInsightsModal({ transcript }: { transcript: any }) {
  // Hardcoded AI analysis data
  const aiAnalysis = React.useMemo(() => ({
    meeting_quality_index: 82,
    company_sentiment: 78,
    feature_requests: {
      "AI automation for standard queries": 2,
      "multilingual support": 2,
      "real-time inventory sync": 2,
      "voice support integration": 2,
      "customer segmentation": 2,
      "automated return handling": 1,
      "integrations with logistics and CRM": 2
    },
    competitor_mentions: {
      "ByteSpeed": 2,
      "Nugget": 1,
      "Meta (WhatsApp calling)": 1,
    },
    prospect_blockers: {
      "Integration complexity and vendor dependency": 2,
      "Current limited support for voice calling": 1,
      "Migration concerns for existing platforms": 2,
      "Cost and budget considerations": 2
    },
    summary: "The meeting focused on understanding Scentira's current use of WhatsApp and support channels, and exploring LimeChat's AI-powered automation and integrations. Jappanjeet expressed interest in AI automation for standard queries, multilingual support, and seamless integration with existing shopify. The prospect currently handles 150–200 queries daily via Quick Reply, with no automation, and faces challenges in delivery rates and data utilization. LimeChat's solution offers extensive automation, real-time order and inventory integration, and omnichannel support across web, social media, and voice channels. The discussion highlighted the platform's ability to replace manual support tasks, improve customer experience, and enable scalable operations with minimal additional team members. The prospect is considering moving support platforms while keeping multiple tools for marketing and support, with plans to evaluate cost and integration compatibility. Overall, the meeting revealed positive interest in LimeChat's capabilities, with some concerns around integration complexity and migration, which LimeChat intends to address through detailed comparisons and flexible modular options."
  }), [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          View Transcript
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transcript.company} - Call Transcript</DialogTitle>
          <p className="text-sm text-muted-foreground">
            POC: {transcript.poc} • AE: {transcript.ae} • {new Date(transcript.timestamp).toLocaleString()}
          </p>
        </DialogHeader>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded">
              <div className="text-sm text-muted-foreground">Meeting Quality</div>
              <div className="text-2xl font-bold text-green-600">{aiAnalysis.meeting_quality_index}%</div>
            </div>
            <div className="bg-muted/30 p-3 rounded">
              <div className="text-sm text-muted-foreground">Company Sentiment</div>
              <div className="text-2xl font-bold text-blue-600">{aiAnalysis.company_sentiment}%</div>
            </div>
          </div>

          {/* AI Summary */}
          <div>
            <h4 className="font-medium mb-2">AI Meeting Summary</h4>
            <div className="bg-muted/30 p-4 rounded text-sm leading-relaxed">
              {aiAnalysis.summary}
            </div>
          </div>

          {/* Feature Requests */}
          <div>
            <h4 className="font-medium mb-2">Feature Requests</h4>
            <div className="bg-muted/30 p-3 rounded">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {Object.entries(aiAnalysis.feature_requests).map(([feature, priority]) => (
                  <div key={feature} className="flex justify-between items-center">
                    <span>{feature}</span>
                    <Badge variant={priority >= 2 ? 'default' : 'secondary'}>
                      Priority {priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Mentions */}
          <div>
            <h4 className="font-medium mb-2">Competitor Mentions</h4>
            <div className="bg-muted/30 p-3 rounded">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {Object.entries(aiAnalysis.competitor_mentions).map(([competitor, mentions]) => (
                  <div key={competitor} className="flex justify-between items-center">
                    <span>{competitor}</span>
                    <Badge variant="outline">{mentions} mentions</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prospect Blockers */}
          <div>
            <h4 className="font-medium mb-2">Prospect Blockers</h4>
            <div className="bg-muted/30 p-3 rounded">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {Object.entries(aiAnalysis.prospect_blockers).map(([blocker, severity]) => (
                  <div key={blocker} className="flex justify-between items-center">
                    <span className="flex-1">{blocker}</span>
                    <Badge 
                      variant={severity >= 2 ? 'destructive' : 'secondary'}
                      className={severity >= 2 ? 'bg-red-100 text-red-800' : ''}
                    >
                      Level {severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Full Transcript */}
          <div>
            <h4 className="font-medium mb-2">Full Transcript</h4>
            <div className="bg-muted/30 p-4 rounded max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                {transcript.transcript}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// POC Insights Modal Component (Legacy - keeping for backwards compatibility)
function POCInsightsModal({ poc }: { poc: any }) {
  // Mock meeting insights data for the specific POC
  const meetingInsights = React.useMemo(() => {
    const insights = {
      'Reliance Retail': {
        language: 'Regional + Hindi',
        summary: 'Need 10 regional languages by Q2; focus on catalog automation.',
        objections: ['Integration effort', 'Timeline risk'],
        features: ['Vernacular', 'ONDC catalog'],
        next: 'Share phased rollout plan and sample Hindi/Kannada scripts.',
        sentiment: 'Engaged' as const,
      },
      'Flipkart': {
        language: 'English',
        summary: 'Seller onboarding automation for Bharat users; peak season scaling.',
        objections: ['WhatsApp cost'],
        features: ['Hinglish', 'UPI status'],
        next: 'Quantify ROI with WhatsApp session pricing; provide template copy.',
        sentiment: 'Progressing' as const,
      },
      'Tata Digital (Tata Neu)': {
        language: 'English + Hindi',
        summary: 'Multi-brand marketplace integration with regional support.',
        objections: ['Complex integration', 'Data privacy'],
        features: ['Multi-language', 'Brand customization'],
        next: 'Technical architecture review and security compliance discussion.',
        sentiment: 'Engaged' as const,
      },
    };
    
    return insights[poc.company as keyof typeof insights] || {
      language: 'English',
      summary: 'General discussion about implementation and requirements.',
      objections: ['Budget constraints', 'Timeline concerns'],
      features: ['WhatsApp API', 'Integration support'],
      next: 'Follow up with detailed proposal and timeline.',
      sentiment: poc.sentiment,
    };
  }, [poc.company, poc.sentiment]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          View Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{poc.company} - Meeting Insights</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2 text-sm">
              <Row label="Deal Size" value={formatINR(poc.dealSizeINR)} />
              <Row label="Stage" value={poc.stage} />
              <Row label="Language" value={meetingInsights.language} />
              <Row label="Summary" value={meetingInsights.summary} />
              <Row label="Objections" value={meetingInsights.objections.join(', ')} />
              <Row label="Feature requests" value={meetingInsights.features.join(', ')} />
              <Row label="Next steps" value={meetingInsights.next} />
              <Row label="Sentiment" value={meetingInsights.sentiment} tone={meetingInsights.sentiment} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// WhatsApp Follow-up Modal Component
function WhatsAppFollowupModal({ poc }: { poc: any }) {
  const [copied, setCopied] = React.useState(false);
  
  // Generate AI content based on POC data
  const aiGeneratedContent = React.useMemo(() => {
    const templates = {
      'Discovery': `Hi ${poc.company} team! 👋

Hope you're doing well! Following up on our discussion about LimeChat's WhatsApp automation solution.

🚀 Key benefits for ${poc.company}:
• Automate customer support with AI
• Handle ${Math.round(poc.dealSizeINR/1000000)}M+ customer interactions
• Reduce response time by 80%
• Multi-language support for Indian markets

Would love to schedule a 30-min demo this week to show you the platform in action!

Best regards,
${poc.ae}`,
      
      'Proposal': `Hi ${poc.company} team! 🤝

Thanks for your time yesterday! I've prepared a customized proposal for your WhatsApp automation needs.

📊 Projected ROI for ${poc.company}:
• Monthly savings: ₹${formatINR(Math.round(poc.dealSizeINR/12)).replace('₹', '')}
• Customer satisfaction increase: 40%
• Agent productivity boost: 3x

The proposal includes implementation timeline and pricing details. Can we schedule a call to discuss next steps?

Looking forward to partnering with you!

Best,
${poc.ae}`,

      'Negotiation': `Hi ${poc.company} team! 💼

I've reviewed your feedback on our proposal and made the requested adjustments.

✅ Updated proposal highlights:
• Flexible pricing model as discussed
• Extended support during rollout
• Custom integrations for your existing systems
• Dedicated success manager

The revised proposal should address all your concerns. Ready to move forward?

Cheers,
${poc.ae}`,

      'Pilot': `Hi ${poc.company} team! 🎯

Great news! Your pilot environment is ready for testing.

🔧 What's included:
• Sandbox access for your team
• 1000 free WhatsApp messages
• Real-time analytics dashboard
• Direct line to our tech support

Your pilot runs for 30 days. Perfect time to see the ${Math.round((poc.dealSizeINR/12)/100000)}L+ monthly value in action!

Let's schedule a kickoff call this week?

Excited to get started!
${poc.ae}`,

      'Contract': `Hi ${poc.company} team! 📋

We're in the final stretch! Just need your approval on the contract terms.

📝 Final details confirmed:
• Go-live date: Next month
• Training sessions: Week 1
• Full deployment: Week 2-3
• Success metrics: Week 4

Once signed, we can begin implementation immediately. The sooner we start, the sooner you'll see those ₹${formatINR(Math.round(poc.dealSizeINR/12)).replace('₹', '')} monthly savings!

Ready to transform your customer experience?

Best regards,
${poc.ae}`
    };

    return templates[poc.stage as keyof typeof templates] || templates['Discovery'];
  }, [poc]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiGeneratedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          WhatsApp Follow-up
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Generated WhatsApp Message</DialogTitle>
          <p className="text-sm text-muted-foreground">
            For {poc.company} • Stage: {poc.stage} • Deal: {formatINR(poc.dealSizeINR)}
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {aiGeneratedContent}
            </pre>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy Message'}
              </Button>
            </div>
            
            <Button asChild size="sm" className="bg-[#25D366] hover:bg-[#20B954] text-white">
              <Link
                href={
                  `/tools/whatsapp-composer?template=roi-followup` +
                  `&company=${encodeURIComponent(poc.company)}` +
                  `&aeName=${encodeURIComponent(poc.ae)}` +
                  `&amount=${encodeURIComponent(String(Math.round(poc.dealSizeINR / 12)))}` +
                  `&hinglish=1`
                }
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Send via WhatsApp Composer
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// simple hook to fetch records from the POC context in dashboard-shell via DOM event bridge
