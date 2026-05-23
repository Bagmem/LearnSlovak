"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { FaBook, FaGraduationCap, FaKeyboard, FaRegSmile, FaCog, FaPencilAlt, FaLayerGroup, FaSeedling, FaRocket, FaTrophy, FaFire, FaGem, FaUserCircle, FaStar } from "react-icons/fa"
import { words, type LanguageLevel } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import StreakWidget from "./StreakWidget"
import TreeLevel from "./TreeLevel"
import { playModeSwitchSound, initAudio } from "../../lib/sounds"
import SettingsModal from "./SettingsModal"
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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

  const nextLevelXp = Math.ceil(xp / 100) * 100
  const xpToNext = nextLevelXp - xp
  const progressToNext = (xp % 100) / 100 * 100

  useEffect(() => {
    initAudio()
    const saved = localStorage.getItem("gameMode")
    if (saved === "choice" || saved === "write" || saved === "flashcard") {
      setGameMode(saved)
    }
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
    const categoriesSet = new Set(
      activePool.filter((w) => w.level === levelCode).map((w) => w.category)
    )
    return Array.from(categoriesSet).map((catName) => {
      const wordsInCat = activePool.filter((w) => w.category === catName && w.level === levelCode)
      const totalCount = wordsInCat.length
      const storageKey = `cat_progress_${levelCode}_${catName}`
      const passedCount = progressData[storageKey] ?? 0
      const isCompleted = passedCount >= totalCount
      return { name: catName, passedCount, totalCount, isCompleted }
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
    <>
      <div className="w-full max-w-md mx-auto px-4 py-6 pb-24 animate-fadeIn">
        {/* Плашка прогресса с кликабельным аватаром */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-2xl p-4 mb-6 shadow-md card-hover transition-transform"
        >
          <div className="flex items-center gap-3">
            {avatarIcon()}
            <div className="flex-1 text-left">
              <div className="flex justify-between items-baseline">
                <h2 className="text-xs font-bold text-white/80 uppercase tracking-wide">Твой прогресс</h2>
                <span className="text-2xl font-black text-white">{xp} XP</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>До следующего уровня</span>
                  <span>{xpToNext} XP</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </button>

        <StreakWidget streak={streak} activeDates={activeDates} />

        <div className="flex items-center justify-end gap-2 mb-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-gray-500 hover:text-orange-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Настройки"
          >
            <FaCog size={20} />
          </button>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl border border-gray-200 dark:border-gray-600 mb-6">
          <button
            onClick={() => handleModeChange("choice")}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              gameMode === "choice" 
                ? "bg-white dark:bg-gray-600 text-orange-500 shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <FaKeyboard size={12} /> Тест
          </button>
          <button
            onClick={() => handleModeChange("write")}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              gameMode === "write" 
                ? "bg-white dark:bg-gray-600 text-orange-500 shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <FaPencilAlt size={12} /> Письмо
          </button>
          <button
            onClick={() => handleModeChange("flashcard")}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
              gameMode === "flashcard" 
                ? "bg-white dark:bg-gray-600 text-orange-500 shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <FaLayerGroup size={12} /> Карточки
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 mb-6">
          <button
            onClick={() => setStudyTab("vocab")}
            className={`py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              studyTab === "vocab"
                ? "bg-white dark:bg-gray-600 text-orange-500 shadow-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <FaBook /> Лексика
          </button>
          <button
            onClick={() => setStudyTab("grammar")}
            className={`py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              studyTab === "grammar"
                ? "bg-white dark:bg-gray-600 text-orange-500 shadow-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <FaRegSmile /> Грамматика
          </button>
        </div>

        <div className="space-y-4">
          {levels.map((level) => {
            const categories = getCategoriesForLevel(level.code)
            if (categories.length === 0) return null
            return (
              <TreeLevel
                key={level.code}
                levelCode={level.code}
                levelTitle={level.title}
                levelIcon={level.icon}
                levelDesc={level.desc}
                categories={categories}
                onSelectCategory={(categoryName) =>
                  onSelectCategory(categoryName, level.code, studyTab)
                }
              />
            )
          })}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onToggleMute={onToggleMute}
        onSetSpeechRate={onSetSpeechRate}
        onSetAutoSpeak={onSetAutoSpeak}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

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
    </>
  )
}