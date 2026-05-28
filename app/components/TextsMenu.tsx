"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { texts, type SlovakText, type TextLevel, type TextTopic } from "../../data/texts"
import { type UserLevel, canAccessLevel } from "../../lib/levels"
import { FaCheckCircle, FaFilter, FaTimes, FaSearch, FaBrain, FaTrashAlt } from "react-icons/fa"

type TextsMenuProps = {
  onSelectText: (text: SlovakText) => void
  readStatus: Record<string, boolean>
  quizStatus: Record<string, boolean>
  userLevel: UserLevel
}

const topicLabels: Record<TextTopic, string> = {
  pozdravy: "Приветствия",
  rodina: "Семья",
  jedlo: "Еда",
  cestovanie: "Путешествия",
  praca: "Работа",
  zdravie: "Здоровье",
  priroda: "Природа",
  kultura: "Культура",
  technologia: "Технологии",
  zvyky: "Обычаи",
  historia: "История",
  sport: "Спорт",
}

const levelColors: Record<TextLevel, string> = {
  A1: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  A2: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  B1: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  B2: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export default function TextsMenu({ onSelectText, readStatus, quizStatus, userLevel }: TextsMenuProps) {
  const [selectedLevel, setSelectedLevel] = useState<TextLevel | "all">("all")
  const [selectedTopic, setSelectedTopic] = useState<TextTopic | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const levels = useMemo(() => {
    const allLevels = [
      { value: "all" as const, label: "Все доступные" },
      { value: "A1" as const, label: "A1" },
      { value: "A2" as const, label: "A2" },
      { value: "B1" as const, label: "B1" },
      { value: "B2" as const, label: "B2" },
    ]
    return allLevels.filter((level) => {
      if (level.value === "all") return true
      return canAccessLevel(userLevel, level.value)
    })
  }, [userLevel])

  const safeSelectedLevel = selectedLevel !== "all" && !canAccessLevel(userLevel, selectedLevel as TextLevel)
    ? "all"
    : selectedLevel

  const filteredTexts = useMemo(() => {
    let result = texts.filter((text) => canAccessLevel(userLevel, text.level))
    if (safeSelectedLevel !== "all") {
      result = result.filter((text) => text.level === safeSelectedLevel)
    }
    if (selectedTopic !== "all") {
      result = result.filter((text) => text.topic === selectedTopic)
    }
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter((text) => text.title.toLowerCase().includes(lowerQuery))
    }
    return result
  }, [safeSelectedLevel, selectedTopic, searchQuery, userLevel])

  const topics: { value: TextTopic | "all"; label: string }[] = [
    { value: "all", label: "Все темы" },
    ...Object.entries(topicLabels).map(([key, label]) => ({
      value: key as TextTopic,
      label,
    })),
  ]

  const clearFilters = () => {
    setSelectedLevel("all")
    setSelectedTopic("all")
    setSearchQuery("")
  }

  const hasActiveFilters = selectedLevel !== "all" || selectedTopic !== "all" || searchQuery !== ""

  const removeLevelFilter = () => setSelectedLevel("all")
  const removeTopicFilter = () => setSelectedTopic("all")
  const removeSearchFilter = () => setSearchQuery("")

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center gap-2">
          <span className="text-4xl md:text-5xl">📖</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Тексты для чтения
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Улучшай словацкий с интересными текстами</p>
      </motion.div>

      <div className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaFilter />
            <span className="font-bold">Фильтры</span>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={removeSearchFilter}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLevel !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm font-medium">
                Уровень: {selectedLevel}
                <button onClick={removeLevelFilter} className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5">
                  <FaTimes size={12} />
                </button>
              </span>
            )}
            {selectedTopic !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">
                Тема: {topicLabels[selectedTopic]}
                <button onClick={removeTopicFilter} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                  <FaTimes size={12} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">
                Поиск: {searchQuery}
                <button onClick={removeSearchFilter} className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5">
                  <FaTimes size={12} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              <FaTrashAlt size={12} /> Сбросить всё
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {levels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSelectedLevel(level.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                selectedLevel === level.value
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.value}
              onClick={() => setSelectedTopic(topic.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedTopic === topic.value
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTexts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Нет текстов по выбранным фильтрам.</p>
          <button onClick={clearFilters} className="mt-4 text-orange-500 font-bold underline">Сбросить фильтры</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTexts.map((text, idx) => {
              const isRead = readStatus[text.id] || false
              const isQuizDone = quizStatus[text.id] || false
              const progressPercent = isQuizDone ? 100 : (isRead ? 50 : 0)
              return (
                <motion.button
                  key={text.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectText(text)}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-left border border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        {text.title}
                        <div className="flex gap-1">
                          {isRead && <FaCheckCircle className="text-green-500 text-sm" title="Прочитан" />}
                          {isQuizDone && <FaBrain className="text-purple-500 text-sm" title="Викторина пройдена" />}
                        </div>
                      </h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${levelColors[text.level]}`}>
                        {text.level}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {text.wordCount} слов
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {topicLabels[text.topic]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        📝 {text.questions?.length || 0} вопросов
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                      {text.content.substring(0, 100)}...
                    </p>
                    <div className="mt-3">
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-orange-500 font-bold">Читать →</span>
                      {!isRead && <span className="text-xs text-gray-400 dark:text-gray-500">Новое</span>}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}