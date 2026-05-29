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
          className="rounded-2xl w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
              <FaFire className="text-orange-500 text-lg" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-gray-800 dark:text-white">Ваша серия</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">продолжайте в том же духе</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="text-center">
              <div className="text-6xl font-black text-orange-500 dark:text-orange-400">{currentStreak}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getDayWord(currentStreak)} подряд</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30">
                    <FaTrophy className="text-yellow-500 text-xs" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Рекордная серия</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  {maxStreak} {getDayWord(maxStreak)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30">
                    <FaCalendarAlt className="text-blue-500 text-xs" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Всего дней</span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">
                  {totalDays} {getDayWord(totalDays)}
                </span>
              </div>
            </div>

            {daysToNext > 0 && (
              <div>
                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500 text-xs" /> До следующей награды
                  </span>
                  <span>{currentStreak} / {nextMilestone}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {daysToNext} {getDayWord(daysToNext)} до следующей награды
                </p>
              </div>
            )}

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center text-xs text-gray-600 dark:text-gray-300">
              <FaStar className="inline mr-1 text-yellow-500" />
              Занимайтесь каждый день, чтобы увеличивать серию и получать бонусы!
            </div>
          </div>

          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition"
            >
              Понятно
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}