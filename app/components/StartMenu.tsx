"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { words, type LanguageLevel } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import StreakWidget from "./StreakWidget"
import TreeLevel from "./TreeLevel"
import { playModeSwitchSound, initAudio } from "../../lib/sounds"
import SettingsModal from "./SettingsModal"
import { type Settings } from "../../hooks/useSettings"
import { type Theme } from "../../hooks/useTheme"

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
}: StartMenuProps) {
  const [studyTab, setStudyTab] = useState<"vocab" | "grammar">("vocab")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  const activePool = useMemo(() => {
    return studyTab === "vocab" ? words : grammarTasks
  }, [studyTab])

 const levels = useMemo(() => [
  { code: "A1" as LanguageLevel, title: "Уровень A1", icon: "🌱", desc: "Начальный" },
  { code: "A2" as LanguageLevel, title: "Уровень A2", icon: "🚀", desc: "Элементарный" },
  { code: "B1" as LanguageLevel, title: "Уровень B1", icon: "🏆", desc: "Пороговый" },
  { code: "B2" as LanguageLevel, title: "Уровень B2", icon: "🔥", desc: "Продвинутый" },
  { code: "C1" as LanguageLevel, title: "Уровень C1", icon: "💎", desc: "Экспертный" },
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

  return (
    <>
      <div className="w-full max-w-md mx-auto px-4 py-6 pb-24 animate-fadeIn">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <div>
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-wide">Твой прогресс</h2>
              <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{xp} XP</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xl text-gray-500 hover:text-orange-500 transition-colors p-1"
              aria-label="Настройки"
            >
              ⚙️
            </button>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => handleModeChange("choice")}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  gameMode === "choice" 
                    ? "bg-white dark:bg-gray-600 text-orange-500 shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Тест
              </button>
              <button
                onClick={() => handleModeChange("write")}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  gameMode === "write" 
                    ? "bg-white dark:bg-gray-600 text-orange-500 shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Письмо
              </button>
              <button
                onClick={() => handleModeChange("flashcard")}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  gameMode === "flashcard" 
                    ? "bg-white dark:bg-gray-600 text-orange-500 shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                Карточки
              </button>
            </div>
          </div>
        </div>

        <StreakWidget streak={streak} activeDates={activeDates} />

        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 mb-6">
          <button
            onClick={() => setStudyTab("vocab")}
            className={`py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              studyTab === "vocab"
                ? "bg-white dark:bg-gray-600 text-orange-500 border-b-4 border-orange-200 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <span>💬</span> Лексика
          </button>
          <button
            onClick={() => setStudyTab("grammar")}
            className={`py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              studyTab === "grammar"
                ? "bg-white dark:bg-gray-600 text-orange-500 border-b-4 border-orange-200 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <span>⚙️</span> Грамматика
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
    </>
  )
}