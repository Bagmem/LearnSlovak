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
  if (!text.questions?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p>Для этого текста пока нет вопросов.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl">Назад</button>
      </div>
    )
  }

  const total = text.questions.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(total).fill(-1))
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const currentQ = text.questions[currentIndex]
  const selected = answers[currentIndex]
  const isLast = currentIndex === total - 1

  const handleSelect = (optIdx: number) => {
    if (finished) return
    playClickSound()
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optIdx
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (finished) return
    if (selected === -1) {
      alert("Выберите ответ!")
      return
    }
    if (!isLast) {
      setCurrentIndex(i => i + 1)
    } else {
      let correct = 0
      text.questions.forEach((q, i) => {
        if (answers[i] === q.correct) correct++
      })
      setCorrectCount(correct)
      setFinished(true)
      const xp = correct * 5
      const firstTime = !xpAlreadyEarned
      if (correct === total) { playVictorySound(); confetti() }
      else if (correct > 0) playCorrectSound()
      else playWrongSound()
      onComplete(correct, total, firstTime ? xp : 0, firstTime)
    }
  }

  if (finished) {
    const accuracy = Math.round((correctCount / total) * 100)
    const xpAmount = correctCount * 5
    const isFirstTime = !xpAlreadyEarned
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-green-600">Викторина завершена!</h2>
        <p className="text-gray-500 mb-6">{text.title}</p>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm border shadow">
          <div className="flex justify-between py-2 border-b">
            <span>Награда</span>
            <span className={isFirstTime ? "text-amber-500" : "text-gray-400"}>{isFirstTime ? `+${xpAmount} XP` : `${xpAmount} XP (уже получены)`}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Точность</span>
            <span className="text-green-500">{accuracy}%</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Правильные ответы</span>
            <span className="text-blue-500">{correctCount}/{total}</span>
          </div>
        </div>
        <button onClick={() => { playClickSound(); onBack() }} className="mt-8 px-8 py-3 bg-green-500 text-white rounded-xl font-bold">
          ПРОДОЛЖИТЬ
        </button>
      </div>
    )
  }

  const progressPercent = ((currentIndex + 1) / total) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => { playClickSound(); onBack() }} className="text-gray-400 hover:text-gray-600">← Назад</button>
        <span className="text-sm">{currentIndex+1} / {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <p className="text-xl font-bold mb-6">{currentQ.text}</p>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3 rounded-xl border-2 transition ${selected === idx ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
              {opt}
            </button>
          ))}
        </div>
        <button onClick={handleNext} className="mt-8 w-full py-3 bg-orange-500 text-white rounded-xl font-bold">
          {isLast ? "Завершить" : "Следующий →"}
        </button>
      </div>
    </div>
  )
}