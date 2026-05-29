"use client"

import { FaArrowRight, FaCheckCircle } from "react-icons/fa"

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
  categories,
  onSelectCategory,
}: TreeLevelProps) {
  const category = categories[0]
  const progressPercent = (category.passedCount / category.totalCount) * 100

  return (
    <button
      onClick={() => onSelectCategory(category.name)}
      className="group w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-left hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-600 transition-all transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-black text-lg text-gray-800 dark:text-white flex items-center gap-2">
            {category.name}
            {category.isCompleted && <FaCheckCircle className="text-green-500" size={16} />}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {category.passedCount}/{category.totalCount} слов
          </p>
        </div>
        <FaArrowRight className="text-gray-300 group-hover:text-orange-500 transition-colors text-xl" />
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </button>
  )
}