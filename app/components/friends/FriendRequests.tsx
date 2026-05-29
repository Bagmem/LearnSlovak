"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaUserCircle, FaCheck, FaTimes } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type Request = {
  id: string
  requester_id: string
  requester: {
    name: string
    level: string | null
    avatar_url: string | null
  }
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("friendships")
        .select(`
          id,
          requester_id,
          requester:requester_id(name, level, avatar_url)
        `)
        .eq("addressee_id", user.id)
        .eq("status", "pending")

      if (error) throw error

      // Преобразуем данные: запрос выше возвращает requester как объект, а не массив
      const formatted = (data || []).map(item => ({
        id: item.id,
        requester_id: item.requester_id,
        requester: Array.isArray(item.requester) ? item.requester[0] : item.requester,
      }))

      setRequests(formatted)
    } catch (err) {
      console.error("Failed to load friend requests:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAccept = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", friendshipId)

    if (!error) {
      setRequests(prev => prev.filter(r => r.id !== friendshipId))
    }
  }

  const handleReject = async (friendshipId: string) => {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId)

    if (!error) {
      setRequests(prev => prev.filter(r => r.id !== friendshipId))
    }
  }

  if (loading) return null

  if (requests.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl p-5"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaUserCircle className="text-orange-500" /> Заявки в друзья ({requests.length})
      </h3>
      <div className="space-y-2">
        {requests.map(req => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/50"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
              {req.requester?.avatar_url ? (
                <img src={req.requester.avatar_url} alt={req.requester.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{req.requester?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Уровень: {req.requester?.level || "—"}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleAccept(req.id)}
                className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50 transition"
              >
                <FaCheck size={12} />
              </button>
              <button
                onClick={() => handleReject(req.id)}
                className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}