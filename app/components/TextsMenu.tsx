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
    { value: "A1", label: "A1 (нач.)" },
    { value: "A2", label: "A2 (элем.)" },
    { value: "B1", label: "B1 (сред.)" },
    { value: "B2", label: "B2 (выше сред.)" },
  ]

  const topics: { value: TextTopic | "all"; label: string }[] = [
    { value: "all", label: "Все темы" },
    ...Object.entries(topicLabels).map(([key, label]) => ({ value: key as TextTopic, label })),
  ]

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-24 animate-fadeIn">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
        <span>📖</span> Тексты для чтения
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {levels.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => setSelectedLevel(lvl.value)}
            className={`px-4 py-2 text-sm font-black rounded-xl transition-all ${
              selectedLevel === lvl.value
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center border-t pt-4 border-gray-200 dark:border-gray-700">
        {topics.map((topic) => (
          <button
            key={topic.value}
            onClick={() => setSelectedTopic(topic.value)}
            className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
              selectedTopic === topic.value
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTexts.map((text) => {
          const isRead = readStatus[text.id] || false
          const questionCount = text.questions?.length || 0
          return (
            <button
              key={text.id}
              onClick={() => onSelectText(text)}
              className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-4 text-left hover:border-orange-400 transition-all shadow-sm hover:shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
                  {text.title}
                  {isRead && <FaCheckCircle className="text-green-500" size={16} />}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                  <span>{text.wordCount} слов</span>
                  <span>• уровень {text.level}</span>
                  <span>• {topicLabels[text.topic]}</span>
                  <span>• {questionCount} вопросов</span>
                </p>
              </div>
              <span className="text-2xl text-gray-400 group-hover:text-orange-500 transition-colors">→</span>
            </button>
          )
        })}
      </div>

      {filteredTexts.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Нет текстов, соответствующих выбранным фильтрам.
        </div>
      )}
    </div>
  )
}