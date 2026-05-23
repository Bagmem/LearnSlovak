"use client"

import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import CategoryCard from "./CategoryCard"

type TreeLevelProps = {
  levelCode: string
  levelTitle: string
  levelIcon: React.ReactNode
  levelDesc: string
  categories: {
    name: string
    passedCount: number
    totalCount: number
    isCompleted: boolean
  }[]
  onSelectCategory: (categoryName: string) => void
}

export default function TreeLevel({
  levelCode,
  levelTitle,
  levelIcon,
  levelDesc,
  categories,
  onSelectCategory,
}: TreeLevelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  const totalWords = categories.reduce((sum, cat) => sum + cat.totalCount, 0)
  const passedWords = categories.reduce((sum, cat) => sum + cat.passedCount, 0)
  const levelProgressPercent = totalWords > 0 ? (passedWords / totalWords) * 100 : 0

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-all card-hover">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          {levelIcon}
          <div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white">{levelTitle}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{levelDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
            {passedWords}/{totalWords}
          </span>
          <FaChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-3 animate-slideInScale">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              passedCount={cat.passedCount}
              totalCount={cat.totalCount}
              isCompleted={cat.isCompleted}
              onSelect={() => onSelectCategory(cat.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}