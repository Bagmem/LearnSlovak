// hooks/useAchievements.ts
import { useState, useEffect, useCallback, useRef } from "react"
import { achievements, type Achievement, type AchievementState } from "../data/achievements"

export type UnlockedAchievement = Achievement & { unlockedAt: number }

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([])
  const [lastUnlocked, setLastUnlocked] = useState<UnlockedAchievement | null>(null)
  const isMountedRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("slovak_achievements")
    if (!saved) return

    try {
      setUnlocked(JSON.parse(saved))
    } catch {
      setUnlocked([])
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
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