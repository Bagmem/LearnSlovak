"use client"

import { useState } from "react"
import { FaPencilAlt, FaList, FaVolumeUp } from "react-icons/fa"
import toast from "react-hot-toast"

export type TranslationWord = {
  slovak: string
  russian: string
  accepted?: string[]
}

type SectionTranslationProps = {
  words: TranslationWord[]
  onComplete: (score: number, maxScore: number, userAnswers: string[]) => void
}

function isAnswerCorrect(userInput: string, word: TranslationWord): boolean {
  const input = userInput.toLowerCase().trim()
  const correctAnswers = [word.russian, ...(word.accepted || [])].map(s => s.toLowerCase().trim())
  return correctAnswers.includes(input)
}

export default function SectionTranslation({ words, onComplete }: SectionTranslationProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(words.length).fill(""))
  const allFilled = userAnswers.every(a => a.trim() !== "")

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "sk-SK"
    utterance.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const handleSubmit = () => {
    if (!allFilled) {
      toast.error("Заполните все поля!")
      return
    }
    let correct = 0
    userAnswers.forEach((ans, idx) => {
      if (isAnswerCorrect(ans, words[idx])) correct++
    })
    onComplete(correct, words.length, userAnswers)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <FaPencilAlt className="text-orange-500" />
        <h3 className="font-bold text-lg">Перевод слов</h3>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <FaList className="text-orange-500" />
        <span>Слов: {words.length}</span>
      </div>
      {words.map((w, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-800 dark:text-white w-32">{w.slovak}</span>
            <button onClick={() => speak(w.slovak)} className="text-gray-400 hover:text-orange-500" title="Прослушать">
              <FaVolumeUp />
            </button>
          </div>
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