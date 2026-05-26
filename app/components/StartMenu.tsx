"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  FaKeyboard,
  FaPencilAlt,
  FaLayerGroup,
  FaSeedling,
  FaRocket,
  FaTrophy,
  FaFire,
  FaGem,
  FaUserCircle,
  FaStar,
  FaGraduationCap,
  FaRegSmile,
} from "react-icons/fa"
import { words, type LanguageLevel } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import StreakWidget from "./StreakWidget"
import CategoryCard from "./CategoryCard"
import { playModeSwitchSound, initAudio } from "../../lib/sounds"
import ProfileModal from "./ProfileModal"
import { type Settings } from "../../hooks/useSettings"
import { type Theme } from "../../hooks/useTheme"
import { useAchievements } from "../../hooks/useAchievements"
import { canAccessLevel } from "../../lib/levels"

export type GameMode = "choice" | "write" | "flashcard"

type StartMenuProps = {
  onSelectCategory: (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => void
  userLevel: LanguageLevel
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
  userLevel,
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
    if (saved === "choice" || saved === "write" || saved === "flashcard") {
      setGameMode(saved)
    }
  }, [setGameMode])

  useEffect(() => {
    localStorage.setItem("gameMode", gameMode)
  }, [gameMode])

  const handleModeChange = useCallback(
    (mode: GameMode) => {
      if (mode !== gameMode) {
        playModeSwitchSound()
        setGameMode(mode)
      }
    },
    [gameMode, setGameMode]
  )

  const activePool = useMemo(() => {
    return studyTab === "vocab" ? words : grammarTasks
  }, [studyTab])

  const levels = useMemo(
    () => [
      {
        code: "A1" as LanguageLevel,
        title: "Уровень A1",
        icon: <FaSeedling className="text-xl text-green-500" />,
        desc: "Начальный",
      },
      {
        code: "A2" as LanguageLevel,
        title: "Уровень A2",
        icon: <FaRocket className="text-xl text-blue-500" />,
        desc: "Элементарный",
      },
      {
        code: "B1" as LanguageLevel,
        title: "Уровень B1",
        icon: <FaTrophy className="text-xl text-yellow-500" />,
        desc: "Пороговый",
      },
      {
        code: "B2" as LanguageLevel,
        title: "Уровень B2",
        icon: <FaFire className="text-xl text-orange-500" />,
        desc: "Продвинутый",
      },
      {
        code: "C1" as LanguageLevel,
        title: "Уровень C1",
        icon: <FaGem className="text-xl text-purple-500" />,
        desc: "Экспертный",
      },
    ],
    []
  )

  const getCategoriesForLevel = useCallback(
    (levelCode: LanguageLevel) => {
      const categoriesSet = new Set(
        activePool.filter((word) => word.level === levelCode).map((word) => word.category)
      )

      return Array.from(categoriesSet).map((catName) => {
        const wordsInCat = activePool.filter(
          (word) => word.category === catName && word.level === levelCode
        )

        const totalCount = wordsInCat.length
        const passedCount = progressData[`cat_progress_${levelCode}_${catName}`] ?? 0

        return {
          name: catName,
          passedCount,
          totalCount,
          isCompleted: passedCount >= totalCount,
        }
      })
    },
    [activePool, progressData]
  )

  const avatarIcon = () => {
    switch (avatar) {
      case "student":
        return <FaGraduationCap className="text-3xl text-white drop-shadow-md" />
      case "hero":
        return <FaTrophy className="text-3xl text-white drop-shadow-md" />
      case "cat":
        return <FaRegSmile className="text-3xl text-white drop-shadow-md" />
      case "star":
        return <FaStar className="text-3xl text-white drop-shadow-md" />
      case "fire":
        return <FaFire className="text-3xl text-white drop-shadow-md" />
      default:
        return <FaUserCircle className="text-3xl text-white drop-shadow-md" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 -mt-4"
    >
      {/* Заголовок */}
      <div className="text-center px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl md:text-4xl">🎯</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent break-words">
            Изучение
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs sm:text-sm md:text-base px-2">
          Выбери тему и уровень, чтобы начать
        </p>
      </div>

      <StreakWidget streak={streak} activeDates={activeDates} />

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide flex items-center gap-2">
          <span>🎮</span> Режимы обучения
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {(["choice", "write", "flashcard"] as const).map((mode, index) => (
            <motion.button
              key={mode}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
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

      <div className="mb-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
        Твой уровень: {userLevel}. Задания выше уровня видны, но пока недоступны.
      </div>

      <div className="space-y-8">
        {levels.map((level, levelIdx) => {
          const isLocked = !canAccessLevel(userLevel, level.code)
          const categories = getCategoriesForLevel(level.code)

          if (!categories.length) return null

          return (
            <motion.div
              key={level.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIdx * 0.1 }}
              className={isLocked ? "opacity-60" : ""}
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {level.icon}

                <h2
                  className={`text-2xl font-black ${
                    isLocked
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {level.title}
                </h2>

                <span className="text-sm text-gray-500">{level.desc}</span>

                {isLocked && (
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    🔒 Закрыто
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat, catIdx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: levelIdx * 0.05 + catIdx * 0.03 }}
                    whileHover={isLocked ? {} : { y: -4 }}
                  >
                    <CategoryCard
  name={cat.name}
  passedCount={cat.passedCount}
  totalCount={cat.totalCount}
  isCompleted={cat.isCompleted}
  isLocked={isLocked}
  onSelect={() => {
    if (!isLocked) {
      onSelectCategory(cat.name, level.code, studyTab)
    }
  }}
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