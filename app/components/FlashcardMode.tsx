"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Word } from "../../data/words"
import { playClickSound } from "../../lib/sounds"
import { FaVolumeUp, FaLightbulb, FaStepForward, FaSkull } from "react-icons/fa"
import { useTheme } from "../../hooks/useTheme"

type FlashcardModeProps = {
  word: Word | null
  onNext: (isCorrect: boolean) => void
  onBack: () => void
  onRestart: () => void
  lessonProgress: number
  wordsLeft: number
  totalWords: number
  remainingCount: number
  onSkip?: () => void
  onMarkHard?: (word: Word) => void
  sessionCorrect: number
  sessionTotal: number
}

export default function FlashcardMode({
  word,
  onNext,
  onBack,
  onRestart,
  lessonProgress,
  wordsLeft,
  totalWords,
  remainingCount,
  onSkip,
  onMarkHard,
  sessionCorrect,
  sessionTotal,
}: FlashcardModeProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setShowAnswer(false)
    setShowHint(false)
  }, [word])

  const speakSlovak = useCallback(() => {
    if (!word) return
    try {
      const utterance = new SpeechSynthesisUtterance(word.slovak)
      utterance.lang = "sk-SK"
      utterance.rate = 0.9
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.warn(e)
    }
  }, [word])

  const handleFlip = () => {
    playClickSound()
    setShowAnswer(true)
  }

  const handleKnown = () => {
    playClickSound()
    onNext(true)
  }

  const handleUnknown = () => {
    playClickSound()
    onNext(false)
  }

  const handleSkip = () => {
    if (!onSkip) return
    if (remainingCount <= 1) return
    playClickSound()
    onSkip()
  }

  const handleMarkHard = () => {
    if (!onMarkHard || !word) return
    playClickSound()
    onMarkHard(word)
  }

  const sessionAccuracy = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0

  if (!word) return null

  // Динамические классы
  const bgMain = isDark ? "bg-gradient-to-br from-gray-900/90 to-gray-800/90" : "bg-gradient-to-br from-gray-100 to-gray-200"
  const cardBg = isDark ? "bg-white/10 backdrop-blur-xl border-white/20" : "bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-white/70" : "text-gray-700"
  const textMuted = isDark ? "text-white/50" : "text-gray-500"
  const progressBg = isDark ? "bg-white/20" : "bg-gray-300"
  const buttonSkip = isDark ? "bg-white/10 border-white/20 text-white/80 hover:bg-white/20" : "bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300"
  const buttonHard = isDark ? "bg-white/10 border-white/20 text-white/80 hover:bg-red-500/30" : "bg-gray-200 border-gray-300 text-gray-800 hover:bg-red-200"

  return (
    <div className={`min-h-screen ${bgMain} flex flex-col items-center py-8 px-4 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className={`${textSecondary} hover:${isDark ? "text-white" : "text-gray-900"} mb-4 inline-flex items-center gap-1`}
        >
          ← Назад
        </motion.button>

        <div className={`relative rounded-2xl ${cardBg} shadow-2xl overflow-hidden border transition-colors`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm text-secondary">
              <span>Прогресс: {totalWords - wordsLeft}/{totalWords}</span>
              <span>{Math.round(lessonProgress)}%</span>
            </div>
            <div className={`w-full ${progressBg} rounded-full h-2 overflow-hidden`}>
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lessonProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className={`flex justify-between text-xs font-bold ${textSecondary}`}>
              <span>🎯 Точность сессии: {sessionAccuracy}%</span>
              <span>✓ {sessionCorrect}/{sessionTotal}</span>
            </div>

            <div className="min-h-[200px] flex items-center justify-center perspective-1000">
              <AnimatePresence mode="wait">
                {!showAnswer ? (
                  <motion.div
                    key="front"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full text-center"
                  >
                    <p className={`text-3xl font-bold ${textPrimary}`}>{word.slovak}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full text-center"
                  >
                    <p className={`text-3xl font-bold ${textPrimary}`}>{word.russian}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!showAnswer ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFlip}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md"
              >
                Показать перевод
              </motion.button>
            ) : (
              <>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={speakSlovak}
                    className={`${textSecondary} hover:${isDark ? "text-white" : "text-gray-900"} p-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                  >
                    <FaVolumeUp />
                  </button>
                  {word.hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className={`${textSecondary} hover:text-yellow-600 p-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                    >
                      <FaLightbulb />
                    </button>
                  )}
                </div>
                {showHint && word.hint && (
                  <div className={`text-sm rounded-lg p-2 text-center ${isDark ? "text-yellow-300 bg-yellow-900/30 border-yellow-500/30" : "text-yellow-800 bg-yellow-100 border-yellow-300"} border`}>
                    💡 {word.hint}
                  </div>
                )}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleKnown}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-md"
                  >
                    ✅ Знаю
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUnknown}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-md"
                  >
                    ❌ Не знаю
                  </motion.button>
                </div>
              </>
            )}

            {!showAnswer && onSkip && remainingCount > 1 && (
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSkip}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${buttonSkip}`}
                >
                  <FaStepForward /> Пропустить
                </button>
                {onMarkHard && (
                  <button
                    onClick={handleMarkHard}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${buttonHard}`}
                  >
                    <FaSkull /> Сложное
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}