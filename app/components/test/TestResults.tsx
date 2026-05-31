"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaChartBar, FaCheckCircle, FaExclamationTriangle, FaChevronDown, FaChevronUp, FaRedo } from "react-icons/fa"
import { playClickSound } from "../../../lib/sounds"

type Mistake = {
  section: string
  question: string
  yourAnswer: string
  correctAnswer: string
  explanation?: string
}

type TestResultsProps = {
  level: string
  totalScore: number
  totalMax: number
  xpEarned: number
  sectionResults: { title: string; score: number; maxScore: number; percentage: number }[]
  isPassed: boolean
  mistakes: Mistake[]
  onFinish: () => void
  onRetryMistakes?: (mistakes: Mistake[]) => void
}

export default function TestResults({
  level,
  totalScore,
  totalMax,
  xpEarned,
  sectionResults,
  isPassed,
  mistakes,
  onFinish,
  onRetryMistakes,
}: TestResultsProps) {
  const totalPercentage = Math.round((totalScore / totalMax) * 100)
  const [showMistakes, setShowMistakes] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="text-5xl mb-3 flex justify-center"
          >
            <FaChartBar className="text-orange-500" />
          </motion.div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Результаты теста
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Уровень {level}</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-gray-200 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
              <motion.circle
                className="text-orange-500"
                strokeWidth="8"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * totalPercentage) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-gray-800 dark:text-white">{totalPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {sectionResults.map((res, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {res.percentage >= 90 ? <FaCheckCircle className="text-green-500" /> : <FaExclamationTriangle className="text-yellow-500" />}
                  <p className="font-bold text-gray-800 dark:text-white">{res.title}</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${res.percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  />
                </div>
              </div>
              <div className="text-right ml-4">
                <span className="font-black text-gray-800 dark:text-white">{res.score}</span>
                <span className="text-gray-500">/{res.maxScore}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-700 dark:text-gray-300">Всего баллов</span>
            <span className="text-2xl font-black text-orange-500">{totalScore}/{totalMax}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700 dark:text-gray-300">Награда</span>
            <span className="text-xl font-black text-green-500">+{xpEarned} XP</span>
          </div>
        </div>

        {!isPassed && (
          <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl flex items-start gap-2">
            <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Для перехода на следующий уровень необходимо набрать <strong>90% правильных ответов</strong>.
            </p>
          </div>
        )}

        {mistakes.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowMistakes(!showMistakes)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-bold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                Ошибки ({mistakes.length})
              </span>
              {showMistakes ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {showMistakes && (
              <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{m.section}</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{m.question}</p>
                    <div className="mt-1 text-sm">
                      <span className="text-red-600">Ваш ответ: </span>
                      <span className="line-through text-gray-500">{m.yourAnswer}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600">Правильно: </span>
                      <span className="font-medium text-green-700 dark:text-green-400">{m.correctAnswer}</span>
                    </div>
                    {m.explanation && (
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 italic">{m.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => {
            playClickSound()
            onFinish()
          }}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
        >
          ЗАВЕРШИТЬ
        </button>

        {mistakes.length > 0 && onRetryMistakes && (
          <button
            onClick={() => {
              playClickSound()
              onRetryMistakes(mistakes)
            }}
            className="mt-3 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <FaRedo /> ПОВТОРИТЬ ОШИБКИ
          </button>
        )}
      </div>
    </motion.div>
  )
}