"use client"

import { useState } from "react"
import { texts, type SlovakText, type TextLevel } from "../../data/texts"

type TextsMenuProps = {
  onSelectText: (text: SlovakText) => void
}

export default function TextsMenu({ onSelectText }: TextsMenuProps) {
  const [selectedLevel, setSelectedLevel] = useState<TextLevel | "all">("all")

  const filteredTexts =
    selectedLevel === "all" ? texts : texts.filter((t) => t.level === selectedLevel)

  const levels: { value: TextLevel | "all"; label: string }[] = [
    { value: "all", label: "Все" },
    { value: "A1", label: "A1 (нач.)" },
    { value: "A2", label: "A2 (элем.)" },
    { value: "B1", label: "B1 (сред.)" },
    { value: "B2", label: "B2 (выше сред.)" },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-24 animate-fadeIn">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-4 text-center">
        📖 Тексты для чтения
      </h2>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {levels.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => setSelectedLevel(lvl.value)}
            className={`px-4 py-2 text-sm font-black rounded-xl transition-all ${
              selectedLevel === lvl.value
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTexts.map((text) => (
          <button
            key={text.id}
            onClick={() => onSelectText(text)}
            className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-4 text-left hover:border-orange-400 transition-all shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white">
                  {text.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {text.wordCount} слов · уровень {text.level}
                </p>
              </div>
              <span className="text-2xl text-gray-400 group-hover:text-orange-500">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}