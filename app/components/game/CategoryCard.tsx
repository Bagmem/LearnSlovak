"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaArrowRight, FaCheckCircle } from "react-icons/fa"
import { categoryIcons } from "../../../lib/categoryIcons"

type CategoryCardProps = {
  name: string
  passedCount: number
  totalCount: number
  isCompleted: boolean
  isLocked?: boolean
  onSelect: () => void
}

export default function CategoryCard({ name, passedCount, totalCount, isCompleted, isLocked = false, onSelect }: CategoryCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const CategoryIcon = categoryIcons[name] || undefined

  if (!mounted) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-500" />
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-gray-800 dark:text-white">{name}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
              <span>Прогресс</span>
              <span>0/0</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: '0%' }} />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            {!isLocked ? <FaArrowRight className="text-gray-400 dark:text-gray-500 text-sm" /> : <span className="text-xs text-gray-500 dark:text-gray-400">🔒 Закрыто</span>}
          </div>
        </div>
      </div>
    )
  }

  const percent = (passedCount / totalCount) * 100
  const topBarGradient = isCompleted ? "from-green-500 to-emerald-600" : isLocked ? "from-gray-400 to-gray-500" : "from-orange-500 to-amber-500"

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.01, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      onClick={onSelect}
      disabled={isLocked}
      className="relative w-full overflow-hidden rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${topBarGradient}`} />
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {CategoryIcon && <CategoryIcon className="text-orange-500" size={20} />}
            <span className="font-black text-base text-gray-800 dark:text-white">{name}</span>
          </div>
          {isCompleted && <FaCheckCircle className="text-green-500 text-lg" />}
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            <span>Прогресс</span>
            <span>{passedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-gradient-to-r from-orange-500 to-amber-500"}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          {!isLocked && <FaArrowRight className="text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors text-sm" />}
          {isLocked && <span className="text-xs text-gray-500 dark:text-gray-400">🔒 Закрыто</span>}
        </div>
      </div>
    </motion.button>
  )
}