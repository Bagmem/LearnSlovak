import { useState, useEffect } from "react"

export type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const saved = localStorage.getItem("slovak_theme") as Theme | null
    if (saved === "dark" || saved === "light") {
      setTheme(saved)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("slovak_theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}