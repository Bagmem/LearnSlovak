"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaKeyboard, FaPencilAlt, FaLayerGroup,
  FaSeedling, FaRocket, FaTrophy, FaFire, FaGem,
  FaBookOpen, FaLanguage, FaLock, FaGraduationCap,
  FaRedo, FaBook, FaChartLine, FaUnlock,
} from "react-icons/fa"
import { words, type LanguageLevel, type Word } from "../../../data/words"
import { grammarTasks, grammarExercises, type GrammarExercise } from "../../../data/grammar"
import StreakWidget from "../streak/StreakWidget"
import CategoryCard from "./CategoryCard"
import GrammarPracticeScreen from "./GrammarPracticeScreen"
import { playModeSwitchSound, initAudio } from "../../../lib/sounds"
import ProfileModal from "../ProfileModal"
import { useAchievements } from "../../../hooks/useAchievements"
import { canAccessLevel, getNextLevel, type UserLevel } from "../../../lib/levels"
import type { WordStats } from "../../../lib/game"
import { SkeletonLevelCard } from "../shared/Skeleton"

export type GameMode = "choice" | "write" | "flashcard"

type StartMenuProps = {
  onSelectCategory: (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar", customWords?: Word[]) => void
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
  wordStatsMap: Map<string, WordStats>
  onStartReview?: (words: Word[]) => void
  onXpEarned?: (amount: number, source: string) => void
  setXp?: (value: number | ((prev: number) => number)) => void
  setProgressData?: (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void
  studySubTab: "vocab" | "grammar"
}

const levelIcons: Record<LanguageLevel, React.ReactNode> = {
  A1: <FaSeedling className="text-lg" />,
  A2: <FaRocket className="text-lg" />,
  B1: <FaTrophy className="text-lg" />,
  B2: <FaFire className="text-lg" />,
  C1: <FaGem className="text-lg" />,
}

const levelTitles: Record<LanguageLevel, string> = {
  A1: "Уровень A1",
  A2: "Уровень A2",
  B1: "Уровень B1",
  B2: "Уровень B2",
  C1: "Уровень C1",
}

const levelColors: Record<LanguageLevel, { bg: string; border: string; text: string; progress: string }> = {
  A1: { bg: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-600 dark:text-emerald-400", progress: "from-emerald-500 to-green-500" },
  A2: { bg: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20", border: "border-sky-200 dark:border-sky-800", text: "text-sky-600 dark:text-sky-400", progress: "from-sky-500 to-blue-500" },
  B1: { bg: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-600 dark:text-amber-400", progress: "from-amber-500 to-yellow-500" },
  B2: { bg: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20", border: "border-orange-200 dark:border-orange-800", text: "text-orange-600 dark:text-orange-400", progress: "from-orange-500 to-amber-500" },
  C1: { bg: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20", border: "border-purple-200 dark:border-purple-800", text: "text-purple-600 dark:text-purple-400", progress: "from-purple-500 to-indigo-500" },
}

export default function StartMenu({
  onSelectCategory, userLevel, xp, progressData, streak, activeDates, gameMode, setGameMode,
  correctAnswersCount, totalClicksCount, learnedWordsCount, completedCategoriesCount,
  wordStatsMap, onStartReview, onXpEarned, setXp: externalSetXp, setProgressData: externalSetProgressData,
  studySubTab,
}: StartMenuProps) {
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel>("A1")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [avatar, setAvatar] = useState<string>(() => {
    if (typeof window === "undefined") return "default"
    return localStorage.getItem("slovak_avatar") || "default"
  })
  const { unlocked } = useAchievements()
  const [mounted, setMounted] = useState(false)

  const [grammarSession, setGrammarSession] = useState<{
    category: string
    level: LanguageLevel
    exercises: GrammarExercise[]
  } | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar)
    localStorage.setItem("slovak_avatar", newAvatar)
  }

  useEffect(() => {
    initAudio()
    const saved = localStorage.getItem("gameMode")
    if (saved === "choice" || saved === "write" || saved === "flashcard") setGameMode(saved)
  }, [setGameMode])

  useEffect(() => { localStorage.setItem("gameMode", gameMode) }, [gameMode])

  const handleModeChange = useCallback((mode: GameMode) => {
    if (mode !== gameMode) { playModeSwitchSound(); setGameMode(mode) }
  }, [gameMode, setGameMode])

  // Раздельные пулы для лексики и грамматики
  const vocabPool = useMemo(() => words as Word[], [])
  const grammarPool = useMemo(() => grammarExercises as GrammarExercise[], [])

  // Категории для лексики
  const getVocabCategoriesForLevel = useCallback((levelCode: LanguageLevel) => {
    const cats = new Set(vocabPool.filter(w => w.level === levelCode).map(w => w.category))
    return Array.from(cats).map(catName => {
      const items = vocabPool.filter(w => w.category === catName && w.level === levelCode)
      const total = items.length
      const passed = progressData[`cat_progress_${levelCode}_${catName}`] ?? 0
      return { name: catName, passedCount: passed, totalCount: total, isCompleted: passed >= total }
    })
  }, [vocabPool, progressData])

  // Категории для грамматики
  const getGrammarCategoriesForLevel = useCallback((levelCode: LanguageLevel) => {
    const cats = new Set(grammarPool.filter(e => e.level === levelCode).map(e => e.category))
    return Array.from(cats).map(catName => {
      const items = grammarPool.filter(e => e.category === catName && e.level === levelCode)
      const total = items.length
      const passed = progressData[`grammar_progress_${levelCode}_${catName}`] ?? 0
      return { name: catName, passedCount: passed, totalCount: total, isCompleted: passed >= total }
    })
  }, [grammarPool, progressData])

  const getCategoriesForLevel = studySubTab === "grammar" ? getGrammarCategoriesForLevel : getVocabCategoriesForLevel

  const levelsToShow: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1"]

  const getRequiredLevelName = (level: LanguageLevel): string | null => {
    if (level === "A1") return null
    const map: Record<LanguageLevel, LanguageLevel> = { A1: "A1", A2: "A1", B1: "A2", B2: "B1", C1: "B2" }
    return map[level]
  }

  const wordsToReview = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const result: Word[] = []
    for (const [key, stats] of wordStatsMap.entries()) {
      if (stats.nextReview && stats.nextReview <= today) {
        const word = words.find(w => `${w.slovak}|${w.russian}` === key) || grammarTasks.find(w => `${w.slovak}|${w.russian}` === key)
        if (word) result.push(word)
      }
    }
    return result
  }, [wordStatsMap])

  const handleGrammarCategorySelect = useCallback((category: string, level: LanguageLevel) => {
    const ex = grammarExercises.filter(e => e.category === category && e.level === level)
    setGrammarSession({ category, level, exercises: ex })
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
        {[...Array(5)].map((_, i) => <SkeletonLevelCard key={i} />)}
      </div>
    )
  }

  if (grammarSession) {
    return (
      <GrammarPracticeScreen
        exercises={grammarSession.exercises}
        category={grammarSession.category}
        level={grammarSession.level}
        xp={xp}
        setXp={externalSetXp || ((v) => {})}
        progressData={progressData}
        setProgressData={externalSetProgressData || ((v) => {})}
        onXpEarned={onXpEarned}
        onBack={() => setGrammarSession(null)}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
    >
      {/* Заголовок */}
      <div className="text-center mb-2">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block max-w-full"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap leading-[1.3] pb-1">
            <span className="text-3xl sm:text-5xl md:text-6xl leading-[1.3] text-orange-500" aria-hidden="true">
              {studySubTab === "grammar" ? <FaLanguage /> : <FaGraduationCap />}
            </span>
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent break-words whitespace-normal sm:whitespace-nowrap leading-[1.3] pb-0.5">
              {studySubTab === "grammar" ? "Грамматика" : "Лексика"}
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-2" aria-hidden="true" />
        </motion.div>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-base">
          {studySubTab === "grammar"
            ? "Изучай правила и закрепляй их в упражнениях"
            : "Выбери тему и уровень, чтобы начать"}
        </p>
      </div>

      {/* StreakWidget – всегда */}
      <StreakWidget streak={streak} activeDates={activeDates} />

      {/* Режимы только для лексики */}
      {studySubTab === "vocab" && (
        <div className="grid grid-cols-3 gap-4">
          {(["choice", "write", "flashcard"] as const).map((mode, idx) => {
            const icons = { choice: <FaKeyboard className="text-2xl" />, write: <FaPencilAlt className="text-2xl" />, flashcard: <FaLayerGroup className="text-2xl" /> }
            const titles = { choice: "Тест", write: "Письмо", flashcard: "Карточки" }
            const descriptions = { choice: "Выбери правильный вариант", write: "Напиши перевод", flashcard: "Изучай в удобном темпе" }
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
                aria-label={`${titles[mode]}: ${descriptions[mode]}${isActive ? " (активный)" : ""}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={isActive ? "text-white" : "text-orange-500"} aria-hidden="true">{icons[mode]}</div>
                  <h3 className="font-bold text-lg">{titles[mode]}</h3>
                </div>
                <p className={`text-xs ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>{descriptions[mode]}</p>
                {isActive && <motion.div layoutId="activeMode" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30" initial={false} transition={{ duration: 0.2 }} />}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Информационная панель */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 px-5 py-4 text-sm font-medium text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/30 shadow-sm flex items-center gap-3">
        <span className="text-2xl">
          {userLevel === null ? <FaUnlock className="text-amber-500" /> : userLevel === "C1" ? <FaTrophy className="text-yellow-500" /> : <FaChartLine className="text-green-500" />}
        </span>
        <span>
          {userLevel === null
            ? "Для открытия уровней пройдите тест A1 на 100%."
            : userLevel === "C1"
            ? "Поздравляем! Вы достигли максимального уровня C1!"
            : `Ваш уровень: ${userLevel}. Пройдите тест ${userLevel} на 100%, чтобы открыть уровень ${getNextLevel(userLevel)}.`}
        </span>
      </div>

      {/* Повторение слов – только для лексики */}
      {studySubTab === "vocab" && wordsToReview.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-5 transition-all transform hover:shadow-xl"
          onClick={() => onStartReview?.(wordsToReview)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">
                <FaRedo className="inline mr-2" /> Повторить слова
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-white/90 transition-colors duration-300">
                Готово к повторению: {wordsToReview.length} слов
              </p>
            </div>
            <div className="text-3xl transition-transform duration-200 group-hover:scale-110 group-hover:text-white">
              <FaBook />
            </div>
          </div>
        </motion.div>
      )}

      {/* Категории */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLevel}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 flex gap-1 p-2 z-10">
              {levelsToShow.map((levelCode) => {
                const isLocked = !canAccessLevel(userLevel, levelCode)
                const isActive = selectedLevel === levelCode
                const colors = levelColors[levelCode]
                return (
                  <motion.button
                    key={levelCode}
                    onClick={() => { if (!isLocked) setSelectedLevel(levelCode) }}
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`
                      relative px-3 py-1.5 rounded-full font-bold text-xs shadow-sm transition-all duration-300
                      backdrop-blur-sm border
                      ${isActive
                        ? `bg-gradient-to-br ${colors.progress} text-white border-transparent`
                        : isLocked
                          ? "bg-gray-200/80 dark:bg-gray-700/80 text-gray-400 dark:text-gray-500 border-gray-300/50 dark:border-gray-600/50 cursor-not-allowed"
                          : "bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-700/90"
                      }
                    `}
                    disabled={isLocked}
                  >
                    <span className="flex items-center gap-1">
                      {isLocked && <FaLock size={10} />}
                      {levelCode}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {(() => {
              const levelCode = selectedLevel
              const isLocked = !canAccessLevel(userLevel, levelCode)
              const categories = getCategoriesForLevel(levelCode)
              const requiredLevel = getRequiredLevelName(levelCode)
              const colors = levelColors[levelCode]

              return (
                <div className={`p-5 bg-gradient-to-br ${colors.bg}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={colors.text}>{levelIcons[levelCode]}</span>
                    <h3 className={`font-black text-lg ${colors.text}`}>{levelTitles[levelCode]}</h3>
                  </div>

                  {isLocked ? (
                    <div className="flex items-center justify-center py-10">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-black/40 px-4 py-2 rounded-full">
                        {requiredLevel ? `Пройдите ${requiredLevel}` : "Скоро"}
                      </span>
                    </div>
                  ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <motion.div
                          key={cat.name}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + categories.indexOf(cat) * 0.03 }}
                          whileHover={{ y: -2 }}
                        >
                          <CategoryCard
                            name={cat.name}
                            passedCount={cat.passedCount}
                            totalCount={cat.totalCount}
                            isCompleted={cat.isCompleted}
                            isLocked={false}
                            onSelect={() => {
                              if (studySubTab === "grammar") {
                                handleGrammarCategorySelect(cat.name, levelCode)
                              } else {
                                onSelectCategory(cat.name, levelCode, studySubTab)
                              }
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
                      В этом уровне пока нет категорий
                    </p>
                  )}
                </div>
              )
            })()}
          </motion.div>
        </AnimatePresence>
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