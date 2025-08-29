"use client"

import { useMemo } from "react"
import { reminders, type ReminderItem } from "@/data/reminders"
import { cn } from "@/lib/utils"

// If lib/india.ts exposes formatting helpers, we can consume them.
// We'll keep light local formatters to avoid coupling if unavailable.
function formatIST(datetime?: string) {
  if (!datetime) return "-"
  // Format to India Standard Time without relying on env; show day and time.
  try {
    const date = new Date(datetime)
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch {
    return datetime
  }
}

function StatusPill({ status }: { status: ReminderItem["status"] }) {
  const label =
    status === "sent" ? "Sent" : status === "delivered" ? "Delivered" : status === "failed" ? "Failed" : "Scheduled"

  const className =
    status === "delivered"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : status === "sent"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        : status === "failed"
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", className)}>
      {label}
    </span>
  )
}

function ChannelIcon({ channel }: { channel: ReminderItem["channel"] }) {
  const label = channel === "whatsapp" ? "WhatsApp" : channel === "email" ? "Email" : "SMS"
  return (
    <span className="text-xs text-muted-foreground" aria-label={`Sent via ${label}`}>
      {label}
    </span>
  )
}

export default function RemindersPanel() {
  const rows = useMemo(() => reminders.slice(0, 8), [])

  return (
    <section aria-labelledby="reminders-heading" className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="reminders-heading" className="text-sm font-semibold text-foreground text-pretty">
          Recent Follow-up Reminders
        </h2>
        <span className="text-xs text-muted-foreground">Last {rows.length} items</span>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <div className="relative w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">Company</th>
                <th className="px-3 py-2 font-medium">POC</th>
                <th className="px-3 py-2 font-medium">AE</th>
                <th className="px-3 py-2 font-medium">Channel</th>
                <th className="px-3 py-2 font-medium">Template</th>
                <th className="px-3 py-2 font-medium">Sent (IST)</th>
                <th className="px-3 py-2 font-medium">Next (IST)</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.company}</td>
                  <td className="px-3 py-2">{r.pocName || "-"}</td>
                  <td className="px-3 py-2">{r.aeName}</td>
                  <td className="px-3 py-2">
                    <ChannelIcon channel={r.channel} />
                  </td>
                  <td className="px-3 py-2">
                    <span className="line-clamp-1 text-pretty">{r.template}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatIST(r.sentAtIST)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatIST(r.nextScheduledIST)}</td>
                  <td className="px-3 py-2">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Showing recent reminders. Data refreshes with your dashboard filters.
          </p>
          <div className="text-xs">
            <a href="/tools/whatsapp-composer" className="text-primary hover:underline">
              Compose new reminder
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
