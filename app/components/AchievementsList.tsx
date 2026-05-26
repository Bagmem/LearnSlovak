"use client"

import { motion } from "framer-motion"
import { achievements } from "../../data/achievements"
import { type UnlockedAchievement } from "../../hooks/useAchievements"
import { getIconForAchievement } from "../../utils/achievementIcons"
import { FaTrophy } from "react-icons/fa"

type Props = {
  unlocked: UnlockedAchievement[]
}

export default function AchievementsList({ unlocked }: Props) {
  const unlockedIds = new Set(unlocked.map(u => u.id))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-4 shadow-sm mt-6"
    >
      <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <FaTrophy className="text-yellow-500" /> Достижения
      </h3>
      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
        {achievements.map((ach, idx) => {
          const isUnlocked = unlockedIds.has(ach.id)
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-xl border transition-all ${
                isUnlocked
                  ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700"
                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl">{getIconForAchievement(ach.id, 20)}</div>
                <div>
                  <p className="font-black text-sm text-gray-800 dark:text-white">{ach.title}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{ach.description}</p>
                  {ach.reward && <p className="text-[10px] font-bold text-orange-500">+{ach.reward} XP</p>}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}