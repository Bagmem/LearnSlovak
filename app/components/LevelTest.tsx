"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSeedling, FaRocket, FaTrophy, FaFire, FaGem, FaCheckCircle, FaChartLine } from "react-icons/fa"
import { type LanguageLevel } from "../../data/words"

type LevelTestProps = {
  onStartTest: (level: LanguageLevel) => void
}

type LevelsCompletion = {
  A1: boolean
  A2: boolean
  B1: boolean
  B2: boolean
  C1: boolean
}

const levelsData = [
  { id: "A1" as const, title: "A1", name: "Начинающий", icon: FaSeedling, color: "green", bgGradient: "from-green-500 to-emerald-600", desc: "Базовые слова и фразы", questionCount: 30 },
  { id: "A2" as const, title: "A2", name: "Элементарный", icon: FaRocket, color: "blue", bgGradient: "from-blue-500 to-indigo-600", desc: "Простые диалоги", questionCount: 35 },
  { id: "B1" as const, title: "B1", name: "Пороговый", icon: FaTrophy, color: "yellow", bgGradient: "from-yellow-500 to-amber-600", desc: "Уверенное общение", questionCount: 40 },
  { id: "B2" as const, title: "B2", name: "Продвинутый", icon: FaFire, color: "orange", bgGradient: "from-orange-500 to-red-600", desc: "Свободное владение", questionCount: 45 },
  { id: "C1" as const, title: "C1", name: "Экспертный", icon: FaGem, color: "purple", bgGradient: "from-purple-500 to-pink-600", desc: "Нюансы и сложные тексты", questionCount: 50 },
]

export default function LevelTest({ onStartTest }: LevelTestProps) {
  const [completed, setCompleted] = useState<LevelsCompletion>({
    A1: false,
    A2: false,
    B1: false,
    B2: false,
    C1: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem("test_completed_levels")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCompleted(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error("Ошибка загрузки прогресса тестов", e)
      }
    }
  }, [])

  const completedCount = Object.values(completed).filter(Boolean).length
  const totalLevels = levelsData.length

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 dark:bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Тесты
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-2" />
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Проверь свои знания по уровням</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-10 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Ваш прогресс</p>
                <p className="text-2xl font-black text-gray-800 dark:text-white">{completedCount}/{totalLevels} уровней пройдено</p>
              </div>
            </div>
            <div className="w-full sm:w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalLevels) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levelsData.map((level, idx) => {
            const Icon = level.icon
            const isCompleted = completed[level.id]
            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartTest(level.id)}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${level.bgGradient}`} />
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${level.bgGradient} flex items-center justify-center shadow-md`}>
                      <Icon className="text-white text-3xl" />
                    </div>
                    {isCompleted && (
                      <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-1.5">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white">{level.title}</h3>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-0.5">{level.name}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">{level.desc}</p>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{level.questionCount} вопросов</span>
                  <span className="text-sm font-bold text-orange-500 group-hover:translate-x-1 transition-transform duration-200">
                    Начать тест →
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400 dark:text-gray-500">
            ✅ Для засчитывания уровня необходимо ответить правильно на все вопросы.
          </p>
        </motion.div>
      </div>
    </div>
  )
}