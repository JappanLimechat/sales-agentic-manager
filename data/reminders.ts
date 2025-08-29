// Mock reminders data to display on the dashboard

export type ReminderStatus = "sent" | "delivered" | "failed" | "scheduled"
export type ReminderChannel = "whatsapp" | "email" | "sms"

export interface ReminderItem {
  id: string
  company: string
  pocName?: string
  aeName: string
  channel: ReminderChannel
  template: string
  sentAtIST?: string // ISO string in IST (pre-converted) or UTC we will format
  status: ReminderStatus
  nextScheduledIST?: string // optional upcoming reminder in IST
  phone?: string
}

export const reminders: ReminderItem[] = [
  {
    id: "rmd-001",
    company: "BigBasket",
    pocName: "Ankit Sharma",
    aeName: "Priya Nair",
    channel: "whatsapp",
    template: "Follow-up: POC demo recap",
    sentAtIST: new Date().toISOString(),
    status: "delivered",
    phone: "+91 9876543210",
  },
  {
    id: "rmd-002",
    company: "Tata 1mg",
    pocName: "Rohit Verma",
    aeName: "Arjun Mehta",
    channel: "email",
    template: "ROI summary and case studies",
    sentAtIST: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    status: "sent",
    nextScheduledIST: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "rmd-003",
    company: "Nykaa",
    pocName: "Sonal Gupta",
    aeName: "Priya Nair",
    channel: "whatsapp",
    template: "Nudges for cart recovery",
    sentAtIST: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "failed",
  },
  {
    id: "rmd-004",
    company: "Blinkit",
    pocName: "Karan Singh",
    aeName: "Aarav Kapoor",
    channel: "sms",
    template: "Demo reminder for tomorrow",
    status: "scheduled",
    nextScheduledIST: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
  },
]
