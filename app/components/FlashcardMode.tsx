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

  const handleShowAnswer = () => {
    playClickSound()
    setShowAnswer(true)
  }

  const handleRating = (known: boolean) => {
    playClickSound()
    onNext(known)
    setShowAnswer(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-between pb-8 animate-fadeIn">
      <div className="w-full max-w-xl mx-auto px-4 pt-6 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-black text-2xl p-1 active:scale-95 transition-transform"
        >
          ✕
        </button>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 p-0.5">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${lessonProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tabular-nums min-w-[3rem] text-center">
            {totalWords - wordsLeft}/{totalWords}
          </span>
        </div>

        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto px-4 my-8">
        <span className="text-4xl mb-4 animate-bounce">📇</span>
        <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Карточка</h2>
        
        <div className="w-full bg-white dark:bg-gray-800 px-6 py-10 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 shadow-sm text-center animate-slideInScale">
          <p className="text-3xl font-black text-gray-800 dark:text-white">
            {showAnswer ? word.russian : word.slovak}
          </p>
        </div>

        <div className="w-full mt-8 space-y-3">
          {!showAnswer ? (
            <button
              onClick={handleShowAnswer}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl border-b-4 border-orange-700 transition-all transform active:scale-[0.99]"
            >
              Показать перевод
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleRating(true)}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl border-b-4 border-green-700 transition-all transform active:scale-[0.99]"
              >
                ✅ Знаю
              </button>
              <button
                onClick={() => handleRating(false)}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl border-b-4 border-red-700 transition-all transform active:scale-[0.99]"
              >
                ❌ Не знаю
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 px-4 shadow-inner">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 py-2">
            Нажмите &quot;Показать перевод&quot;, затем оцените, насколько хорошо запомнили слово.
          </p>
        </div>
      </div>
    </div>
  )
}