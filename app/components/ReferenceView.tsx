"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { type WordStats } from "../../lib/game"
import {
  FaSearch, FaCalendarAlt, FaSkull, FaQuestionCircle,
  FaFire, FaStar, FaTrophy, FaBook, FaCheckCircle, FaRegSmile,
  FaGraduationCap, FaHeart, FaVolumeUp, FaTimes, FaChevronDown, FaChevronUp
} from "react-icons/fa"

type ReferenceViewProps = {
  progressData: Record<string, number>
  activeDates: string[]
  wordStatsMap: Map<string, WordStats>
}

function isWordLearned(stat: WordStats): boolean {
  return stat.correctCount >= 2 && stat.correctCount >= stat.wrongCount
}

function CircularProgress({ percent, label, color = "#f97316", size = 100, icon }: { percent: number; label: string; color?: string; size?: number; icon?: React.ReactNode }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const [animatedPercent, setAnimatedPercent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100)
    return () => clearTimeout(timer)
  }, [percent])

  const offset = circumference - (animatedPercent / 100) * circumference

  return (
    <div className="flex flex-col items-center overflow-visible">
      <div className="relative overflow-visible" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full overflow-visible">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="6" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className="text-2xl mb-1">{icon}</div>}
          <div className="text-lg font-black text-gray-800 dark:text-white">{Math.round(animatedPercent)}%</div>
        </div>
      </div>
      <span className="text-xs font-semibold mt-2 text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  )
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) return
    const duration = 800
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <span>{count}{suffix}</span>
}

// ------------------------------------------------------------
// Модальное окно с детализацией по заданиям (ИСПРАВЛЕННЫЙ КЛЮЧ)
// ------------------------------------------------------------
const LevelDetailModal = ({ levelData, onClose, levelColor, levelIcon, allItems, wordStatsMap, progressData }: {
  levelData: any;
  onClose: () => void;
  levelColor: string;
  levelIcon: React.ReactNode;
  allItems: any[];
  wordStatsMap: Map<string, WordStats>;
  progressData: Record<string, number>;
}) => {
  if (!levelData) return null

  const vocabItems = allItems.filter(item => words.some(w => w.slovak === item.slovak && w.russian === item.russian))
  const grammarItems = allItems.filter(item => grammarTasks.some(g => g.slovak === item.slovak && g.russian === item.russian))

  const getCategoriesWithItems = (items: any[]) => {
    const level = levelData.level
    const levelItems = items.filter(i => i.level === level)
    const categoryMap = new Map<string, any[]>()
    levelItems.forEach(item => {
      if (!categoryMap.has(item.category)) categoryMap.set(item.category, [])
      categoryMap.get(item.category)!.push(item)
    })
    return Array.from(categoryMap.entries()).map(([catName, catItems]) => {
      const total = catItems.length
      const key = `cat_progress_${level}_${catName}`
      const passed = progressData[key] || 0
      const percent = total ? (passed / total) * 100 : 0
      return { name: catName, total, passed, percent, items: catItems }
    })
  }

  const vocabCategories = getCategoriesWithItems(vocabItems)
  const grammarCategories = getCategoriesWithItems(grammarItems)

  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar'>('vocab')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(catName)) newSet.delete(catName)
      else newSet.add(catName)
      return newSet
    })
  }

  const currentCategories = activeTab === 'vocab' ? vocabCategories : grammarCategories

  const speak = (text: string, lang: string) => {
    if (typeof window === "undefined") return
    if (!window.speechSynthesis) return
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = 0.9
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    } catch (error) {
      console.warn("Speech error", error)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelIcon}</span>
              <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                Уровень {levelData.level}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Закрыть"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <CircularProgress
                percent={levelData.percent}
                label="общий прогресс"
                color={levelColor}
                size={120}
                icon={levelIcon}
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {levelData.learned} из {levelData.total} тем пройдено
              </p>
            </div>

            <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('vocab')}
                className={`pb-2 px-3 font-bold text-sm transition-all ${
                  activeTab === 'vocab'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                📖 Лексика ({vocabCategories.length})
              </button>
              <button
                onClick={() => setActiveTab('grammar')}
                className={`pb-2 px-3 font-bold text-sm transition-all ${
                  activeTab === 'grammar'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                📝 Грамматика ({grammarCategories.length})
              </button>
            </div>

            {currentCategories.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет заданий в этом разделе</p>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {currentCategories.map(cat => {
                  const isExpanded = expandedCategories.has(cat.name)
                  return (
                    <div key={cat.name} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className="w-full flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800 dark:text-white">{cat.name}</span>
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 ml-2">
                              {cat.passed} / {cat.total}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${cat.percent}%`, backgroundColor: levelColor }}
                            />
                          </div>
                        </div>
                        <div className="ml-3">
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2 max-h-64 overflow-y-auto">
                          {cat.items.map((item: any, idx: number) => {
                            const itemKey = `${item.slovak}|${item.russian}`
                            const stat = wordStatsMap.get(itemKey)
                            const learned = stat ? isWordLearned(stat) : false
                            return (
                              <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-gray-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-sm font-semibold ${learned ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                                      {item.slovak}
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); speak(item.slovak, "sk-SK"); }}
                                      className="text-gray-400 hover:text-orange-500 transition"
                                      title="Озвучить"
                                    >
                                      <FaVolumeUp size={12} />
                                    </button>
                                    {learned && <FaCheckCircle className="text-green-500 text-xs" />}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.russian}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ------------------------------------------------------------
// Основной компонент ReferenceView
// ------------------------------------------------------------
export default function ReferenceView({ progressData, activeDates, wordStatsMap }: ReferenceViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<any>(null)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const speakText = (text: string, lang: string) => {
    if (typeof window === "undefined") return
    if (!window.speechSynthesis) return
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = 0.9
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    } catch (error) {
      console.warn("Speech synthesis error:", error)
    }
  }

  const allItems = [...words, ...grammarTasks]

  const categoryTotalCount: Record<string, number> = {}
  allItems.forEach(i => {
    const key = `${i.level}_${i.category}`
    categoryTotalCount[key] = (categoryTotalCount[key] || 0) + 1
  })

  let completedCategories = 0
  Object.entries(progressData).forEach(([key, passed]) => {
    const total = categoryTotalCount[key] || 1
    if (passed >= total) completedCategories++
  })

  let totalCorrectAnswers = 0
  let totalWrongAnswers = 0
  wordStatsMap.forEach(stat => {
    totalCorrectAnswers += stat.correctCount
    totalWrongAnswers += stat.wrongCount
  })
  const accuracy = totalCorrectAnswers + totalWrongAnswers
    ? Math.round((totalCorrectAnswers / (totalCorrectAnswers + totalWrongAnswers)) * 100)
    : 0

  const wordKeysSet = useMemo(() => new Set(words.map(w => `${w.slovak}|${w.russian}`)), [])
  const uniqueLearnedWords = useMemo(() => {
    let count = 0
    for (const [key, stat] of wordStatsMap.entries()) {
      if (wordKeysSet.has(key) && isWordLearned(stat)) {
        count++
      }
    }
    return count
  }, [wordStatsMap, wordKeysSet])

  const today = new Date()
  const last30Days = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(today.getDate() - i); return d.toISOString().slice(0, 10)
  }).reverse(), [today])
  const activitySet = new Set(activeDates)
  const activeDaysCount = activeDates.filter(date => last30Days.includes(date)).length

  const levelIcons: Record<string, React.ReactNode> = {
    A1: "🌱",
    A2: "🚀",
    B1: "🏆",
    B2: "🔥",
    C1: "💎",
  }

  const levelColors: Record<string, string> = {
    A1: "#22c55e",
    A2: "#0ea5e9",
    B1: "#eab308",
    B2: "#f97316",
    C1: "#a855f7",
  }

  // Вычисляем прогресс по уровням на основе завершённых категорий
  const levelStats = useMemo(() => {
    const levels = ["A1", "A2", "B1", "B2", "C1"] as const
    return levels.map(level => {
      const items = allItems.filter(i => i.level === level)
      if (!items.length) return { level, total: 0, learned: 0, percent: 0 }
      const uniqueCategories = new Set(items.map(i => i.category))
      let completed = 0
      uniqueCategories.forEach(cat => {
        const key = `cat_progress_${level}_${cat}`
        const passed = progressData[key] || 0
        const totalInCat = items.filter(i => i.category === cat).length
        if (passed >= totalInCat) completed++
      })
      const total = uniqueCategories.size
      const percent = total ? (completed / total) * 100 : 0
      return { level, total, learned: completed, percent }
    })
  }, [allItems, progressData])

  const hardWords = useMemo(() => {
    const wordsList: { word: string; translation: string; wrong: number; correct: number }[] = []
    wordStatsMap.forEach((stat, key) => {
      if (stat.wrongCount > 0 || stat.correctCount > 0) {
        const [slovak, russian] = key.split("|")
        wordsList.push({ word: slovak, translation: russian, wrong: stat.wrongCount, correct: stat.correctCount })
      }
    })
    wordsList.sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
    return wordsList.slice(0, 5)
  }, [wordStatsMap])

  const alphabet = [
    { letter: "Á / á", sound: "Долгая [а]", example: "káva" },
    { letter: "Ä / ä", sound: "Широкая [э]", example: "mäso" },
    { letter: "Č / č", sound: "Мягкая [ч]", example: "čaj" },
    { letter: "Ď / ď", sound: "Мягкая [дь]", example: "ďakujem" },
    { letter: "Dz / dz", sound: "Слитный [дз]", example: "odovzdať" },
    { letter: "Dž / dž", sound: "Слитный [дж]", example: "džús" },
    { letter: "Ľ / ľ", sound: "Мягкая [ль]", example: "ľudia" },
    { letter: "Ĺ / ĺ", sound: "Долгий [л]", example: "dĺžka" },
    { letter: "Ň / ň", sound: "Мягкая [нь]", example: "neňo" },
    { letter: "Ô / ô", sound: "Дифтонг [уо]", example: "stôl" },
    { letter: "Ŕ / ŕ", sound: "Долгий [р]", example: "vŕba" },
    { letter: "Š / š", sound: "Мягкая [ш]", example: "škola" },
    { letter: "Ť / ť", sound: "Мягкая [ть]", example: "tešiť" },
    { letter: "Ž / ž", sound: "Мягкая [ж]", example: "žena" },
  ]

  const filteredEntries = useMemo(() => {
    let filtered = allItems
    if (levelFilter !== "all") {
      filtered = filtered.filter(i => i.level === levelFilter)
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(i =>
        i.slovak.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.russian.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [allItems, levelFilter, searchQuery])

  const handleLevelClick = (levelStat: any) => {
    setSelectedLevel(levelStat)
  }

  return (
    <div className="w-full px-4 py-6 pb-24">
      {/* Заголовок */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center gap-2">
          <span className="text-4xl md:text-5xl">📚</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Справочник
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Статистика, алфавит и словарь</p>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
      >
        {[
          { value: uniqueLearnedWords, label: "слов изучено", icon: <FaBook className="text-orange-500 text-3xl" />, gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20", border: "border-orange-200 dark:border-orange-800", textColor: "text-orange-600 dark:text-orange-400" },
          { value: completedCategories, label: "тем завершено", icon: <FaCheckCircle className="text-green-500 text-3xl" />, gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20", border: "border-green-200 dark:border-green-800", textColor: "text-green-600 dark:text-green-400" },
          { value: accuracy, suffix: "%", label: "точность", icon: <FaTrophy className="text-yellow-500 text-3xl" />, gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20", border: "border-yellow-200 dark:border-yellow-800", textColor: "text-yellow-600 dark:text-yellow-400" }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -12px rgba(0,0,0,0.15)" }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 shadow-lg border ${stat.border} text-center transition-all duration-200`}
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className={`text-4xl font-black ${stat.textColor}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
            </p>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Активность */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-8 shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-orange-500" /> Активность за последние 30 дней
            </h3>
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-1 min-w-max">
                {last30Days.map((day, idx) => {
                  const isActive = activitySet.has(day)
                  const dayNum = new Date(day).getDate()
                  return (
                    <motion.div
                      key={day}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.005 }}
                      whileHover={{ scale: 1.1 }}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                      title={day}
                    >
                      {dayNum}
                    </motion.div>
                  )
                })}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Вы занимались <span className="font-bold text-orange-500">{activeDaysCount}</span> из 30 дней
            </p>
          </div>
          <div className="flex-shrink-0">
            <CircularProgress percent={(activeDaysCount / 30) * 100} label="% дней" color="#f97316" size={90} />
          </div>
        </div>
      </motion.div>

      {/* Прогресс по уровням */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2 px-1">
          <FaGraduationCap className="text-orange-500" /> Прогресс по уровням (нажмите для деталей)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {levelStats.map((stat) => (
            <motion.div
              key={stat.level}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLevelClick(stat)}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center cursor-pointer transition-all"
            >
              <CircularProgress
                percent={stat.percent}
                label={stat.level}
                color={levelColors[stat.level]}
                size={110}
                icon={levelIcons[stat.level]}
              />
              <p className="text-sm font-semibold mt-2 text-gray-700 dark:text-gray-300">
                {stat.learned} / {stat.total} тем
              </p>
              <div className="w-full mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.percent}%`, backgroundColor: levelColors[stat.level] }}
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">Нажмите для деталей</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Самые сложные слова */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaSkull className="text-red-500" /> Самые сложные слова
        </h3>
        {hardWords.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">Пока нет сложных слов!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Продолжайте в том же духе, отлично работаете.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {hardWords.map((w, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{w.word}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{w.translation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-500">Ошибок: {w.wrong}</p>
                    <p className="text-xs text-green-500">Правильно: {w.correct}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
              <p className="text-xs text-gray-600 dark:text-gray-300">💡 Повторите эти слова в карточках или письме, чтобы улучшить результат.</p>
            </div>
          </>
        )}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaQuestionCircle className="text-purple-500" /> Часто задаваемые вопросы
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {[
            { icon: <FaStar className="text-yellow-500" />, q: "Как заработать XP?", a: "Тест – 10 XP, письмо – 15 XP, карточки – 5 XP. Бонус за урок – 50 XP." },
            { icon: <FaFire className="text-orange-500" />, q: "Зачем нужна серия?", a: "Серия мотивирует заниматься каждый день." },
            { icon: <FaRegSmile className="text-green-500" />, q: "Можно ли учить слово несколько раз в день?", a: "XP начисляется только раз в день, но повторять можно сколько угодно." },
            { icon: <FaHeart className="text-red-500" />, q: "Как работают жизни?", a: "При старте урока или кнопке «Попробовать снова» жизни сбрасываются до 3." },
            { icon: <FaBook className="text-blue-500" />, q: "Как считаются изученные слова?", a: "Слово считается изученным, если вы ответили на него правильно минимум 2 раза и количество правильных ответов не меньше количества ошибок. Учитываются только лексические слова (без грамматики)." }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
              <p className="font-bold flex items-center gap-2 text-gray-800 dark:text-white">{item.icon} {item.q}</p>
              <p className="text-gray-600 dark:text-gray-400 pl-6 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Алфавит */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2">🔤 Особые буквы и произношение</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Значок над буквой (dĺžeň) удлиняет звук, птичка (mäkčeň) смягчает.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left text-gray-600 dark:text-gray-400">Буква</th>
                <th className="pb-2 text-left text-gray-600 dark:text-gray-400">Звук</th>
                <th className="pb-2 text-left text-gray-600 dark:text-gray-400">Пример</th>
              </tr>
            </thead>
            <tbody>
              {alphabet.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => speakText(item.example, "sk-SK")}>
                  <td className="py-2 text-orange-600 dark:text-orange-400 font-black">{item.letter}</td>
                  <td className="py-2 text-gray-700 dark:text-gray-300">{item.sound}</td>
                  <td className="py-2 text-gray-500 dark:text-gray-400 italic flex items-center gap-1">
                    {item.example}
                    <FaVolumeUp className="text-gray-400 text-xs ml-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Словарь */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaSearch className="text-orange-500" /> Интерактивный словарь ({allItems.length})
        </h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {["all", "A1", "A2", "B1", "B2", "C1"].map(level => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                levelFilter === level
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {level === "all" ? "Все уровни" : level}
            </button>
          ))}
        </div>
        <div className="relative mb-5">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск слова по-словацки или по-русски..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl font-medium focus:ring-2 focus:ring-orange-400 transition outline-none text-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scroll">
          {filteredEntries.length ? (
            filteredEntries.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.005 }}
                whileHover={{ backgroundColor: "rgba(249,115,22,0.08)" }}
                onClick={() => speakText(item.slovak, "sk-SK")}
                className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-gray-800 dark:text-white">{item.slovak}</p>
                    <button onClick={(e) => { e.stopPropagation(); speakText(item.slovak, "sk-SK"); }} className="text-gray-400 hover:text-orange-500 transition" title="Озвучить"><FaVolumeUp size={14} /></button>
                    <span className="text-[10px] font-black uppercase bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full text-orange-700 dark:text-orange-300">{item.level}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.russian}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Ничего не найдено</p>
          )}
        </div>
      </motion.div>

      <LevelDetailModal
        levelData={selectedLevel}
        onClose={() => setSelectedLevel(null)}
        levelColor={selectedLevel ? levelColors[selectedLevel.level] : "#f97316"}
        levelIcon={selectedLevel ? levelIcons[selectedLevel.level] : "📚"}
        allItems={allItems}
        wordStatsMap={wordStatsMap}
        progressData={progressData}
      />
    </div>
  )
}