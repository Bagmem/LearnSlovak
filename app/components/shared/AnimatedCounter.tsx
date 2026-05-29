"use client"
import { useState, useEffect } from "react"

export default function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return
    const duration = 800
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <span>{count}{suffix}</span>
}