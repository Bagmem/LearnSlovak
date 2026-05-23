// lib/xpLimits.ts
const getTodayKey = (): string => new Date().toISOString().slice(0, 10)

// ========== Ограничение XP для отдельных слов (раз в день) ==========
export function canEarnXpForWord(wordKey: string): boolean {
  const today = getTodayKey()
  const storageKey = `xp_word_${wordKey}_${today}`
  if (localStorage.getItem(storageKey)) return false
  localStorage.setItem(storageKey, '1')
  return true
}

// ========== Бонус за завершение категории (раз в день) ==========
export function canEarnLessonBonus(categoryKey: string): boolean {
  const today = getTodayKey()
  const storageKey = `xp_lesson_bonus_${categoryKey}_${today}`
  if (localStorage.getItem(storageKey)) return false
  localStorage.setItem(storageKey, '1')
  return true
}