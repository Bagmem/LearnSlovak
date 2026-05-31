"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBook, FaLayerGroup, FaTrophy, FaCrosshairs } from "react-icons/fa"

function CircularProgress({
  percent,
  label,
  icon,
  color = "#f97316",
  size = 80,
}: {
  percent: number
  label: string
  icon: React.ReactNode
  color?: string
  size?: number
}) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const [animatedPercent, setAnimatedPercent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100)
    return () => clearTimeout(timer)
  }, [percent])

  const offset = circumference - (animatedPercent / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center p-2 overflow-visible"
    >
      <div className="relative overflow-visible" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full overflow-visible">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="5"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
          <span className="text-base font-black text-gray-800 dark:text-white">
            {Math.round(animatedPercent)}%
          </span>
        </div>
      </div>
      <span className="text-[10px] font-semibold mt-1 text-gray-600 dark:text-gray-300">
        {label}
      </span>
    </motion.div>
  )
}

function StatCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

type StatsCardsProps = {
  wordsPercent: number
  uniqueLearnedWords: number
  totalWordsCount: number
  categoriesPercent: number
  completedCategoriesCount: number
  totalCategories: number
  accuracy: number
  totalCorrect: number
  totalAnswers: number
}

export default function StatsCards({
  wordsPercent,
  uniqueLearnedWords,
  totalWordsCount,
  categoriesPercent,
  completedCategoriesCount,
  totalCategories,
  accuracy,
  totalCorrect,
  totalAnswers,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard delay={0.25}>
        <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center h-full flex flex-col">
          <div className="flex justify-center mb-1">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
              <FaBook className="text-orange-500 text-base" />
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <CircularProgress
  percent={wordsPercent}
  label="Слов изучено"
  icon={<FaBook className="text-amber-500" />}
  color="#f97316"
  size={80}
/>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            {uniqueLearnedWords} из {totalWordsCount}
          </p>
        </div>
      </StatCard>

      <StatCard delay={0.3}>
        <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center h-full flex flex-col">
          <div className="flex justify-center mb-1">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
              <FaLayerGroup className="text-orange-500 text-base" />
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <CircularProgress
              percent={categoriesPercent}
              label="Тем завершено"
              icon={<FaTrophy className="text-yellow-500" />}
              color="#3b82f6"
              size={80}
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            {completedCategoriesCount} из {totalCategories}
          </p>
        </div>
      </StatCard>

      <StatCard delay={0.35}>
        <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center h-full flex flex-col">
          <div className="flex justify-center mb-1">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
              <FaCrosshairs className="text-orange-500 text-base" />
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <CircularProgress
              percent={accuracy}
              label="Точность"
              icon={<FaCrosshairs className="text-red-500" />}
              color="#22c55e"
              size={80}
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            {totalCorrect} из {totalAnswers} ответов
          </p>
        </div>
      </StatCard>
    </div>
  )
} 