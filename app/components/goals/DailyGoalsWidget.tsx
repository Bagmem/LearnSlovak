"use client"

import { motion } from "framer-motion"
import { FaBullseye } from "react-icons/fa"
import type { DailyGoal } from "../../../hooks/useDailyGoals"

type Props = {
  goals: DailyGoal[]
}

export default function DailyGoalsWidget({ goals }: Props) {
  if (!goals.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <FaBullseye className="text-orange-500" />
        Ежедневные цели
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {goals.map((goal) => {
          const percent = Math.min((goal.progress / goal.target) * 100, 100)
          const completed = goal.progress >= goal.target
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-4 border backdrop-blur-sm transition-all ${
                completed
                  ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                  : "bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50"
              }`}
            >
              <p className={`font-bold text-sm ${completed ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-white"}`}>
                {goal.description}
              </p>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${completed ? "bg-green-500" : "bg-gradient-to-r from-orange-500 to-amber-500"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {goal.progress}/{goal.target} • +{goal.reward} XP
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}