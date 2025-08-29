type Row = Record<string, string | number | boolean | null | undefined>

export function formatINR(n: number): string {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
  } catch {
    return `₹${n}`
  }
}

export function formatIST(d: Date): string {
  // DD-MM-YYYY HH:mm IST
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
    return new Intl.DateTimeFormat("en-GB", options).format(d) + " IST"
  } catch {
    return d.toISOString()
  }
}

export function toCSV(rows: Row[]): string {
  if (!rows?.length) return ""
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r || {}).forEach((k) => acc.add(k))
      return acc
    }, new Set()),
  )
  const escape = (val: any) => {
    if (val == null) return ""
    const s = String(val)
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const head = headers.join(",")
  const body = rows.map((r) => headers.map((h) => escape(r[h])).join(",")).join("\n")
  return [head, body].join("\n")
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
