"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { words } from "@/data/words"
import type { Word, LanguageLevel } from "@/data/words"
import { categoryIcons } from "@/lib/categoryIcons"
import WordCard from "./WordCard"
import { SkeletonTextsGrid } from "../shared/Skeleton"
import { FaFilter, FaTimes, FaSearch, FaTrashAlt, FaVolumeUp } from "react-icons/fa"
import toast from "react-hot-toast"

const levels: { value: LanguageLevel | "all"; label: string }[] = [
  { value: "all", label: "Все уровни" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
]

export default function WordsMenu() {
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | "all">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Уникальные категории из данных
  const categories = useMemo(() => {
    const cats = [...new Set(words.map((w) => w.category))]
    return ["all", ...cats]
  }, [])

  const filteredWords = useMemo(() => {
    let result = [...words]

    if (selectedLevel !== "all") {
      result = result.filter((w) => w.level === selectedLevel)
    }
    if (selectedCategory !== "all") {
      result = result.filter((w) => w.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase()
      result = result.filter(
        (w) =>
          w.slovak.toLowerCase().includes(lower) ||
          w.russian.toLowerCase().includes(lower)
      )
    }
    return result
  }, [selectedLevel, selectedCategory, searchQuery])

  const clearFilters = () => {
    setSelectedLevel("all")
    setSelectedCategory("all")
    setSearchQuery("")
  }

  const hasActiveFilters = selectedLevel !== "all" || selectedCategory !== "all" || searchQuery !== ""

  const handleSpeak = (word: Word) => {
    if (!window.speechSynthesis) {
      toast.error("Озвучивание не поддерживается")
      return
    }
    const utterance = new SpeechSynthesisUtterance(word.slovak)
    utterance.lang = "sk-SK"
    utterance.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="w-full px-4 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Словарь
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Изучай живую словацкую лексику по уровням и темам
        </p>
      </motion.div>

      {/* Фильтры */}
      <div className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaFilter aria-hidden="true" />
            <span className="font-bold">Фильтры</span>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="words-search" className="sr-only">Поиск слов</label>
            <input
              id="words-search"
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition text-gray-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Очистить поиск"
              >
                <FaTimes size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLevel !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-sm font-medium">
                Уровень: {selectedLevel}
                <button onClick={() => setSelectedLevel("all")} className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5" aria-label="Убрать фильтр уровня">
                  <FaTimes size={12} aria-hidden="true" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium">
                Тема: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5" aria-label="Убрать фильтр темы">
                  <FaTimes size={12} aria-hidden="true" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium">
                Поиск: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5" aria-label="Очистить поиск">
                  <FaTimes size={12} aria-hidden="true" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              aria-label="Сбросить все фильтры"
            >
              <FaTrashAlt size={12} aria-hidden="true" /> Сбросить всё
            </button>
          </div>
        )}

        {/* Кнопки уровней */}
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Фильтр по уровню">
          {levels.map((level) => (
            <motion.button
              key={level.value}
              onClick={() => setSelectedLevel(level.value)}
              animate={
                selectedLevel === level.value
                  ? { scale: [1, 1.05, 1] }
                  : { scale: 1 }
              }
              transition={{ repeat: selectedLevel === level.value ? Infinity : 0, duration: 1 }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                selectedLevel === level.value
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              aria-pressed={selectedLevel === level.value}
              aria-label={`Уровень ${level.label}`}
            >
              {level.label}
            </motion.button>
          ))}
        </div>

        {/* Кнопки категорий с иконками */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по теме">
          {categories.map((cat) => {
            const Icon = cat === "all" ? null : categoryIcons[cat]
            return (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                animate={
                  selectedCategory === cat
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ repeat: selectedCategory === cat ? Infinity : 0, duration: 1 }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                aria-pressed={selectedCategory === cat}
                aria-label={`Тема: ${cat === "all" ? "Все темы" : cat}`}
              >
                {Icon && <Icon />}
                <span>{cat === "all" ? "Все темы" : cat}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Список слов */}
      {!mounted ? (
        <SkeletonTextsGrid />
      ) : filteredWords.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Нет слов по выбранным фильтрам.</p>
          <button onClick={clearFilters} className="mt-4 text-orange-500 font-bold underline" aria-label="Сбросить фильтры">
            Сбросить фильтры
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.03 } },
          }}
        >
          <AnimatePresence>
            {filteredWords.map((word) => (
              <WordCard key={word.slovak + word.level} word={word} onSpeak={handleSpeak} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}