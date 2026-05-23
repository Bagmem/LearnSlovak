export function saveProgress(key: string, value: any): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`slovak_app_${key}`, JSON.stringify(value))
  } catch (error) {
    console.error("Ошибка сохранения в localStorage", error)
  }
}

export function loadProgress(key: string): any | null {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem(`slovak_app_${key}`)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Ошибка загрузки из localStorage", error)
    return null
  }
}