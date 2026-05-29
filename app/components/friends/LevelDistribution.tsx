"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { FaUsers } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

const levels = ["A1", "A2", "B1", "B2", "C1"]
const levelColors: Record<string, string> = {
  A1: "#10b981",
  A2: "#0ea5e9",
  B1: "#f59e0b",
  B2: "#f97316",
  C1: "#a855f7",
}

type Props = {
  currentUserId?: string
}

export default function LevelDistribution({ currentUserId }: Props) {
  const [distribution, setDistribution] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: friendships } = await supabase
          .from("friendships")
          .select("requester_id, addressee_id")
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
          .eq("status", "accepted")

        const friendIds = (friendships || []).map(f =>
          f.requester_id === user.id ? f.addressee_id : f.requester_id
        )

        const allIds = [...friendIds, user.id]

        if (allIds.length === 0) {
          setDistribution({})
          setTotal(0)
          setLoading(false)
          return
        }

        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("level")
          .in("id", allIds)

        if (error) throw error

        const counts: Record<string, number> = {}
        ;(profiles || []).forEach(({ level }) => {
          const lvl = level || "unknown"
          counts[lvl] = (counts[lvl] || 0) + 1
        })

        setDistribution(counts)
        setTotal((profiles || []).length)
      } catch (err) {
        console.error("Failed to load level distribution:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDistribution()
  }, [currentUserId])

  const chartData = useMemo(() => {
    const result = levels.map(level => ({
      level,
      count: distribution[level] || 0,
      color: levelColors[level],
      percent: total > 0 ? ((distribution[level] || 0) / total) * 100 : 0,
    }))
    return result
  }, [distribution, total])

  if (loading) return null

  const hasData = total > 0
  const radius = 80
  const circumference = 2 * Math.PI * radius
  let accumulatedPercent = 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl p-5"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaUsers className="text-orange-500" /> Уровни друзей
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-44 h-44 shrink-0">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle
              cx="100" cy="100" r={radius}
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="25"
            />
            {hasData ? (
              chartData.map((segment) => {
                const dashArray = `${(segment.percent / 100) * circumference} ${circumference}`
                const offset = -(accumulatedPercent / 100) * circumference
                accumulatedPercent += segment.percent
                return (
                  <motion.circle
                    key={segment.level}
                    cx="100" cy="100" r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="25"
                    strokeDasharray={dashArray}
                    strokeDashoffset={offset}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ filter: `drop-shadow(0 0 6px ${segment.color}80)` }}
                  />
                )
              })
            ) : (
              <circle
                cx="100" cy="100" r={radius}
                fill="none"
                className="stroke-gray-300 dark:stroke-gray-600"
                strokeWidth="25"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset="0"
              />
            )}
            <motion.circle
              cx="100" cy="100" r={radius - 12.5}
              fill="white"
              className="dark:fill-gray-800"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            />
            <motion.text
              x="100" y="100"
              textAnchor="middle"
              dy="0.35em"
              className={`text-3xl font-black ${hasData ? "fill-gray-800 dark:fill-white" : "fill-gray-400 dark:fill-gray-500"}`}
              transform="rotate(90 100 100)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {hasData ? total : "0"}
            </motion.text>
          </svg>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {chartData.map((item, idx) => (
            <motion.div
              key={item.level}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-800 dark:text-white">
                {item.level} — {item.count}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}