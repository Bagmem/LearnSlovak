// hooks/useAchievements.ts
import { useState, useEffect, useCallback } from "react"
import { achievements, type Achievement, type AchievementState } from "../data/achievements"

export type UnlockedAchievement = Achievement & { unlockedAt: number }

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([])
  const [lastUnlocked, setLastUnlocked] = useState<UnlockedAchievement | null>(null)

  // Загрузка
  useEffect(() => {
    const saved = localStorage.getItem("slovak_achievements")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUnlocked(parsed)
      } catch (e) {}
    }
  }, [])

  // Сохранение
  useEffect(() => {
    localStorage.setItem("slovak_achievements", JSON.stringify(unlocked))
  }, [unlocked])

  const checkAchievements = useCallback((state: AchievementState) => {
    const newlyUnlocked: UnlockedAchievement[] = []
    for (const ach of achievements) {
      if (unlocked.some(u => u.id === ach.id)) continue
      if (ach.condition(state)) {
        const newAch: UnlockedAchievement = {
          ...ach,
          unlockedAt: Date.now(),
        }
        newlyUnlocked.push(newAch)
      }
    }
    if (newlyUnlocked.length > 0) {
      setUnlocked(prev => [...prev, ...newlyUnlocked])
      setLastUnlocked(newlyUnlocked[0])
      setTimeout(() => setLastUnlocked(null), 5000)
      return newlyUnlocked
    }
    return []
  }, [unlocked])

  return { unlocked, lastUnlocked, checkAchievements }
}