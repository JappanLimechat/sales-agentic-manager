export function formatINR(value: number, opts: { maximumFractionDigits?: number } = {}) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: opts.maximumFractionDigits ?? 0,
  }).format(value)
}

export function toLakhs(value: number) {
  return `${(value / 100_000).toFixed(1)} L`
}

export function toCrores(value: number) {
  return `${(value / 10_000_000).toFixed(1)} Cr`
}
