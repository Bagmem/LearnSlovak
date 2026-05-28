"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type StreakWidgetProps = {
  streak: number
  activeDates: string[]
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function StreakWidget({ streak: initialStreak, activeDates: initialActiveDates }: StreakWidgetProps) {
  const [streak, setStreak] = useState(initialStreak)
  const [activeDates, setActiveDates] = useState(initialActiveDates)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedDates = localStorage.getItem("slovak_active_dates")
    if (savedDates) {
      const dates = JSON.parse(savedDates)
      setActiveDates(dates)
    }
  }, [])

  const daysLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  const now = new Date()
  const todayStr = getLocalDateString(now)

  const currentDay = now.getDay()
  const monday = new Date(now)
  const offset = currentDay === 0 ? 6 : currentDay - 1
  monday.setDate(now.getDate() - offset)

  const weekDays = daysLabels.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = getLocalDateString(d)
    return { label, dateStr, isToday: dateStr === todayStr }
  })

  const activeDaysThisWeek = weekDays.filter(day => activeDates.includes(day.dateStr)).length
  const nextMilestone = Math.ceil(streak / 7) * 7
  const progressToNext = ((streak % 7) / 7) * 100
  const daysLeft = nextMilestone - streak

  const getDaysWord = (n: number, one: string, two: string, five: string) => {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod100 >= 11 && mod100 <= 19) return five
    if (mod10 === 1) return one
    if (mod10 >= 2 && mod10 <= 4) return two
    return five
  }

  const streakWord = getDaysWord(streak, "день", "дня", "дней")
  const daysLeftWord = getDaysWord(daysLeft, "день", "дня", "дней")
  const activeDaysWord = getDaysWord(activeDaysThisWeek, "день", "дня", "дней")

  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-white">Ударный режим</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Серия занятий</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-orange-500">0</span>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">дней</span>
          </div>
        </div>
        <div className="animate-pulse">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all">
      {/* Декоративный узор */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
      
      <div className="relative">
        {/* Верхняя секция */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl">🔥</span>
            </motion.div>
            <div>
              <h3 className="font-black text-xl text-gray-800 dark:text-white">Ударный режим</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Серия занятий</p>
            </div>
          </div>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="text-right"
          >
            <span className="text-5xl font-black text-orange-500">{streak}</span>
            <span className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">{streakWord}</span>
          </motion.div>
        </div>

        {/* Прогресс до следующей награды */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
              🏆 До следующей награды
            </span>
            <span className="text-xs font-bold text-orange-500">{streak} / {nextMilestone}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Осталось {daysLeft} {daysLeftWord}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              🎁 +50 XP
            </span>
          </div>
        </div>

        {/* Календарь недели */}
        <div className="mb-5">
          <div className="grid grid-cols-7 gap-0 text-center">
            {weekDays.map((day, idx) => {
              const isActive = activeDates.includes(day.dateStr)
              return (
                <motion.div
                  key={day.dateStr}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all mx-auto ${
                      isActive
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md"
                        : day.isToday
                        ? "border-2 border-orange-500 bg-white/10 text-orange-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {isActive ? "🔥" : day.isToday ? "●" : ""}
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1">{day.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Активность на этой неделе */}
        <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">📊 Активность на этой неделе</span>
            <span className="text-xs font-bold text-orange-500">{activeDaysThisWeek} {activeDaysWord}</span>
          </div>
          <div className="flex justify-between gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`flex-1 h-1.5 rounded-full origin-left ${
                  i < activeDaysThisWeek
                    ? "bg-gradient-to-r from-orange-500 to-amber-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Мотивационная фраза */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            🔥 Занимайся каждый день, чтобы увеличивать серию!
          </p>
        </div>
      </div>
    </div>
  )
}