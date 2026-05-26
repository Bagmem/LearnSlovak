"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { type SlovakText } from "../../data/texts"
import { playClickSound } from "../../lib/sounds"
import InteractiveText from "../InteractiveText"
import { FaArrowLeft, FaVolumeUp, FaLanguage, FaCheckCircle, FaBrain } from "react-icons/fa"

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => { playClickSound(); onBack() }}
        className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition font-medium"
      >
        <FaArrowLeft /> Назад к списку
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                {text.title}
                {isRead && <FaCheckCircle className="text-green-200 text-xl" />}
              </h1>
              <div className="flex gap-3 mt-1 text-white/80 text-sm">
                <span>{text.wordCount} слов</span>
                <span>Уровень {text.level}</span>
                <span>{text.questions?.length || 0} вопросов</span>
              </div>
            </div>
            <button
              onClick={() => speakText(text.content)}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition text-white"
              title="Озвучить текст"
            >
              <FaVolumeUp size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <InteractiveText text={text.content} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FaLanguage />
              {showTranslation ? "Скрыть перевод" : "Показать перевод"}
            </button>
            {hasQuestions && (
              <button
                onClick={() => { playClickSound(); onQuiz(); }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                <FaBrain />
                Пройти викторину
              </button>
            )}
          </div>

          {showTranslation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-l-4 border-orange-500">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{text.translation}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}