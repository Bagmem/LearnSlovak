"use client"

import { useEffect, useState } from "react"

type AnimatedFeedbackProps = {
  isCorrect: boolean | null
  duration?: number
  onComplete?: () => void
}

export default function AnimatedFeedback({ isCorrect, duration = 800, onComplete }: AnimatedFeedbackProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isCorrect !== null) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isCorrect, duration, onComplete])

  if (!visible || isCorrect === null) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 animate-fadeOutUp">
      <div className={`text-8xl font-black drop-shadow-2xl ${isCorrect ? "text-green-500" : "text-red-500"} animate-bounce`}>
        {isCorrect ? "✓" : "✗"}
      </div>
    </div>
  )
}