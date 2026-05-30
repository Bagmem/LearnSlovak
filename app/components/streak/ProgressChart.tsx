"use client"

import { useMemo, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaKeyboard, FaPencilAlt, FaLayerGroup, FaChartPie } from "react-icons/fa"

type ProgressChartProps = {
  choiceCorrectCount: number
  writeCorrectCount: number
  flashcardCorrectCount: number
}

export default function ProgressChart({
  choiceCorrectCount,
  writeCorrectCount,
  flashcardCorrectCount,
}: ProgressChartProps) {
  const [animatedTotal, setAnimatedTotal] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  const xpData = useMemo(() => {
    const choiceXp = choiceCorrectCount * 2
    const writeXp = writeCorrectCount * 3
    const flashcardXp = flashcardCorrectCount * 1
    const total = choiceXp + writeXp + flashcardXp
    return { choice: choiceXp, write: writeXp, flashcard: flashcardXp, total }
  }, [choiceCorrectCount, writeCorrectCount, flashcardCorrectCount])

  useEffect(() => {
    setAnimatedTotal(0)
    const duration = 800
    const stepTime = 16
    const steps = duration / stepTime
    let current = 0
    const increment = xpData.total / steps
    const timer = setInterval(() => {
      current += increment
      if (current >= xpData.total) {
        setAnimatedTotal(xpData.total)
        clearInterval(timer)
      } else {
        setAnimatedTotal(Math.floor(current))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [xpData.total])

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const items = [
    { name: "Тест", value: xpData.choice, color: "#f97316", icon: <FaKeyboard />, label: "2 XP / ответ" },
    { name: "Письмо", value: xpData.write, color: "#3b82f6", icon: <FaPencilAlt />, label: "3 XP / ответ" },
    { name: "Карточки", value: xpData.flashcard, color: "#22c55e", icon: <FaLayerGroup />, label: "1 XP / ответ" },
  ]

  const total = xpData.total

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
            <FaChartPie className="text-orange-500 text-lg" />
          </div>
          <h3 className="text-lg font-black text-gray-800 dark:text-white">Распределение XP</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Пока нет данных</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Пройдите уроки, чтобы увидеть статистику</p>
        </div>
      </motion.div>
    )
  }

  const radius = 70
  const innerRadius = 58

  let cumulative = 0
  const segments = items.map(item => {
    const angle = (item.value / total) * 360
    const start = cumulative
    cumulative += angle
    const end = cumulative
    const largeArcFlag = angle > 180 ? 1 : 0
    const startX = 88 + radius * Math.cos((start - 90) * Math.PI / 180)
    const startY = 88 + radius * Math.sin((start - 90) * Math.PI / 180)
    const endX = 88 + radius * Math.cos((end - 90) * Math.PI / 180)
    const endY = 88 + radius * Math.sin((end - 90) * Math.PI / 180)
    return { item, startX, startY, endX, endY, largeArcFlag }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
          <FaChartPie className="text-orange-500 text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-800 dark:text-white">Распределение XP</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">по режимам обучения</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 176 176">
            {segments.map((seg, idx) => (
              <motion.path
                key={idx}
                d={`M 88 88 L ${seg.startX} ${seg.startY} A ${radius} ${radius} 0 ${seg.largeArcFlag} 1 ${seg.endX} ${seg.endY} Z`}
                fill={seg.item.color}
                style={{ filter: `drop-shadow(0 0 6px ${seg.item.color}80)` }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: hasAnimated ? 1 : 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              />
            ))}
            <circle cx="88" cy="88" r={innerRadius} fill="white" className="dark:fill-gray-800" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span
              className="text-4xl font-black text-gray-800 dark:text-white"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              {animatedTotal}
            </motion.span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">XP</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {items.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 4px ${item.color}` }} />
                  <span className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1">
                    {item.icon} {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-800 dark:text-white">{item.value}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">XP</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / total) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 ml-5">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}