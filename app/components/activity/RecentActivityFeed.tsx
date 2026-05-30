"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaHistory } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type ActivityEntry = {
  xp_gained: number
  created_at: string
  source: string | null
}

const sourceMap: Record<string, { icon: string; label: string }> = {
  choice: { icon: "🖱️", label: "Тест" },
  write: { icon: "✍️", label: "Письмо" },
  flashcard: { icon: "🔄", label: "Карточки" },
  daily_goal: { icon: "🎯", label: "Цель дня" },
  achievement: { icon: "🏆", label: "Достижение" },
  test: { icon: "📝", label: "Уровневый тест" },
  quiz: { icon: "❓", label: "Квиз по тексту" },
  level_up_bonus: { icon: "⬆️", label: "Повышение уровня" },
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "только что"
  if (diffMins < 60) return `${diffMins} мин. назад`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} ч. назад`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "вчера"
  if (diffDays < 7) return `${diffDays} дн. назад`
  return date.toLocaleDateString("ru-RU")
}

export default function RecentActivityFeed({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("xp_history")
        .select("xp_gained, created_at, source")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20) // загружаем больше записей для прокрутки

      if (!error && data) {
        setActivities(data)
      }
      setLoading(false)
    }
    if (userId) fetchActivities()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 text-center"
      >
        <FaHistory className="text-gray-400 dark:text-gray-500 text-2xl mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Пока нет активности</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Заработанный опыт появится здесь</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-md"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
          <FaHistory className="text-orange-500 text-base" />
        </div>
        <h3 className="font-black text-gray-800 dark:text-white text-lg">Последняя активность</h3>
      </div>

      {/* Контейнер с прокруткой: фиксированная высота, показывающая примерно 5 записей */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {activities.map((entry, idx) => {
          const info = sourceMap[entry.source ?? ""] ?? { icon: "⭐", label: "Опыт" }
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-2 rounded-xl bg-white/50 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{info.icon}</span>
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    +{entry.xp_gained} XP
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    — {info.label}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(entry.created_at)}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}