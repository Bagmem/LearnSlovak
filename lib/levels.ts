import type { LanguageLevel } from "../data/words"

export const levelOrder: Record<LanguageLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
}

export function canAccessLevel(userLevel: LanguageLevel, itemLevel: LanguageLevel): boolean {
  return levelOrder[itemLevel] <= levelOrder[userLevel]
}

export function normalizeUserLevel(level: unknown): LanguageLevel {
  if (
    level === "A1" ||
    level === "A2" ||
    level === "B1" ||
    level === "B2" ||
    level === "C1" ||
    level === "C2"
  ) {
    return level
  }

  return "A1"
}