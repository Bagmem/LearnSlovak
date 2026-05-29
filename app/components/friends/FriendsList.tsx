"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaUserCircle, FaUserFriends } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type Friend = {
  id: string
  name: string
  level: string | null
  avatar_url: string | null
  xp: number
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Получаем ID друзей
        const { data: friendships, error } = await supabase
          .from("friendships")
          .select("requester_id, addressee_id")
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq("status", "accepted")

        if (error) throw error

        if (!friendships || friendships.length === 0) {
          setFriends([])
          setLoading(false)
          return
        }

        // Собираем ID друзей (исключая текущего пользователя)
        const friendIds = friendships.map(f =>
          f.requester_id === user.id ? f.addressee_id : f.requester_id
        )

        // Загружаем профили друзей
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, level, avatar_url, xp")
          .in("id", friendIds)

        if (profileError) throw profileError

        setFriends(profiles || [])
      } catch (err) {
        console.error("Failed to load friends:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl p-5"
      >
        <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaUserFriends className="text-orange-500" /> Друзья
        </h3>
        <p className="text-center text-gray-500 dark:text-gray-400 py-6">
          У вас пока нет друзей. Добавьте их, чтобы соревноваться!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl p-5"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaUserFriends className="text-orange-500" /> Друзья ({friends.length})
      </h3>
      <div className="space-y-2">
        {friends.map(friend => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/50"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
              {friend.avatar_url ? (
                <img src={friend.avatar_url} alt={friend.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{friend.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Уровень: {friend.level || "—"} • {friend.xp} XP
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}