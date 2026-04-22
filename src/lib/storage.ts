export function readNumber(key: string, fallback = 0): number {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function writeNumber(key: string, value: number): void {
  localStorage.setItem(key, String(value))
}
