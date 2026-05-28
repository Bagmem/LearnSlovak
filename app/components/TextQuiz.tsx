"use client"

import { useState } from "react"
import { type SlovakText } from "../../data/texts"
import { playClickSound, playCorrectSound, playWrongSound, playVictorySound } from "../../lib/sounds"
import confetti from "canvas-confetti"
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

type TextQuizProps = {
  text: SlovakText
  onComplete: (score: number, total: number, xpEarned: number, firstTime: boolean) => void
  onBack: () => void
  existingScore?: number | null
  xpAlreadyEarned?: boolean
}

export default function TextQuiz({ text, onComplete, onBack, xpAlreadyEarned }: TextQuizProps) {
  const total = text.questions?.length ?? 0
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(total).fill(-1))
  const [finished, setFinished] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showResult, setShowResult] = useState(false)

  if (!total) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-gray-500 dark:text-gray-400">Для этого текста пока нет вопросов.</p>
        <button onClick={onBack} className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">Назад</button>
      </div>
    )
  }

  const currentQ = text.questions[currentIndex]
  const selected = answers[currentIndex]
  const isLast = currentIndex === total - 1
  const currentScore = answers.filter((ans, idx) => ans === text.questions[idx]?.correct).length

  const handleSelect = (optIdx: number) => {
    if (finished || answers[currentIndex] !== -1) return
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
      setShowResult(true)
      const xp = correct * 5
      const firstTime = !xpAlreadyEarned
      if (correct === total) {
        playVictorySound()
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      } else if (correct > 0) playCorrectSound()
      else playWrongSound()
      onComplete(correct, total, firstTime ? xp : 0, firstTime)
    }
  }

  const progressPercent = ((currentIndex + 1) / total) * 100

  if (finished && showResult) {
    const accuracy = Math.round((correctCount / total) * 100)
    const xpAmount = correctCount * 5
    const isFirstTime = !xpAlreadyEarned
    // Собираем ошибки
    const mistakes = text.questions
      .map((q, idx) => ({ question: q, userAnswer: answers[idx], isCorrect: answers[idx] === q.correct }))
      .filter(m => !m.isCorrect)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-black text-green-600 dark:text-green-400">Викторина завершена!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{text.title}</p>
          <div className="space-y-3 text-left">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Награда</span>
              <span className={isFirstTime ? "text-amber-500 font-bold" : "text-gray-400"}>
                {isFirstTime ? `+${xpAmount} XP` : `${xpAmount} XP (уже получены)`}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Точность</span>
              <span className="text-green-500 font-bold">{accuracy}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Правильные ответы</span>
              <span className="text-blue-500 font-bold">{correctCount}/{total}</span>
            </div>
          </div>

          {mistakes.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-bold text-red-500 flex items-center gap-2 mb-3">❌ Разбор ошибок</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-gray-800 dark:text-white">{m.question.text}</p>
                    <p className="text-sm mt-1">
                      <span className="text-red-600">Ваш ответ: </span>
                      <span className="line-through text-gray-500">{m.question.options[m.userAnswer]}</span>
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-green-600">Правильный ответ: </span>
                      <span className="font-medium text-green-700 dark:text-green-400">{m.question.options[m.question.correct]}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => { playClickSound(); onBack() }}
            className="mt-8 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition"
          >
            ПРОДОЛЖИТЬ
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => { playClickSound(); onBack() }} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 flex items-center gap-1">
          <FaArrowLeft size={14} /> Назад
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-800 dark:text-white">
            {currentIndex+1} / {total}
          </span>
          <span className="text-sm font-bold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
            ✓ {currentScore}/{total}
          </span>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700"
      >
        <p className="text-xl font-bold mb-6 text-gray-800 dark:text-white">{currentQ.text}</p>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selected === idx
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== -1}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                } ${selected !== -1 && !isSelected ? "opacity-60" : ""}`}
              >
                <span className="font-medium text-gray-800 dark:text-white">{opt}</span>
              </button>
            )
          })}
        </div>
        <button
          onClick={handleNext}
          disabled={selected === -1}
          className={`mt-8 w-full py-3 rounded-xl font-bold transition-all ${
            selected !== -1
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-[1.01]"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLast ? "Завершить викторину" : "Следующий вопрос →"}
        </button>
      </motion.div>
    </div>
  )
}