"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { FaCheckCircle, FaTimesCircle, FaRedoAlt, FaStar } from "react-icons/fa"
import { useTheme } from "../../../hooks/useTheme"

type VictoryProps = {
  category: string
  xpEarned: number
  accuracy: number
  sessionCorrect: number
  sessionTotal: number
  onBack: () => void
  onRetryMistakes?: () => void
  mistakes?: { word: string; translation: string }[]
}

export default function VictoryScreen({
  category,
  xpEarned,
  accuracy,
  sessionCorrect,
  sessionTotal,
  onBack,
  onRetryMistakes,
  mistakes = [],
}: VictoryProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 200)
  }, [])

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (accuracy / 100) * circumference

  const bgMain = isDark ? "bg-gradient-to-br from-gray-900/90 to-gray-800/90" : "bg-gradient-to-br from-gray-100 to-gray-200"
  const cardBg = isDark ? "bg-white/10 backdrop-blur-sm border-white/20" : "bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-white/70" : "text-gray-600"
  const borderColor = isDark ? "border-white/20" : "border-gray-200"

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgMain} transition-colors duration-300`}>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", damping: 20 }}
        className="text-center px-4 w-full max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          <FaStar className="text-yellow-500" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Урок завершён!
        </h1>
        <p className={`${textSecondary} mb-6`}>Тема: {category}</p>

        <div className="flex justify-center mb-6">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r={radius} fill="none" stroke={isDark ? "rgba(255,255,255,0.2)" : "#ddd"} strokeWidth="12" />
              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black ${textPrimary}`}>{accuracy}%</span>
              <span className={`text-xs ${textSecondary}`}>точность</span>
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl p-6 w-full shadow-xl border ${borderColor}`}>
          <div className={`flex justify-between py-2 border-b ${borderColor}`}>
            <span className={`font-bold ${textPrimary}`}>Награда</span>
            <span className="text-amber-500 font-bold">+{xpEarned} XP</span>
          </div>
          <div className="flex justify-between py-2">
            <span className={`font-bold ${textPrimary}`}>Правильные ответы</span>
            <span className="text-green-500 font-bold">{sessionCorrect}/{sessionTotal}</span>
          </div>
        </div>

        {mistakes.length > 0 && (
          <div className={`mt-6 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-300"} rounded-xl p-4 text-left border`}>
            <h3 className="font-bold text-red-500 flex items-center gap-2 mb-2">
              <FaTimesCircle /> Слова для повторения
            </h3>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {mistakes.map((m, idx) => (
                <div key={idx} className="text-sm flex justify-between">
                  <span className={textPrimary}>{m.word}</span>
                  <span className={textSecondary}>{m.translation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg"
          >
            ПРОДОЛЖИТЬ
          </motion.button>
          {onRetryMistakes && mistakes.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetryMistakes}
              className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
            >
              <FaRedoAlt /> Повторить ошибки
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}