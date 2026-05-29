"use client"

import { useState } from "react"
import toast from "react-hot-toast"

type SectionTranslationProps = {
  words: { slovak: string; russian: string }[]
  onComplete: (score: number, maxScore: number) => void
}

export default function SectionTranslation({ words, onComplete }: SectionTranslationProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(words.length).fill(""))
  const allFilled = userAnswers.every(a => a.trim() !== "")

  const handleSubmit = () => {
    if (!allFilled) {
      toast.error("Заполните все поля!")
      return
    }
    let correct = 0
    userAnswers.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === words[idx].russian.toLowerCase().trim()) correct++
    })
    onComplete(correct, words.length)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200/50 dark:border-gray-700/50">
      {words.map((w, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
          <span className="font-bold text-lg text-gray-800 dark:text-white w-32">{w.slovak}</span>
          <input
            type="text"
            value={userAnswers[idx]}
            onChange={e => {
              const newAnswers = [...userAnswers]
              newAnswers[idx] = e.target.value
              setUserAnswers(newAnswers)
            }}
            placeholder="Введите перевод"
            className="flex-1 p-2 border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!allFilled}
        className={`w-full py-3 rounded-xl font-bold transition-all mt-4 ${
          allFilled
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
        }`}
      >
        Далее →
      </button>
    </div>
  )
}