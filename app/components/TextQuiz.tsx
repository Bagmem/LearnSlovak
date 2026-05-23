"use client"

import { useState } from "react"
import { type SlovakText } from "../../data/texts"
import { playClickSound, playCorrectSound, playWrongSound, playVictorySound } from "../../lib/sounds"
import confetti from "canvas-confetti"

type TextQuizProps = {
  text: SlovakText
  onComplete: (score: number, total: number, xpEarned: number, firstTime: boolean) => void
  onBack: () => void
  existingScore?: number | null
  xpAlreadyEarned?: boolean
}

export default function TextQuiz({ text, onComplete, onBack, existingScore, xpAlreadyEarned }: TextQuizProps) {
  if (!text.questions || text.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center max-w-md">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Для этого текста пока нет вопросов.</p>
          <button onClick={() => { playClickSound(); onBack() }} className="px-6 py-2 bg-orange-500 text-white rounded-xl font-black">
            Назад
          </button>
        </div>
      </div>
    )
  }

  const totalQuestions = text.questions.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(totalQuestions).fill(-1))
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)

  const currentQuestion = text.questions[currentIndex]
  const selectedAnswer = answers[currentIndex]
  const isLast = currentIndex === totalQuestions - 1

  const handleSelect = (optIndex: number) => {
    if (finished) return
    playClickSound()
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (finished) return
    if (selectedAnswer === -1) {
      alert("Выберите ответ!")
      return
    }
    if (!isLast) {
      setCurrentIndex(i => i + 1)
    } else {
      let correct = 0
      text.questions.forEach((q, idx) => {
        if (answers[idx] === q.correct) correct++
      })
      const xp = correct * 5
      setCorrectCount(correct)
      setXpEarned(xp)
      setFinished(true)

      if (correct === totalQuestions) {
        playVictorySound()
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      } else if (correct > 0) playCorrectSound()
      else playWrongSound()

      const firstTime = !xpAlreadyEarned
      onComplete(correct, totalQuestions, firstTime ? xp : 0, firstTime)
    }
  }

  if (finished) {
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    const xpAmount = correctCount * 5
    const isFirstTime = !xpAlreadyEarned
    return (
      <div className="min-h-screen bg-[#f7f7f7] dark:bg-gray-900 flex flex-col items-center justify-center px-6 text-center select-none">
        <div className="text-7xl mb-4 animate-bounce">📊</div>
        <h1 className="text-3xl font-black text-green-600 dark:text-green-400 mb-1">Викторина завершена!</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold mb-8">{text.title}</p>

        <div className="w-full max-w-sm bg-white dark:bg-gray-800 border-2 border-b-6 border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-wider">Награда</span>
            <span className={`text-xl font-black ${isFirstTime ? "text-amber-500" : "text-gray-400"}`}>
              {isFirstTime ? `+${xpAmount} XP` : `${xpAmount} XP (уже получены)`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-wider">Точность</span>
            <span className="text-xl font-black text-green-500">{accuracy}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-wider">Правильные ответы</span>
            <span className="text-xl font-black text-blue-500">{correctCount}/{totalQuestions}</span>
          </div>
        </div>

        <button
          onClick={() => { playClickSound(); onBack() }}
          className="w-full max-w-sm bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-black text-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-[4px] transition-all"
        >
          ПРОДОЛЖИТЬ
        </button>
      </div>
    )
  }

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col pb-8 animate-fadeIn">
      <div className="w-full max-w-2xl mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => { playClickSound(); onBack() }} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-black text-2xl p-1">
            ← Назад
          </button>
          <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {totalQuestions}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center max-w-2xl w-full mx-auto px-4 my-4">
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 shadow-md p-6 animate-slideInScale">
          <p className="text-xl font-black text-gray-800 dark:text-white mb-6">{currentQuestion.text}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all transform active:scale-[0.98] ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 shadow-md"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/30"
                  }`}
                >
                  <span className="font-bold">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="mt-8 w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl transition-all transform active:scale-95 shadow-md"
        >
          {isLast ? "Завершить викторину" : "Следующий вопрос →"}
        </button>
      </div>
    </div>
  )
}