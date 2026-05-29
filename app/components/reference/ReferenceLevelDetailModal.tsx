"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaChevronDown, FaChevronUp, FaVolumeUp, FaCheckCircle } from "react-icons/fa"
import { words } from "../../../data/words"
import { grammarTasks } from "../../../data/grammar"
import { type WordStats } from "../../../lib/game"
import CircularProgress from "../shared/CircularProgress"
import { isWordLearned } from "./ReferenceUtils"
type LevelDetailModalProps = {
  levelData: any
  onClose: () => void
  levelColor: string
  levelIcon: React.ReactNode
  allItems: any[]
  wordStatsMap: Map<string, WordStats>
  progressData: Record<string, number>
}

export default function ReferenceLevelDetailModal({
  levelData,
  onClose,
  levelColor,
  levelIcon,
  allItems,
  wordStatsMap,
  progressData,
}: LevelDetailModalProps) {
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