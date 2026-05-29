"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { FaCalendarAlt } from "react-icons/fa"

type ActivityHeatmapProps = {
  activeDates: string[]
  days?: number
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function ActivityHeatmap({ activeDates, days = 30 }: ActivityHeatmapProps) {
  const activeSet = useMemo(() => new Set(activeDates), [activeDates])

  const daysArray = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - days + 1)

    const result: Date[] = []
    const current = new Date(start)
    while (current <= today) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [activeDates, days])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
          <FaCalendarAlt className="text-orange-500 text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-800 dark:text-white">Активность за 30 дней</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">ваши занятия</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {daysArray.map((day, idx) => {
          const dateStr = getLocalDateString(day)
          const dayNum = day.getDate()
          const isActive = activeSet.has(dateStr)
          return (
            <motion.div
              key={dateStr}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: idx * 0.002 }}
              title={`${dateStr} – ${isActive ? "активно" : "неактивно"}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-sm ring-1 ring-orange-300/50 dark:ring-orange-500/30"
                  : "bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {dayNum}
            </motion.div>
          )
        })}
        {daysArray.length % 7 !== 0 &&
          Array.from({ length: 7 - (daysArray.length % 7) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-lg bg-transparent" />
          ))}
      </div>
    </motion.div>
  )
}