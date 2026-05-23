export function saveProgress(key: string, value: unknown): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`slovak_app_${key}`, JSON.stringify(value))
  } catch (error) {
    console.error("Ошибка сохранения в localStorage", error)
  }
}

export function loadProgress<T = unknown>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem(`slovak_app_${key}`)
    return data ? (JSON.parse(data) as T) : null
  } catch (error) {
    console.error("Ошибка загрузки из localStorage", error)
    return null
  }
}