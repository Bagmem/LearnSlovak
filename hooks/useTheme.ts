import { useState, useEffect, useRef } from "react"

export type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")
  const isMountedRef = useRef(false)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = localStorage.getItem("slovak_theme") as Theme | null
    if (saved === "dark" || saved === "light") {
      setTheme(saved)
      return
    }

    setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    localStorage.setItem("slovak_theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}