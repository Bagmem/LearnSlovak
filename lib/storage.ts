export function saveProgress(key: string, value: number) {
  localStorage.setItem(key, String(value))
}

export function loadProgress(key: string): number | null {
  const value = localStorage.getItem(key)
  return value ? Number(value) : null
}