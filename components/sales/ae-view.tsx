'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatINR } from '@/lib/india';
import { cn } from '@/lib/utils';
import type { POCRecord } from '@/data/pocs';

type KanbanItem = {
  id: string;
  company: string;
  deal: number;
  note: string;
  sentiment: 'At-Risk' | 'Engaged' | 'Progressing';
};

type ColumnKey = 'urgent' | 'meetings' | 'ready';

export function AEView({ records }: { records: POCRecord[] }) {
  const initial: Record<ColumnKey, KanbanItem[]> = React.useMemo(() => {
    const pick = records.slice(0, 12).map((r, i) => ({
      id: `${i}-${r.company}`,
      company: r.company,
      deal: r.dealSizeINR,
      note: i % 3 === 0 ? 'Follow-up on proposal' : i % 3 === 1 ? 'Prep agenda for today' : 'Finalize implementation scope',
      sentiment: r.sentiment,
    }));
    return {
      urgent: pick.filter((_, i) => i % 3 === 0),
      meetings: pick.filter((_, i) => i % 3 === 1),
      ready: pick.filter((_, i) => i % 3 === 2),
    };
  }, [records]);

  const [cols, setCols] = React.useState<Record<ColumnKey, KanbanItem[]>>(initial);
  const dragItem = React.useRef<{ from: ColumnKey; id: string } | null>(null);

  function onDragStart(from: ColumnKey, id: string) {
    dragItem.current = { from, id };
  }
  function onDrop(to: ColumnKey) {
    const payload = dragItem.current;
    if (!payload) return;
    const { from, id } = payload;
    if (from === to) return;
    const item = cols[from].find(x => x.id === id);
    if (!item) return;
    setCols(prev => {
      return {
        ...prev,
        [from]: prev[from].filter(x => x.id !== id),
        [to]: [item, ...prev[to]],
      };
    });
    dragItem.current = null;
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KanbanColumn
          title="Urgent Follow-ups"
          tone="border-[#ef4444]"
          items={cols.urgent}
          onDragStart={id => onDragStart('urgent', id)}
          onDrop={() => onDrop('urgent')}
        />
        <KanbanColumn
          title="Today's Meetings"
          tone="border-[#3b82f6]"
          items={cols.meetings}
          onDragStart={id => onDragStart('meetings', id)}
          onDrop={() => onDrop('meetings')}
        />
        <KanbanColumn
          title="Ready for Implementation"
          tone="border-[#22c55e]"
          items={cols.ready}
          onDragStart={id => onDragStart('ready', id)}
          onDrop={() => onDrop('ready')}
        />
      </div>

      <MeetingInsights />

      <MyPOCs records={records} />
    </div>
  );
}

function KanbanColumn({
  title,
  tone,
  items,
  onDragStart,
  onDrop,
}: {
  title: string;
  tone: string;
  items: KanbanItem[];
  onDragStart: (id: string) => void;
  onDrop: () => void;
}) {
  return (
    <Card
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        onDrop();
      }}
      className={cn('min-h-[260px] border-2 bg-card', tone)}
    >
      <CardHeader className="py-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.id} draggable onDragStart={() => onDragStart(it.id)} className="rounded-md border bg-muted/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium">{it.company}</div>
                <span className="text-xs text-muted-foreground">{formatINR(it.deal)}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{it.note}</div>
              <div className="mt-2 flex items-center gap-2">
                <SentimentBadge s={it.sentiment} />
                <Button size="sm" variant="secondary">
                  Send WhatsApp
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">Drop cards here to move them into {title}.</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function SentimentBadge({ s }: { s: KanbanItem['sentiment'] }) {
  return (
    <span
      className={cn(
        'rounded px-2 py-0.5 text-xs',
        s === 'At-Risk' && 'bg-[#ef4444]/20 text-[#ef4444]',
        s === 'Engaged' && 'bg-[#eab308]/20 text-[#a16207]',
        s === 'Progressing' && 'bg-[#22c55e]/20 text-[#15803d]',
      )}
    >
      {s}
    </span>
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
