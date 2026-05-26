"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="self-start text-gray-400 mb-4 hover:text-gray-600 transition"
      >
        ← Назад
      </motion.button>
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-gray-200/50 dark:border-gray-700/50">
        <div className="mb-4 flex justify-between text-sm text-gray-500">
          <span>Прогресс: {totalWords - wordsLeft}/{totalWords}</span>
          <span>{Math.round(lessonProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${lessonProgress}%` }}
            transition={{ duration: 0.3 }}
          />
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
                className="w-full"
              >
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{word.slovak}</p>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{word.russian}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 space-y-3">
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
          )}
        </div>
      </div>
    </motion.div>
  )
}