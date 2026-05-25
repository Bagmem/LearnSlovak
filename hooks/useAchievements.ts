import { useState, useEffect, useCallback } from "react"
import { achievements, type Achievement, type AchievementState } from "../data/achievements"

export type UnlockedAchievement = Achievement & { unlockedAt: number }

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([])
  const [lastUnlocked, setLastUnlocked] = useState<UnlockedAchievement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("slovak_achievements")
    if (saved) {
      try {
        setUnlocked(JSON.parse(saved))
      } catch {
        setUnlocked([])
      }
    } else {
      setUnlocked([])
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("slovak_achievements", JSON.stringify(unlocked))
    }
  }, [unlocked, isLoaded])

  const checkAchievements = useCallback((state: AchievementState) => {
    if (!isLoaded) return []
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
  }, [unlocked, isLoaded])

  return { unlocked, lastUnlocked, checkAchievements, isLoaded }
}