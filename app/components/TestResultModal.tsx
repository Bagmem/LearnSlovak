"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaTrophy, FaCheckCircle, FaChartLine } from "react-icons/fa"
import { useTheme } from "../../hooks/useTheme"

type TestResultModalProps = {
  isOpen: boolean
  onClose: () => void
  level: string
  percent: number
  xpEarned: number
  isPassed: boolean
  onContinue: () => void
}

export default function TestResultModal({
  isOpen,
  onClose,
  level,
  percent,
  xpEarned,
  isPassed,
  onContinue,
}: TestResultModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-md rounded-2xl ${
                isDark
                  ? "bg-gray-800/95 backdrop-blur-xl border-gray-700"
                  : "bg-white/95 backdrop-blur-sm border-gray-200 shadow-2xl"
              } border p-6 text-center`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                aria-label="Закрыть"
              >
                <FaTimes size={18} aria-hidden="true" />
              </button>

              <div className="flex justify-center mb-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                  isPassed
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-orange-500 to-amber-500"
                }`} aria-hidden="true">
                  {isPassed ? "🏆" : "📚"}
                </div>
              </div>

              <h3 id="result-title" className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {isPassed ? "Уровень пройден!" : "Тест завершён"}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Уровень {level}
              </p>

              <div className="flex justify-center mb-6" aria-label={`Результат: ${percent}%`}>
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 dark:bg-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                    <motion.circle
                      className="text-orange-500"
                      strokeWidth="8"
                      strokeDasharray={264}
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * percent) / 100 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-800 dark:text-white">{percent}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-left mb-6">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Правильных ответов</span>
                  <span className="text-green-500 font-bold">{Math.round((percent / 100) * (xpEarned / 5))}/{xpEarned / 5}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Награда</span>
                  <span className="text-amber-500 font-bold">+{xpEarned} XP</span>
                </div>
              </div>

              {!isPassed && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    ⚠️ Для перехода на следующий уровень необходимо набрать <strong>90%</strong>.
                  </p>
                </div>
              )}

              <button
                onClick={onContinue}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Продолжить"
              >
                Продолжить
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}