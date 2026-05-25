"use client"

import { useState } from "react"
import { type Word } from "../../data/words"
import { playClickSound } from "../../lib/sounds"

type FlashcardModeProps = {
  word: Word | null
  onNext: (isCorrect: boolean) => void
  onBack: () => void
  onRestart: () => void
  lessonProgress: number
  wordsLeft: number
  totalWords: number
}
  
export default function FlashcardMode({
  word,
  onNext,
  onBack,
  lessonProgress,
  wordsLeft,
  totalWords,
}: FlashcardModeProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  if (!word) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <button onClick={onBack} className="self-start text-gray-400 mb-4">← Назад</button>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-4 flex justify-between text-sm text-gray-500">
          <span>Прогресс: {totalWords - wordsLeft}/{totalWords}</span>
          <span>{Math.round(lessonProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${lessonProgress}%` }} />
        </div>
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="text-3xl font-bold">{showAnswer ? word.russian : word.slovak}</p>
        </div>
        <div className="mt-8 space-y-3">
          {!showAnswer ? (
            <button onClick={() => { playClickSound(); setShowAnswer(true) }} className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold">
              Показать перевод
            </button>
          ) : (
            <>
              <button onClick={() => { playClickSound(); onNext(true) }} className="w-full py-3 bg-green-500 text-white rounded-xl font-bold">
                ✅ Знаю
              </button>
              <button onClick={() => { playClickSound(); onNext(false) }} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold">
                ❌ Не знаю
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}