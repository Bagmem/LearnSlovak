"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

type VictoryProps = {
  category: string
  xpEarned: number
  accuracy: number
  onBack: () => void
}

export default function VictoryScreen({ category, xpEarned, accuracy, onBack }: VictoryProps) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 200)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-6xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-3xl font-bold text-green-600">Урок завершён!</h1>
      <p className="text-gray-500 mb-6">Тема: {category}</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm border shadow">
        <div className="flex justify-between py-2 border-b">
          <span>Награда</span>
          <span className="text-amber-500">+{xpEarned} XP</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Точность</span>
          <span className="text-green-500">{accuracy}%</span>
        </div>
      </div>
      <button onClick={onBack} className="mt-8 px-8 py-3 bg-green-500 text-white rounded-xl font-bold">
        ПРОДОЛЖИТЬ
      </button>
    </div>
  )
}