"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaFire, FaTrophy, FaCalendarAlt, FaTimes, FaStar } from "react-icons/fa"

type StreakModalProps = {
  isOpen: boolean
  onClose: () => void
  currentStreak: number
  activeDates: string[]
}

function getDayWord(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней'
  if (lastDigit === 1) return 'день'
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня'
  return 'дней'
}

// Расчёт максимальной серии из массива дат
function calculateMaxStreak(dates: string[]): number {
  if (!dates.length) return 0
  const uniqueSorted = [...new Set(dates)].sort()
  let maxStreak = 1
  let current = 1
  for (let i = 1; i < uniqueSorted.length; i++) {
    const prev = new Date(uniqueSorted[i - 1])
    const curr = new Date(uniqueSorted[i])
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      current++
      maxStreak = Math.max(maxStreak, current)
    } else {
      current = 1
    }
  }
  return maxStreak
}

export default function StreakModal({ isOpen, onClose, currentStreak, activeDates }: StreakModalProps) {
  const maxStreak = useMemo(() => calculateMaxStreak(activeDates), [activeDates])
  const totalDays = activeDates.length

  const nextMilestone = Math.ceil(currentStreak / 7) * 7
  const daysToNext = nextMilestone - currentStreak
  const progress = (currentStreak % 7) / 7 * 100

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="rounded-2xl w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
            <h2 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
              <FaFire className="text-orange-500" /> Ваша серия
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FaTimes size={20} />
            </button>
          </div>
          <div className="p-5">
            <div className="text-center mb-4">
              <div className="text-5xl font-black text-orange-500">{currentStreak}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getDayWord(currentStreak)} подряд</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FaTrophy className="text-yellow-500" /> Рекордная серия
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {maxStreak} {getDayWord(maxStreak)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FaCalendarAlt className="text-blue-500" /> Всего дней
                </span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {totalDays} {getDayWord(totalDays)}
                </span>
              </div>
            </div>

            {daysToNext > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <span>🏆 До следующей награды</span>
                  <span>{currentStreak} / {nextMilestone}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {daysToNext} {getDayWord(daysToNext)} до следующей награды
                </p>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-2 text-center text-xs text-gray-500 dark:text-gray-400">
              <FaStar className="inline mr-1 text-yellow-500" />
              Занимайтесь каждый день, чтобы увеличивать серию и получать бонусы!
            </div>
          </div>
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button onClick={onClose} className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition">
              Понятно
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}