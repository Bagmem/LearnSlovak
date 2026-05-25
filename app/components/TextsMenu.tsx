"use client"

import { useState } from "react"
import { texts, type SlovakText, type TextLevel, type TextTopic } from "../../data/texts"
import { FaCheckCircle } from "react-icons/fa"

type TextsMenuProps = {
  onSelectText: (text: SlovakText) => void
  readStatus: Record<string, boolean>
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

export default function TextsMenu({ onSelectText, readStatus }: TextsMenuProps) {
  const [selectedLevel, setSelectedLevel] = useState<TextLevel | "all">("all")
  const [selectedTopic, setSelectedTopic] = useState<TextTopic | "all">("all")

  const filteredByLevel = selectedLevel === "all" ? texts : texts.filter(t => t.level === selectedLevel)
  const filteredTexts = selectedTopic === "all" ? filteredByLevel : filteredByLevel.filter(t => t.topic === selectedTopic)

  const levels: { value: TextLevel | "all"; label: string }[] = [
    { value: "all", label: "Все уровни" },
    { value: "A1", label: "A1" }, { value: "A2", label: "A2" },
    { value: "B1", label: "B1" }, { value: "B2", label: "B2" },
  ]

  const topics: { value: TextTopic | "all"; label: string }[] = [
    { value: "all", label: "Все темы" },
    ...Object.entries(topicLabels).map(([key, label]) => ({ value: key as TextTopic, label })),
  ]

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-black text-center mb-8">📖 Тексты для чтения</h1>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {levels.map(l => (
          <button
            key={l.value}
            onClick={() => setSelectedLevel(l.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
              selectedLevel === l.value ? "bg-orange-500 text-white shadow" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-8 border-t pt-4">
        {topics.map(t => (
          <button
            key={t.value}
            onClick={() => setSelectedTopic(t.value)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              selectedTopic === t.value ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTexts.map(text => {
          const isRead = readStatus[text.id] || false
          return (
            <button
              key={text.id}
              onClick={() => onSelectText(text)}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:border-orange-400 transition-all shadow-md hover:shadow-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  {text.title}
                  {isRead && <FaCheckCircle className="text-green-500" size={18} />}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {text.wordCount} слов · {text.level} · {topicLabels[text.topic]} · {text.questions?.length || 0} вопросов
                </p>
              </div>
              <span className="text-3xl text-gray-300 group-hover:text-orange-500 transition">→</span>
            </button>
          )
        })}
      </div>
      {filteredTexts.length === 0 && (
        <p className="text-center py-10 text-gray-500">Нет текстов по выбранным фильтрам.</p>
      )}
    </div>
  )
}