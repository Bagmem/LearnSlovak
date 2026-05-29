"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaTrophy, FaMedal, FaUserCircle } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type Profile = {
  id: string
  name: string
  xp: number
  level: string | null
  avatar_url: string | null
}

function getLevelColor(level: string | null): string {
  switch (level) {
    case "A1": return "text-emerald-600 dark:text-emerald-400"
    case "A2": return "text-sky-600 dark:text-sky-400"
    case "B1": return "text-amber-600 dark:text-amber-400"
    case "B2": return "text-orange-600 dark:text-orange-400"
    case "C1": return "text-purple-600 dark:text-purple-400"
    default: return "text-gray-500"
  }
}

export default function WeeklyLeaderboard() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, xp, level, avatar_url")
          .order("xp", { ascending: false })
          .limit(10)

        if (error) throw error
        setUsers(data || [])
      } catch (err) {
        console.error("Failed to load weekly leaderboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTopUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-md"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaTrophy className="text-orange-500" /> Лучшие за неделю
      </h3>

      {users.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-6">
          Пока никто не участвовал.
        </p>
      ) : (
        <div className="space-y-2">
          {users.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/50"
            >
              <div className="w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
                {idx === 0 ? (
                  <FaMedal className="text-yellow-500 text-xl" />
                ) : idx === 1 ? (
                  <FaMedal className="text-gray-400 text-xl" />
                ) : idx === 2 ? (
                  <FaMedal className="text-orange-700 text-xl" />
                ) : (
                  <span className="text-gray-500">{idx + 1}</span>
                )}
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                  {user.name || "Без имени"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Уровень: <span className={`font-bold ${getLevelColor(user.level)}`}>{user.level || "—"}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-orange-500">{user.xp} XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}