function hasLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

export function saveProgress(key: string, value: number) {
  if (!hasLocalStorage()) return
  localStorage.setItem(key, String(value))
}

export function loadProgress(key: string): number | null {
  if (!hasLocalStorage()) return null
  const value = localStorage.getItem(key)
  return value ? Number(value) : null
}