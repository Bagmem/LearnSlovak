import { type LanguageLevel } from "../data/words"

export type UserLevel = LanguageLevel | null

export function normalizeUserLevel(level: any): UserLevel {
  if (level === "A1" || level === "A2" || level === "B1" || level === "B2" || level === "C1") {
    return level
  }
  return null
}

export function canAccessLevel(userLevel: UserLevel, targetLevel: LanguageLevel): boolean {
  const levels: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1"]
  const targetIndex = levels.indexOf(targetLevel)
  if (targetIndex === -1) return false
  if (targetLevel === "A1") return true
  if (userLevel === null) return false
  const userIndex = levels.indexOf(userLevel)
  return targetIndex <= userIndex + 1
}

export function getNextLevel(currentLevel: UserLevel): LanguageLevel | null {
  const levels: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1"]
  if (currentLevel === null) return "A1"
  const index = levels.indexOf(currentLevel)
  if (index === -1 || index === levels.length - 1) return null
  return levels[index + 1]
}