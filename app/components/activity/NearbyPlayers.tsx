"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaArrowUp, FaArrowDown, FaUserCircle } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type Profile = {
  id: string
  name: string
  xp: number
  level: string | null
  avatar_url: string | null
}

type Props = {
  currentUserId: string
  currentXp: number
}

export default function NearbyPlayers({ currentUserId, currentXp }: Props) {
  const [nearby, setNearby] = useState<{ above: Profile | null; below: Profile | null }>({
    above: null,
    below: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const { data: aboveData } = await supabase
          .from("profiles")
          .select("id, name, xp, level, avatar_url")
          .gt("xp", currentXp)
          .order("xp", { ascending: true })
          .limit(1)
          .neq("id", currentUserId)

        const { data: belowData } = await supabase
          .from("profiles")
          .select("id, name, xp, level, avatar_url")
          .lt("xp", currentXp)
          .order("xp", { ascending: false })
          .limit(1)
          .neq("id", currentUserId)

        setNearby({
          above: aboveData?.[0] || null,
          below: belowData?.[0] || null,
        })
      } catch (err) {
        console.error("Failed to load nearby players:", err)
      } finally {
        setLoading(false)
      }
    }

    if (currentUserId) fetchNearby()
  }, [currentUserId, currentXp])

  if (loading || (!nearby.above && !nearby.below)) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-md"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaUserCircle className="text-orange-500" /> Рядом с вами
      </h3>

      <div className="space-y-3">
        {nearby.above && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/50">
            <FaArrowUp className="text-green-500 text-lg shrink-0" />
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
              {nearby.above.avatar_url ? (
                <img src={nearby.above.avatar_url} alt={nearby.above.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                {nearby.above.name || "Без имени"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Уровень: {nearby.above.level || "—"} • {nearby.above.xp} XP
              </p>
            </div>
            <span className="text-xs text-green-500 font-bold">+{nearby.above.xp - currentXp} XP</span>
          </div>
        )}

        <div className="flex items-center gap-3 p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            Вы
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              Ваш результат
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentXp} XP
            </p>
          </div>
        </div>

        {nearby.below && (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/50">
            <FaArrowDown className="text-red-500 text-lg shrink-0" />
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
              {nearby.below.avatar_url ? (
                <img src={nearby.below.avatar_url} alt={nearby.below.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                {nearby.below.name || "Без имени"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Уровень: {nearby.below.level || "—"} • {nearby.below.xp} XP
              </p>
            </div>
            <span className="text-xs text-red-500 font-bold">-{currentXp - nearby.below.xp} XP</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}