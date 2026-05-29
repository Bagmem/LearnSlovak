"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaHashtag } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type Props = {
  currentXp: number
  currentUserId: string
}

export default function UserRank({ currentXp, currentUserId }: Props) {
  const [rank, setRank] = useState<number | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const { count: countAbove } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gt("xp", currentXp)

        const { count: total } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        setRank((countAbove ?? 0) + 1)
        setTotalUsers(total ?? 0)
      } catch (err) {
        console.error("Failed to fetch user rank:", err)
      } finally {
        setLoading(false)
      }
    }

    if (currentUserId) fetchRank()
  }, [currentXp, currentUserId])

  if (loading || rank === null) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-lg p-6"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-bl-full" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <FaHashtag className="text-white text-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Ваш ранг</p>
          <p className="text-2xl font-black text-gray-800 dark:text-white">
            #{rank} <span className="text-base font-normal text-gray-500">из {totalUsers}</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}   