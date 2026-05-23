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
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      startVelocity: 15,
      colors: ["#26ccff", "#a25afd", "#ff5e7e", "#ffac46", "#6eff8e"]
    })
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        startVelocity: 20
      })
    }, 200)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-900 flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="text-7xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-3xl font-black text-green-600 dark:text-green-400 mb-1">Урок завершен!</h1>
      <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">Тема: {category}</p>

      <div className="w-full max-w-sm bg-white dark:bg-gray-800 border-2 border-b-6 border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
          <span className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-wider">Награда</span>
          <span className="text-xl font-black text-amber-500">+{xpEarned} XP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-wider">Точность</span>
          <span className="text-xl font-black text-green-500">{accuracy}%</span>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full max-w-sm bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-black text-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-[4px] transition-all"
      >
        ПРОДОЛЖИТЬ
      </button>
    </div>
  )
}