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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-between pb-8 animate-fadeIn">
      <div className="w-full max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => { playClickSound(); onBack() }}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-black text-2xl p-1"
        >
          ← Назад к списку
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start max-w-2xl w-full mx-auto px-4 my-6">
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                {text.title}
                {isRead && <span className="text-green-500 text-sm">✅</span>}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {text.wordCount} слов · уровень {text.level}
              </p>
            </div>
            <button
              onClick={() => speakText(text.content)}
              className="text-2xl p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              🔊
            </button>
          </div>

          <InteractiveText text={text.content} />

          <button
            onClick={() => { playClickSound(); setShowTranslation(!showTranslation) }}
            className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-colors"
          >
            {showTranslation ? "Скрыть перевод" : "Показать перевод"}
          </button>

          {showTranslation && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{text.translation}</p>
            </div>
          )}

          {hasQuestions && (
            <button
              onClick={() => { playClickSound(); onQuiz() }}
              className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl transition-colors"
            >
              📝 Пройти викторину
            </button>
          )}
        </div>
      </div>
    </div>
  )
}