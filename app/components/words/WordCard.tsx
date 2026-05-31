"use client"

import { motion } from "framer-motion"
import { FaVolumeUp, FaQuestionCircle } from "react-icons/fa"
import { categoryIcons } from "@/lib/categoryIcons"
import type { Word } from "@/data/words"

type WordCardProps = {
  word: Word
  onSpeak?: (word: Word) => void
}

export default function WordCard({ word, onSpeak }: WordCardProps) {
  const CategoryIcon = categoryIcons[word.category] || FaQuestionCircle

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow"
    >
      {/* Заголовок: слово и озвучка */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {word.slovak}
        </h3>
        {onSpeak && (
          <button
            onClick={() => onSpeak(word)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-500 transition"
            title="Прослушать"
          >
            <FaVolumeUp size={16} />
          </button>
        )}
      </div>

      {/* Перевод */}
      <p className="text-lg text-gray-600 dark:text-gray-300">
        {word.russian}
      </p>

      {/* Категория с иконкой */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <CategoryIcon className="text-base" />
        <span>{word.category}</span>
      </div>

      {/* Уровень и подсказка */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          {word.level}
        </span>
        {word.hint && (
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <FaQuestionCircle />
            <span>{word.hint}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}