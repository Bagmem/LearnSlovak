"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaArrowLeft, FaCheck, FaTimes, FaLightbulb, FaStar, FaRedoAlt } from "react-icons/fa"
import { useGrammarPractice } from "../../../hooks/useGrammarPractice"
import type { GrammarExercise } from "../../../data/grammar"

type Props = {
  exercises: GrammarExercise[]
  category: string
  level: string
  xp: number
  setXp: (v: number | ((prev: number) => number)) => void
  progressData: Record<string, number>
  setProgressData: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void
  onXpEarned?: (amount: number, source: string) => void
  onBack: () => void
}

export default function GrammarPracticeScreen({
  exercises,
  category,
  level,
  xp,
  setXp,
  progressData,
  setProgressData,
  onXpEarned,
  onBack,
}: Props) {
  const {
    currentExercise,
    showRule,
    feedback,
    selectedOption,
    setSelectedOption,
    userInput,
    setUserInput,
    buildOrder,
    setBuildOrder,
    shuffledWords,
    progressPercent,
    currentIndex,
    total,
    handleCheckAnswer,
    handleNext,
    dismissRule,
    completedCount,
    isFinished,
    mistakes,
  } = useGrammarPractice({
    exercises,
    category,
    level,
    xp,
    setXp,
    progressData,
    setProgressData,
    onXpEarned,
    onComplete: () => {},
  })

  const isAnswered = feedback !== null

  // Нет упражнений
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
          Нет упражнений для этой темы
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition"
        >
          Назад
        </button>
      </div>
    )
  }

  // Экран завершения
  if (isFinished) {
    const accuracy = total > 0 ? Math.round((completedCount / total) * 100) : 0
    const xpEarned = completedCount * 5

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700 text-center"
        >
          <FaStar className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-green-600 dark:text-green-400">
            Практика завершена!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
            {category} • Уровень {level}
          </p>

          <div className="space-y-3 text-left">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Заработано XP</span>
              <span className="text-amber-500 font-bold">+{xpEarned} XP</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-700 dark:text-gray-300">Точность</span>
              <span className="text-green-500 font-bold">{accuracy}%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Правильно</span>
              <span className="text-blue-500 font-bold">{completedCount}/{total}</span>
            </div>
          </div>

          {mistakes.length > 0 && (
            <div className="mt-4 text-left">
              <h3 className="font-bold text-red-500 flex items-center gap-2 mb-2">
                <FaTimes /> Ошибки
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-1 text-sm">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="text-gray-600 dark:text-gray-300">
                    {m.exercise.sentence} — <span className="text-red-500">{m.given}</span> → <span className="text-green-500">{m.exercise.correctAnswer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition"
          >
            ПРОДОЛЖИТЬ
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl">
        {/* Верхняя панель */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-gray-500 hover:text-orange-500 flex items-center gap-1">
            <FaArrowLeft /> Назад
          </button>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-center mt-1 text-gray-500">{currentIndex + 1} / {total}</p>
          </div>
        </div>

        {/* Правило */}
        {showRule && currentExercise && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl"
          >
            <div className="flex items-start gap-2">
              <FaLightbulb className="text-yellow-500 mt-1" />
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-white">Правило</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{currentExercise.explanation}</p>
              </div>
            </div>
            <button onClick={dismissRule} className="mt-2 text-xs text-orange-500 font-bold">Понятно, начать</button>
          </motion.div>
        )}

        {/* Упражнение */}
        {currentExercise && (
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50"
          >
            <p className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{currentExercise.sentence}</p>

            {currentExercise.type === "fill-blank" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Введите ответ..."
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isAnswered && userInput.trim()) {
                      handleCheckAnswer(userInput.trim())
                    }
                  }}
                />
                <button
                  onClick={() => handleCheckAnswer(userInput.trim())}
                  disabled={isAnswered || !userInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  Проверить
                </button>
              </div>
            )}

            {currentExercise.type === "choose-form" && currentExercise.options && (
              <div className="space-y-3">
                {currentExercise.options.map((opt: string, idx: number) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!isAnswered) {
                        setSelectedOption(opt)
                        handleCheckAnswer(opt)
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      isAnswered
                        ? opt === currentExercise.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : selectedOption === opt
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700 opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                    }`}
                    disabled={isAnswered}
                  >
                    <span className="font-medium text-gray-800 dark:text-white">{opt}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {currentExercise.type === "build-sentence" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {shuffledWords.map((word: string, idx: number) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (!isAnswered) setBuildOrder((prev: string[]) => [...prev, word])
                      }}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-800 dark:text-white"
                    >
                      {word}
                    </motion.button>
                  ))}
                </div>
                <div className="min-h-[40px] p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                  {buildOrder.join(" ")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCheckAnswer(buildOrder.join(" "))}
                    disabled={isAnswered || buildOrder.length === 0}
                    className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    Проверить
                  </button>
                  <button
                    onClick={() => setBuildOrder([])}
                    className="py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-xl text-sm font-bold"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            )}

            {feedback && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                feedback.correct
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              }`}>
                {feedback.correct ? <FaCheck /> : <FaTimes />}
                <span className="font-medium">{feedback.message}</span>
              </div>
            )}

            {isAnswered && (
              <button
                onClick={handleNext}
                className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold"
              >
                {currentIndex + 1 === total ? "Завершить" : "Далее"}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}