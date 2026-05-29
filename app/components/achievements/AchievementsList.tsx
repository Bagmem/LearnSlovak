"use client"

import { achievements } from "../../../data/achievements"
import { type UnlockedAchievement } from "../../../hooks/useAchievements"
import { getIconForAchievement } from "../../../utils/achievementIcons"
import { FaTrophy } from "react-icons/fa"
import { motion } from "framer-motion"

type Props = {
  unlocked: UnlockedAchievement[]
}

export default function AchievementsList({ unlocked }: Props) {
  const unlockedIds = new Set(unlocked.map(u => u.id))

  return (
    <div className="rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4">
      <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
          <FaTrophy className="text-orange-500 text-sm" />
        </div>
        Все достижения
      </h3>
      <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
        {achievements.map((ach, idx) => {
          const isUnlocked = unlockedIds.has(ach.id)
          const unlockRecord = unlocked.find(u => u.id === ach.id)
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`p-3 rounded-xl border transition-all hover:shadow-md ${
                isUnlocked
                  ? "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-800/40"
                  : "bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 opacity-70"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl">{getIconForAchievement(ach.id, 20)}</div>
                <div className="flex-1">
                  <p className="font-black text-sm text-gray-800 dark:text-white">{ach.title}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{ach.description}</p>
                  {ach.reward && (
                    <p className="text-[10px] font-bold text-orange-500">+{ach.reward} XP</p>
                  )}
                  {isUnlocked && unlockRecord?.unlockedAt && (
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                      🎉 {new Date(unlockRecord.unlockedAt).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}