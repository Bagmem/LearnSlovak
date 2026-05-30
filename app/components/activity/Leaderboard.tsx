"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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

type Props = {
  currentUserId?: string
  currentUserName?: string
  currentUserAvatar?: string | null
}

export default function Leaderboard({ currentUserId, currentUserName, currentUserAvatar }: Props) {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"global" | "weekly" | "friends">("global")

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        if (tab === "friends" && currentUserId) {
          // Логика друзей без изменений
          const { data: friendships, error: friendError } = await supabase
            .from("friendships")
            .select("requester_id, addressee_id")
            .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
            .eq("status", "accepted")

          if (friendError) throw friendError

          const friendIds = (friendships || []).map(f =>
            f.requester_id === currentUserId ? f.addressee_id : f.requester_id
          )

          const { data: profiles, error: profileError } = await supabase
            .from("profiles")
            .select("id, name, xp, level, avatar_url")
            .in("id", friendIds)
            .order("xp", { ascending: false })

          if (profileError) throw profileError

          const { data: selfProfiles, error: selfError } = await supabase
            .from("profiles")
            .select("id, name, xp, level, avatar_url")
            .eq("id", currentUserId)
            .maybeSingle()

          if (selfError) throw selfError

          const combined = [...(profiles || [])]
          if (selfProfiles && !combined.some(p => p.id === currentUserId)) {
            combined.push(selfProfiles)
          }
          combined.sort((a, b) => b.xp - a.xp)
          setUsers(combined)
        } else if (tab === "weekly") {
          // Недельный рейтинг: сумма xp_gained за последние 7 дней
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

          const { data, error } = await supabase
            .from("xp_history")
            .select("user_id, xp_gained, profiles(id, name, level, avatar_url)")
            .gte("created_at", sevenDaysAgo.toISOString())
            .order("created_at", { ascending: false })

          if (error) throw error

          // Агрегируем по пользователям
          const userMap = new Map<string, { xp: number; profile: any }>()
          data?.forEach(entry => {
            const userId = entry.user_id
            const profile = entry.profiles
            if (!profile) return
            const current = userMap.get(userId)
            userMap.set(userId, {
              xp: (current?.xp || 0) + entry.xp_gained,
              profile,
            })
          })

          // Преобразуем в массив и сортируем
          const weeklyUsers = Array.from(userMap.entries())
            .map(([id, { xp, profile }]) => ({
              id,
              name: profile.name || "Без имени",
              xp,
              level: profile.level,
              avatar_url: profile.avatar_url,
            }))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10)

          setUsers(weeklyUsers)
        } else {
          // Общий рейтинг
          const { data, error } = await supabase
            .from("profiles")
            .select("id, name, xp, level, avatar_url")
            .order("xp", { ascending: false })
            .limit(10)

          if (error) throw error
          setUsers(data || [])
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [tab, currentUserId])

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
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl overflow-hidden"
    >
      <div className="flex border-b border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={() => setTab("global")}
          className={`flex-1 py-3 font-bold text-sm transition-all ${
            tab === "global"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          }`}
        >
          <FaTrophy className="inline mr-1" /> Общий
        </button>
        <button
          onClick={() => setTab("weekly")}
          className={`flex-1 py-3 font-bold text-sm transition-all ${
            tab === "weekly"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          }`}
        >
          <FaTrophy className="inline mr-1" /> За неделю
        </button>
        {currentUserId && (
          <button
            onClick={() => setTab("friends")}
            className={`flex-1 py-3 font-bold text-sm transition-all ${
              tab === "friends"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <FaTrophy className="inline mr-1" /> Друзья
          </button>
        )}
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {users.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                {tab === "friends"
                  ? "У вас пока нет друзей для рейтинга."
                  : tab === "weekly"
                  ? "За неделю пока нет активности."
                  : "Пока никто не участвовал."}
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((user, idx) => {
                  const isMe = user.id === currentUserId
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-3 p-2 rounded-xl ${
                        isMe
                          ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                          : "bg-white/50 dark:bg-gray-700/50"
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0">
                        {idx === 0 ? <FaMedal className="text-yellow-500 text-xl" /> :
                         idx === 1 ? <FaMedal className="text-gray-400 text-xl" /> :
                         idx === 2 ? <FaMedal className="text-orange-700 text-xl" /> :
                         <span className="text-gray-500">{idx + 1}</span>}
                      </div>
                      <Link href={`/users/${user.id}`} className="flex-1 flex items-center gap-3 min-w-0 border border-transparent rounded-xl transition hover:border-orange-200 hover:bg-orange-50/60 dark:hover:border-orange-800/70 dark:hover:bg-orange-900/10">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0 transition-transform group-hover:scale-105">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {user.name || "Без имени"}
                            {isMe && (
                              <span className="ml-2 text-xs font-bold text-orange-500">(Вы)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Уровень: <span className={`font-bold ${getLevelColor(user.level)}`}>{user.level || "—"}</span>
                          </p>
                        </div>
                      </Link>
                      <div className="text-right">
                        <p className="font-black text-orange-500">{user.xp} XP</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}