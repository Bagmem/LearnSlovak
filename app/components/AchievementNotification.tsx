// components/AchievementNotification.tsx
"use client"

import { useEffect } from "react"
import { type UnlockedAchievement } from "../../hooks/useAchievements"

type Props = {
  achievement: UnlockedAchievement | null
  onHide?: () => void
}

export default function AchievementNotification({ achievement, onHide }: Props) {
  useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(() => onHide?.(), 4000)
    return () => clearTimeout(timer)
  }, [achievement, onHide])

  if (!achievement) return null

  return (
    <div className="fixed top-20 right-4 z-50 animate-slideInScale bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-lg p-4 max-w-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Достижение!</p>
          <p className="font-black">{achievement.title}</p>
          <p className="text-xs opacity-90">{achievement.description}</p>
          {achievement.reward && <p className="text-xs font-bold mt-1">+{achievement.reward} XP</p>}
        </div>
      </div>
    </div>
  )
}