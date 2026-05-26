"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaKeyboard, FaPencilAlt, FaLayerGroup, FaSeedling, FaRocket, FaTrophy, FaFire, FaGem, FaUserCircle, FaStar, FaGraduationCap, FaRegSmile } from "react-icons/fa"
import { words, type LanguageLevel } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import StreakWidget from "./StreakWidget"
import CategoryCard from "./CategoryCard"
import { playModeSwitchSound, initAudio } from "../../lib/sounds"
import ProfileModal from "./ProfileModal"
import { type Settings } from "../../hooks/useSettings"
import { type Theme } from "../../hooks/useTheme"
import { useAchievements } from "../../hooks/useAchievements"

export type GameMode = "choice" | "write" | "flashcard"

type StartMenuProps = {
  onSelectCategory: (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => void
  xp: number
  progressData: Record<string, number>
  streak: number
  activeDates: string[]
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
  settings: Settings
  onToggleMute: () => void
  onSetSpeechRate: (rate: number) => void
  onSetAutoSpeak: (enabled: boolean) => void
  theme: Theme
  onToggleTheme: () => void
  correctAnswersCount: number
  totalClicksCount: number
  learnedWordsCount: number
  completedCategoriesCount: number
}

export default function StartMenu({
  onSelectCategory,
  xp,
  progressData,
  streak,
  activeDates,
  gameMode,
  setGameMode,
  settings,
  onToggleMute,
  onSetSpeechRate,
  onSetAutoSpeak,
  theme,
  onToggleTheme,
  correctAnswersCount,
  totalClicksCount,
  learnedWordsCount,
  completedCategoriesCount,
}: StartMenuProps) {
  const [studyTab, setStudyTab] = useState<"vocab" | "grammar">("vocab")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [avatar, setAvatar] = useState<string>("default")
  const { unlocked } = useAchievements()

  useEffect(() => {
    const savedAvatar = localStorage.getItem("slovak_avatar")
    if (savedAvatar) setAvatar(savedAvatar)
  }, [])

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar)
    localStorage.setItem("slovak_avatar", newAvatar)
  }

  useEffect(() => {
    initAudio()
    const saved = localStorage.getItem("gameMode")
    if (saved === "choice" || saved === "write" || saved === "flashcard") setGameMode(saved)
  }, [setGameMode])

  useEffect(() => {
    localStorage.setItem("gameMode", gameMode)
  }, [gameMode])

  const handleModeChange = useCallback((mode: GameMode) => {
    if (mode !== gameMode) {
      playModeSwitchSound()
      setGameMode(mode)
    }
  }, [gameMode, setGameMode])

  const activePool = useMemo(() => studyTab === "vocab" ? words : grammarTasks, [studyTab])

  const levels = useMemo(() => [
    { code: "A1" as LanguageLevel, title: "Уровень A1", icon: <FaSeedling className="text-xl text-green-500" />, desc: "Начальный" },
    { code: "A2" as LanguageLevel, title: "Уровень A2", icon: <FaRocket className="text-xl text-blue-500" />, desc: "Элементарный" },
    { code: "B1" as LanguageLevel, title: "Уровень B1", icon: <FaTrophy className="text-xl text-yellow-500" />, desc: "Пороговый" },
    { code: "B2" as LanguageLevel, title: "Уровень B2", icon: <FaFire className="text-xl text-orange-500" />, desc: "Продвинутый" },
    { code: "C1" as LanguageLevel, title: "Уровень C1", icon: <FaGem className="text-xl text-purple-500" />, desc: "Экспертный" },
  ], [])

  const getCategoriesForLevel = useCallback((levelCode: LanguageLevel) => {
    const categoriesSet = new Set(activePool.filter(w => w.level === levelCode).map(w => w.category))
    return Array.from(categoriesSet).map(catName => {
      const wordsInCat = activePool.filter(w => w.category === catName && w.level === levelCode)
      const totalCount = wordsInCat.length
      const passedCount = progressData[`cat_progress_${levelCode}_${catName}`] ?? 0
      return { name: catName, passedCount, totalCount, isCompleted: passedCount >= totalCount }
    })
  }, [activePool, progressData])

  const avatarIcon = () => {
    switch (avatar) {
      case "student": return <FaGraduationCap className="text-3xl text-white drop-shadow-md" />
      case "hero": return <FaTrophy className="text-3xl text-white drop-shadow-md" />
      case "cat": return <FaRegSmile className="text-3xl text-white drop-shadow-md" />
      case "star": return <FaStar className="text-3xl text-white drop-shadow-md" />
      case "fire": return <FaFire className="text-3xl text-white drop-shadow-md" />
      default: return <FaUserCircle className="text-3xl text-white drop-shadow-md" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Заголовок */}
      <div className="text-center px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black flex items-center justify-center gap-2 flex-wrap">
          <span className="text-3xl sm:text-4xl md:text-5xl">🎯</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent break-words">
            Изучение
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Выбери тему и уровень, чтобы начать</p>
      </div>

      <StreakWidget streak={streak} activeDates={activeDates} />

      {/* Режимы обучения */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
          <span>🎮</span> Режимы обучения
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(["choice", "write", "flashcard"] as const).map((mode, idx) => (
            <motion.button
              key={mode}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange(mode)}
              className={`py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                gameMode === mode
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {mode === "choice" && <FaKeyboard />}
              {mode === "write" && <FaPencilAlt />}
              {mode === "flashcard" && <FaLayerGroup />}
              {mode === "choice" && "Тест"}
              {mode === "write" && "Письмо"}
              {mode === "flashcard" && "Карточки"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Переключение Лексика / Грамматика */}
      <div className="flex gap-4">
        <button
          onClick={() => setStudyTab("vocab")}
          className={`flex-1 py-3 rounded-xl font-bold text-center transition-all ${
            studyTab === "vocab"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span className="text-xl mr-2">📚</span>
          Лексика
        </button>
        <button
          onClick={() => setStudyTab("grammar")}
          className={`flex-1 py-3 rounded-xl font-bold text-center transition-all ${
            studyTab === "grammar"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span className="text-xl mr-2">⚙️</span>
          Грамматика
        </button>
      </div>

      {/* Список уровней с крупными карточками */}
      <div className="space-y-12">
        {levels.map((level, levelIdx) => {
          const categories = getCategoriesForLevel(level.code)
          if (!categories.length) return null
          return (
            <motion.div
              key={level.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIdx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                {level.icon}
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">{level.title}</h2>
                <span className="text-sm text-gray-500">{level.desc}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, catIdx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: levelIdx * 0.05 + catIdx * 0.03 }}
                    whileHover={{ y: -4 }}
                  >
                    <CategoryCard
                      name={cat.name}
                      passedCount={cat.passedCount}
                      totalCount={cat.totalCount}
                      isCompleted={cat.isCompleted}
                      onSelect={() => onSelectCategory(cat.name, level.code, studyTab)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        xp={xp}
        streak={streak}
        correctAnswers={correctAnswersCount}
        totalClicks={totalClicksCount}
        learnedWords={learnedWordsCount}
        completedCategories={completedCategoriesCount}
        unlockedAchievements={unlocked}
        avatar={avatar}
        onAvatarChange={handleAvatarChange}
      />
    </motion.div>
  )
}