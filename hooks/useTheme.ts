import { useState, useEffect } from "react"

export type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("slovak_theme") as Theme | null
      if (saved === "dark" || saved === "light") return saved
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark"
    }
    return "light"
  })

  useEffect(() => {
    const root = document.documentElement
    // Добавляем временный класс для плавного перехода
    root.classList.add("theme-transition")
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    // Убираем класс после завершения перехода
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition")
    }, 200)
    localStorage.setItem("slovak_theme", theme)
    return () => clearTimeout(timeout)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}