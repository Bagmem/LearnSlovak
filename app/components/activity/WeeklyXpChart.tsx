"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaChartLine } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type DayData = {
  label: string
  date: string
  xp: number
}

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

export default function WeeklyXpChart({ userId }: { userId: string }) {
  const [days, setDays] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [maxXp, setMaxXp] = useState(1)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; xp: number } | null>(null)

  useEffect(() => {
    const fetchWeekly = async () => {
      setLoading(true)
      const now = new Date()
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 6)

      const { data, error } = await supabase
        .from("xp_history")
        .select("xp_gained, created_at")
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true })

      if (error) {
        setLoading(false)
        return
      }

      const grouped: Record<string, number> = {}
      data?.forEach(entry => {
        const isoDate = new Date(entry.created_at).toISOString().slice(0, 10)
        grouped[isoDate] = (grouped[isoDate] || 0) + entry.xp_gained
      })

      const result: DayData[] = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(now.getDate() - i)
        const iso = d.toISOString().slice(0, 10)
        const dayOfWeek = d.getDay()
        result.push({
          label: DAY_NAMES[dayOfWeek],
          date: iso,
          xp: grouped[iso] || 0,
        })
      }

      setMaxXp(Math.max(...result.map(d => d.xp), 1))
      setDays(result)
      setLoading(false)
    }

    if (userId) fetchWeekly()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
      </div>
    )
  }

  const hasData = days.some(d => d.xp > 0)

  const chartHeight = 110
  const paddingLeft = 28
  const paddingRight = 10
  const paddingTop = 15
  const paddingBottom = 22
  const svgHeight = paddingTop + chartHeight + paddingBottom
  const chartWidth = 1000

  const points = days.map((day, idx) => ({
    x: paddingLeft + idx * ((chartWidth - paddingLeft - paddingRight) / (days.length - 1 || 1)),
    y: paddingTop + chartHeight - (day.xp / maxXp) * chartHeight,
    ...day,
  }))

  const linePath = points.reduce((path, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`
    const prev = arr[i - 1]
    const prevPrev = i > 1 ? arr[i - 2] : prev
    const next = i < arr.length - 1 ? arr[i + 1] : point
    const cp1x = prev.x + (point.x - prevPrev.x) / 6
    const cp1y = prev.y + (point.y - prevPrev.y) / 6
    const cp2x = point.x - (next.x - prev.x) / 6
    const cp2y = point.y - (next.y - prev.y) / 6
    return `${path} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`
  }, "")

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-md"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
          <FaChartLine className="text-orange-500 text-base" />
        </div>
        <h3 className="font-black text-gray-800 dark:text-white text-lg">XP за неделю</h3>
      </div>

      {!hasData ? (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
          Нет данных за последние 7 дней
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${svgHeight}`}
            className="w-full"
            style={{ height: "180px" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Горизонтальные линии и метки оси Y */}
            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
              const y = paddingTop + chartHeight - fraction * chartHeight
              const value = Math.round(maxXp * fraction)
              return (
                <g key={fraction}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="currentColor"
                    className="text-gray-300 dark:text-gray-600"
                    strokeWidth="0.5"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={paddingLeft - 4}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-gray-400 dark:fill-gray-500 text-[10px]"
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {/* Заливка под кривой */}
            <motion.path
              d={areaPath}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Основная кривая */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {/* Маркеры и подписи дней */}
            {points.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint({ x: point.x, y: point.y, xp: point.xp })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  fill="#f97316"
                  stroke="white"
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + idx * 0.1, type: "spring" }}
                />
                <text
                  x={point.x}
                  y={svgHeight - 5}
                  textAnchor="middle"
                  className="fill-gray-500 dark:fill-gray-400 text-[10px]"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>

          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute z-10 pointer-events-none bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-2 py-1 rounded-md shadow-lg"
                style={{
                  left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                  transform: "translate(-50%, -120%)",
                }}
              >
                {hoveredPoint.xp} XP
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}