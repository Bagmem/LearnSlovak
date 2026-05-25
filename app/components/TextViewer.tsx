"use client"

import { useState } from "react"
import { type SlovakText } from "../../data/texts"
import { playClickSound } from "../../lib/sounds"
import InteractiveText from "../InteractiveText"

type TextViewerProps = {
  text: SlovakText
  onBack: () => void
  onQuiz: () => void
  isRead: boolean
}

export default function TextViewer({ text, onBack, onQuiz, isRead }: TextViewerProps) {
  const [showTranslation, setShowTranslation] = useState(false)
  const hasQuestions = text.questions && text.questions.length > 0

  const speakText = (content: string) => {
    const utterance = new SpeechSynthesisUtterance(content)
    utterance.lang = "sk-SK"
    utterance.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => { playClickSound(); onBack() }} className="text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1">
        ← Назад
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {text.title}
              {isRead && <span className="text-green-500 text-sm">✅</span>}
            </h1>
            <p className="text-sm text-gray-500">{text.wordCount} слов · уровень {text.level}</p>
          </div>
          <button onClick={() => speakText(text.content)} className="p-2 rounded-full hover:bg-gray-100 transition">
            🔊
          </button>
        </div>

        <InteractiveText text={text.content} />

        <div className="space-y-3">
          <button onClick={() => setShowTranslation(!showTranslation)} className="w-full py-2 bg-orange-500 text-white rounded-xl font-bold">
            {showTranslation ? "Скрыть перевод" : "Показать перевод"}
          </button>
          {showTranslation && (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <p>{text.translation}</p>
            </div>
          )}
          {hasQuestions && (
            <button onClick={() => { playClickSound(); onQuiz(); }} className="w-full py-2 bg-green-500 text-white rounded-xl font-bold">
              📝 Пройти викторину
            </button>
          )}
        </div>
      </div>
    </div>
  )
}