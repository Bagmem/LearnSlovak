"use client"

import { useState } from "react"
import { words, type LanguageLevel } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import StreakWidget from "./StreakWidget"

export type GameMode = "choice" | "write"

type StartMenuProps = {
  onSelectCategory: (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => void
  xp: number
  progressData: Record<string, number>
  streak: number
  activeDates: string[]
  gameMode: GameMode
  setGameMode: (mode: GameMode) => void
}

export default function StartMenu({
  onSelectCategory,
  xp,
  progressData,
  streak,
  activeDates,
  gameMode,
  setGameMode,
}: StartMenuProps) {
  // Переключатель режима контента: Лексика (vocab) или Грамматика (grammar)
  const [studyTab, setStudyTab] = useState<"vocab" | "grammar">("vocab")

  const activePool = studyTab === "vocab" ? words : grammarTasks

  // Список уровней для построения упорядоченной структуры
  const levels: { code: LanguageLevel; title: string; icon: string; desc: string }[] = [
    { code: "A1", title: "Уровень A1", icon: "🌱", desc: "Начальный (Базовые фразы и понятия)" },
    { code: "A2", title: "Уровень A2", icon: "🚀", desc: "Элементарный (Простое выживание в среде)" },
    { code: "B1", title: "Уровень B1", icon: "🏆", desc: "Пороговый (Свободное бытовое openie)" },
  ]

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 pb-24 animate-fadeIn">
      
      {/* Шапка профиля */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-b-6 border-gray-200 mb-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <div>
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-wide">Твой прогресс</h2>
            <p className="text-xl font-black text-gray-800 leading-none">{xp} XP</p>
          </div>
        </div>
        
        {/* Измененный переключатель режимов игры */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setGameMode("choice")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              gameMode === "choice" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Тест
          </button>
          <button
            onClick={() => setGameMode("write")}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              gameMode === "write" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Письмо
          </button>
        </div>
      </div>

      {/* Ударный режим */}
      <StreakWidget streak={streak} activeDates={activeDates} />

      {/* 🔄 ПЕРЕКЛЮЧАТЕЛЬ: ЛЕКСИКА / ГРАММАТИКА */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl border-2 border-gray-200 mb-8">
        <button
          onClick={() => setStudyTab("vocab")}
          className={`py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            studyTab === "vocab"
              ? "bg-white text-orange-500 border-b-4 border-orange-200 shadow-sm text-base"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>💬</span> Лексика
        </button>
        <button
          onClick={() => setStudyTab("grammar")}
          className={`py-3 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
            studyTab === "grammar"
              ? "bg-white text-orange-500 border-b-4 border-orange-200 shadow-sm text-base"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span>⚙️</span> Грамматика
        </button>
      </div>

      {/* Сетка тем, сгруппированная по уровням */}
      <div className="space-y-8">
        {levels.map((lvl) => {
          const categoriesInLevel = Array.from(
            new Set(activePool.filter((w) => w.level === lvl.code).map((w) => w.category))
          )

          if (categoriesInLevel.length === 0) return null

          return (
            <div key={lvl.code} className="space-y-3">
              <div className="border-b-2 border-gray-100 pb-2 pl-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lvl.icon}</span>
                  <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">{lvl.title}</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 mt-0.5">{lvl.desc}</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {categoriesInLevel.map((catName, index) => {
                  const storageKey = `cat_progress_${lvl.code}_${catName}`
                  const isCompleted = (progressData[storageKey] ?? 0) > 0

                  return (
                    <button
                      key={index}
                      onClick={() => onSelectCategory(catName, lvl.code, studyTab)}
                      className={`w-full text-left bg-white p-3.5 rounded-xl border-2 border-b-5 transition-all transform active:scale-[0.98] flex items-center justify-between group ${
                        isCompleted
                          ? "border-green-400 hover:border-green-500 bg-green-50/10"
                          : "border-gray-200 hover:border-orange-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg font-black flex items-center justify-center text-[11px] border-b-2 ${
                          isCompleted 
                            ? "bg-green-500 text-white border-green-600" 
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {lvl.code}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-700 group-hover:text-orange-500 transition-colors text-sm">
                            {catName}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="text-xs font-black text-green-500 bg-green-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Done
                          </span>
                        )}
                        <span className="text-gray-300 group-hover:text-orange-400 text-lg font-black transition-colors">
                          →
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}