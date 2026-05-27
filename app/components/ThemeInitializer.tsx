"use client"

import { useEffect } from "react"

export default function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("slovak_theme")
    const darkMode = saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return null
}