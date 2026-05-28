"use client"

import { useState, useEffect, type ComponentType } from "react"
import { motion } from "framer-motion"
import { FaSeedling, FaRocket, FaTrophy, FaFire, FaGem, FaCheckCircle, FaBookOpen, FaLayerGroup } from "react-icons/fa"

type TestLevel = "A1" | "A2" | "B1" | "B2" | "C1"

type LevelTestProps = {
  onStartTest: (level: TestLevel) => void
}

type ProgressMap = Record<TestLevel, number>

const levelsData: { id: TestLevel; title: string; name: string; icon: ComponentType<{ className?: string; size?: string | number }>; bgGradient: string; desc: string; questionCount: number; testWordCount: number }[] = [
  { id: "A1", title: "A1", name: "Начинающий", icon: FaSeedling, bgGradient: "from-green-500 to-emerald-600", desc: "Базовые слова и фразы", questionCount: 30, testWordCount: 12 },
  { id: "A2", title: "A2", name: "Элементарный", icon: FaRocket, bgGradient: "from-blue-500 to-indigo-600", desc: "Простые диалоги", questionCount: 35, testWordCount: 10 },
  { id: "B1", title: "B1", name: "Пороговый", icon: FaTrophy, bgGradient: "from-yellow-500 to-amber-600", desc: "Уверенное общение", questionCount: 40, testWordCount: 8 },
  { id: "B2", title: "B2", name: "Продвинутый", icon: FaFire, bgGradient: "from-orange-500 to-red-600", desc: "Свободное владение", questionCount: 45, testWordCount: 6 },
  { id: "C1", title: "C1", name: "Экспертный", icon: FaGem, bgGradient: "from-purple-500 to-pink-600", desc: "Нюансы и сложные тексты", questionCount: 50, testWordCount: 5 },
]

const loadProgress = (): ProgressMap => {
  const defaultProgress: ProgressMap = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }
  if (typeof window === "undefined") return defaultProgress
  const saved = localStorage.getItem("test_completed_levels")
  if (!saved) return defaultProgress
  try {
    const parsed = JSON.parse(saved)
    const migrated: ProgressMap = { ...defaultProgress }
    for (const level of Object.keys(defaultProgress) as TestLevel[]) {
      const value = parsed[level]
      if (typeof value === "number") {
        migrated[level] = Math.min(100, Math.max(0, value))
      } else if (value === true) {
        migrated[level] = 100
      } else {
        migrated[level] = 0
      }
    }
    return migrated
  } catch {
    return defaultProgress
  }
}

export default function LevelTest({ onStartTest }: LevelTestProps) {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress)

  useEffect(() => {
    const handleStorageChange = () => {
      setProgress(loadProgress())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const overallProgress = Object.values(progress).reduce((sum, p) => sum + p, 0) / levelsData.length
  const circumference = 2 * Math.PI * 70

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return "bg-green-500"
    if (percent >= 50) return "bg-gradient-to-r from-orange-500 to-amber-500"
    return "bg-gradient-to-r from-gray-400 to-gray-500"
  }

  const handleLevelClick = (level: TestLevel) => {
    // Никаких модалок, просто запускаем тест
    onStartTest(level)
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-8 overflow-x-visible overflow-y-visible">
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-200/10 dark:bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-green-200/10 dark:bg-green-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 overflow-visible">
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

        <div className="flex flex-col items-center overflow-visible">
          <div className="flex flex-wrap justify-center items-start gap-8 mb-8 overflow-visible">
            {/* Левая колонка: A1, A2 */}
            <div className="flex flex-col gap-6 w-96 overflow-visible">
              {levelsData.slice(0, 2).map((level) => {
                const Icon = level.icon
                const percent = progress[level.id]
                const isPassed = percent >= 90
                return (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLevelClick(level.id)}
                    className="group w-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`h-1 w-full bg-gradient-to-r ${level.bgGradient}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${level.bgGradient} flex items-center justify-center shadow-md`}>
                            <Icon className="text-white text-2xl" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-gray-800 dark:text-white">{level.title}</h3>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{level.name}</p>
                          </div>
                        </div>
                        {isPassed && <FaCheckCircle className="text-green-500 text-2xl" />}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">{level.desc}</p>
                    </div>
                    <div className="px-5 py-3 bg-white/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span className="flex items-center gap-1"><FaBookOpen size={10} /> {level.testWordCount} слов</span>
                        <span className="flex items-center gap-1"><FaLayerGroup size={10} /> {level.questionCount} вопр.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Прогресс</span>
                        <span className="text-xs font-bold text-orange-500">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${getProgressColor(percent)}`} style={{ width: `${percent}%` }} />
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-sm font-bold text-orange-500 group-hover:translate-x-1 transition-transform duration-200">
                          Начать тест →
                        </span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Круговая диаграмма */}
            <div className="flex items-start justify-center mt-8 md:mt-12 lg:mt-16">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="relative w-64 h-64 md:w-72 md:h-72">
                  <svg className="w-full h-full" viewBox="0 0 160 160">
                    <circle className="text-gray-200 dark:text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                    <motion.circle
                      className="text-orange-500"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (circumference * overallProgress) / 100 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="70"
                      cx="80"
                      cy="80"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-gray-800 dark:text-white">{Math.round(overallProgress)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">%</span>
                    <span className="text-2xl font-bold text-orange-500 mt-2">средний</span>
                  </div>
                </div>
                <p className="text-center text-sm font-bold text-gray-500 dark:text-gray-400 mt-3">Общий прогресс</p>
              </div>
            </div>

            {/* Правая колонка: B1, B2 */}
            <div className="flex flex-col gap-6 w-96 overflow-visible">
              {levelsData.slice(2, 4).map((level) => {
                const Icon = level.icon
                const percent = progress[level.id]
                const isPassed = percent >= 90
                return (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLevelClick(level.id)}
                    className="group w-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`h-1 w-full bg-gradient-to-r ${level.bgGradient}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${level.bgGradient} flex items-center justify-center shadow-md`}>
                            <Icon className="text-white text-2xl" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-gray-800 dark:text-white">{level.title}</h3>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{level.name}</p>
                          </div>
                        </div>
                        {isPassed && <FaCheckCircle className="text-green-500 text-2xl" />}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">{level.desc}</p>
                    </div>
                    <div className="px-5 py-3 bg-white/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span className="flex items-center gap-1"><FaBookOpen size={10} /> {level.testWordCount} слов</span>
                        <span className="flex items-center gap-1"><FaLayerGroup size={10} /> {level.questionCount} вопр.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Прогресс</span>
                        <span className="text-xs font-bold text-orange-500">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${getProgressColor(percent)}`} style={{ width: `${percent}%` }} />
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-sm font-bold text-orange-500 group-hover:translate-x-1 transition-transform duration-200">
                          Начать тест →
                        </span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* C1 снизу по центру */}
          <div className="flex justify-center w-full max-w-md mt-8 overflow-visible">
            {levelsData.slice(4, 5).map((level) => {
              const Icon = level.icon
              const percent = progress[level.id]
              const isPassed = percent >= 90
              return (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLevelClick(level.id)}
                  className="group w-full rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className={`h-1 w-full bg-gradient-to-r ${level.bgGradient}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${level.bgGradient} flex items-center justify-center shadow-md`}>
                          <Icon className="text-white text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-800 dark:text-white">{level.title}</h3>
                          <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{level.name}</p>
                        </div>
                      </div>
                      {isPassed && <FaCheckCircle className="text-green-500 text-2xl" />}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-relaxed">{level.desc}</p>
                  </div>
                  <div className="px-5 py-3 bg-white/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span className="flex items-center gap-1"><FaBookOpen size={10} /> {level.testWordCount} слов</span>
                      <span className="flex items-center gap-1"><FaLayerGroup size={10} /> {level.questionCount} вопр.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Прогресс</span>
                      <span className="text-xs font-bold text-orange-500">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className={`h-full rounded-full ${getProgressColor(percent)}`} style={{ width: `${percent}%` }} />
                    </div>
                    <div className="mt-2 text-right">
                      <span className="text-sm font-bold text-orange-500 group-hover:translate-x-1 transition-transform duration-200">
                        Начать тест →
                      </span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400 dark:text-gray-500">
            ✅ Для перехода на следующий уровень необходимо набрать <strong className="text-orange-500">90%</strong> правильных ответов. Прогресс сохраняется.
          </p>
        </motion.div>
      </div>
    </div>
  )
}