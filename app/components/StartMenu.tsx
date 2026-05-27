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
  FaBookOpen,
  FaLanguage,
  FaLock,
} from "react-icons/fa"
import { words, type LanguageLevel } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import StreakWidget from "./StreakWidget"
import CategoryCard from "./CategoryCard"
import { playModeSwitchSound, initAudio } from "../../lib/sounds"
import ProfileModal from "./ProfileModal"
import { useAchievements } from "../../hooks/useAchievements"
import { canAccessLevel, getNextLevel, type UserLevel } from "../../lib/levels"

export type GameMode = "choice" | "write" | "flashcard"

type StartMenuProps = {
  onSelectCategory: (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => void
  userLevel: UserLevel
  xp: number
  progressData: Record<string, number>
  streak: number
  activeDates: string[]
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
  correctAnswersCount: number
  totalClicksCount: number
  learnedWordsCount: number
  completedCategoriesCount: number
}

const levelIcons: Record<LanguageLevel, React.ReactNode> = {
  A1: <FaSeedling className="text-xl text-green-500" />,
  A2: <FaRocket className="text-xl text-blue-500" />,
  B1: <FaTrophy className="text-xl text-yellow-500" />,
  B2: <FaFire className="text-xl text-orange-500" />,
  C1: <FaGem className="text-xl text-purple-500" />,
  C2: <FaGem className="text-xl text-gray-500" />,
}

const levelTitles: Record<LanguageLevel, string> = {
  A1: "Уровень A1",
  A2: "Уровень A2",
  B1: "Уровень B1",
  B2: "Уровень B2",
  C1: "Уровень C1",
  C2: "Уровень C2",
}

const levelDescs: Record<LanguageLevel, string> = {
  A1: "Начальный",
  A2: "Элементарный",
  B1: "Пороговый",
  B2: "Продвинутый",
  C1: "Экспертный",
  C2: "Профессиональный",
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
  correctAnswersCount,
  totalClicksCount,
  learnedWordsCount,
  completedCategoriesCount,
}: StartMenuProps) {
  const [studyTab, setStudyTab] = useState<"vocab" | "grammar">("vocab")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [avatar, setAvatar] = useState<string>(() => {
    if (typeof window === "undefined") return "default"
    return localStorage.getItem("slovak_avatar") || "default"
  })
  const { unlocked } = useAchievements()

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

  const getCategoriesForLevel = useCallback((levelCode: LanguageLevel) => {
    const categoriesSet = new Set(activePool.filter(w => w.level === levelCode).map(w => w.category))
    return Array.from(categoriesSet).map(catName => {
      const wordsInCat = activePool.filter(w => w.category === catName && w.level === levelCode)
      const totalCount = wordsInCat.length
      const passedCount = progressData[`cat_progress_${levelCode}_${catName}`] ?? 0
      return { name: catName, passedCount, totalCount, isCompleted: passedCount >= totalCount }
    })
  }, [activePool, progressData])

  const levelsToShow: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1"]

  // Определяем, какой уровень нужен для открытия (только для подсказки)
  const getRequiredLevelName = (level: LanguageLevel): string | null => {
    if (level === "A1") return null
    const map: Record<LanguageLevel, LanguageLevel> = {
      A1: "A1",
      A2: "A1",
      B1: "A2",
      B2: "B1",
      C1: "B2",
      C2: "C1",
    }
    return map[level]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      {/* Заголовок */}
      <div className="text-center mb-2 overflow-x-visible px-2">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block max-w-full"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap leading-[1.3] pb-1">
            <span className="text-3xl sm:text-5xl md:text-6xl leading-[1.3]">🎯</span>
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent break-words whitespace-normal sm:whitespace-nowrap leading-[1.3] pb-0.5">
              Изучение
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-2" />
        </motion.div>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-base">
          Выбери тему и уровень, чтобы начать
        </p>
      </div>

      <StreakWidget streak={streak} activeDates={activeDates} />

      <div className="grid grid-cols-3 gap-4">
        {(["choice", "write", "flashcard"] as const).map((mode, idx) => {
          const icons = {
            choice: <FaKeyboard className="text-2xl" />,
            write: <FaPencilAlt className="text-2xl" />,
            flashcard: <FaLayerGroup className="text-2xl" />,
          }
          const titles = {
            choice: "Тест",
            write: "Письмо",
            flashcard: "Карточки",
          }
          const descriptions = {
            choice: "Выбери правильный вариант",
            write: "Напиши перевод",
            flashcard: "Изучай в удобном темпе",
          }
          const isActive = gameMode === mode
          return (
            <motion.button
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange(mode)}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg"
                  : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={isActive ? "text-white" : "text-orange-500"}>{icons[mode]}</div>
                <h3 className="font-bold text-lg">{titles[mode]}</h3>
              </div>
              <p className={`text-xs ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                {descriptions[mode]}
              </p>
              {isActive && (
                <motion.div
                  layoutId="activeMode"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30"
                  initial={false}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full max-w-md mx-auto">
        <button
          onClick={() => setStudyTab("vocab")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
            studyTab === "vocab"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaBookOpen size={16} />
          <span>Лексика</span>
        </button>
        <button
          onClick={() => setStudyTab("grammar")}
          className={`flex-1 py-2.5 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
            studyTab === "grammar"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaLanguage size={16} />
          <span>Грамматика</span>
        </button>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 px-5 py-4 text-sm font-medium text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/30 shadow-sm flex items-center gap-3">
        <span className="text-2xl">
          {userLevel === null ? "🔓" : userLevel === "C1" ? "🏆" : "📈"}
        </span>
        <span>
          {userLevel === null ? (
            "Для открытия уровней пройдите тест A1 на 100%."
          ) : userLevel === "C1" ? (
            "Поздравляем! Вы достигли максимального уровня C1!"
          ) : (
            `Ваш уровень: ${userLevel}. Пройдите тест ${userLevel} на 100%, чтобы открыть уровень ${getNextLevel(userLevel)}.`
          )}
        </span>
      </div>

      <div className="space-y-10">
        {levelsToShow.map((levelCode, levelIdx) => {
          const isLocked = !canAccessLevel(userLevel, levelCode)
          const categories = getCategoriesForLevel(levelCode)
          if (!categories.length) return null

          const requiredLevel = getRequiredLevelName(levelCode)
          const tooltipText = isLocked && requiredLevel
            ? `Требуется пройти уровень ${requiredLevel} на 100%`
            : ""

          return (
            <motion.div
              key={levelCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIdx * 0.1 }}
              className="relative"
              title={tooltipText}
            >
              {/* Заголовок уровня */}
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="text-2xl">{levelIcons[levelCode]}</div>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">
                  {levelTitles[levelCode]}
                </h2>
                <span className="text-sm text-gray-500">{levelDescs[levelCode]}</span>
                {isLocked && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-gray-200/70 dark:bg-gray-700/70 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <FaLock size={10} /> Закрыто
                  </span>
                )}
              </div>

              {/* Карточки категорий с мягким оверлеем */}
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {categories.map((cat, catIdx) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: levelIdx * 0.05 + catIdx * 0.02 }}
                      whileHover={isLocked ? {} : { y: -2 }}
                    >
                      <CategoryCard
                        name={cat.name}
                        passedCount={cat.passedCount}
                        totalCount={cat.totalCount}
                        isCompleted={cat.isCompleted}
                        isLocked={isLocked}
                        onSelect={() => {
                          if (!isLocked) {
                            onSelectCategory(cat.name, levelCode, studyTab)
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Мягкий оверлей для заблокированного уровня */}
                {isLocked && (
                  <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2 z-10 pointer-events-none">
                    <FaLock className="text-orange-400/80 text-3xl drop-shadow-sm" />
                    <span className="text-gray-700 dark:text-gray-200 text-xs font-medium bg-white/50 dark:bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {requiredLevel ? `Требуется ${requiredLevel}` : "Недоступно"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {isProfileOpen && (
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
      )}
    </motion.div>
  )
}