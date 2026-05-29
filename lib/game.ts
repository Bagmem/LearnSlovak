import { type Word } from "../data/words"
import { type GrammarWord } from "../data/grammar"

// ─── Вспомогательные функции ──────────────────────────
export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .replace(/\s+/g, " ")
}

export function checkAnswer(word: Word, userAnswer: string): boolean {
  return normalizeString(word.slovak) === normalizeString(userAnswer)
}

export function isWordLearned(stat: WordStats): boolean {
  return stat.correctCount >= 2 && stat.correctCount >= stat.wrongCount
}

const randomShuffle = <T>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5)

export function generateWrongOptions(
  correctWord: Word | GrammarWord,
  pool: (Word | GrammarWord)[],
  count: number = 2,
  dataType: "vocab" | "grammar" = "vocab"
): string[] {
  const candidates = pool.filter(w => w.slovak !== correctWord.slovak)
  const sameCategory = candidates.filter(w => w.category === correctWord.category && w.level === correctWord.level)
  const sameLevel = candidates.filter(w => w.level === correctWord.level)
  const poolToUse = sameCategory.length >= count ? sameCategory : sameLevel.length >= count ? sameLevel : candidates

  const ranked = [...poolToUse]
  if (dataType === "vocab") {
    ranked.sort((a, b) =>
      Math.abs(a.slovak.length - correctWord.slovak.length) - Math.abs(b.slovak.length - correctWord.slovak.length)
    )
  } else {
    const correctStart = correctWord.slovak.slice(0, 3).toLowerCase()
    ranked.sort((a, b) => {
      const aScore = a.slovak.toLowerCase().startsWith(correctStart) ? 0 : 1
      const bScore = b.slovak.toLowerCase().startsWith(correctStart) ? 0 : 1
      return aScore - bScore
    })
  }

  return randomShuffle(ranked).slice(0, count).map(w => w.slovak)
}

// ─── Типы и функции для статистики слов ──────────────
export type WordStats = {
  id: string
  correctCount: number
  wrongCount: number
  nextReview: string | null   // ISO date "YYYY-MM-DD" или null, если не назначено
  interval: number           // дней до следующего повторения (0 = сегодня)
}

export function createEmptyWordStats(id: string): WordStats {
  return {
    id,
    correctCount: 0,
    wrongCount: 0,
    nextReview: null,
    interval: 0,
  }
}

/** Приводит сырые данные из localStorage к актуальному типу WordStats */
export function migrateStats(raw: any): WordStats {
  const stats: WordStats = {
    id: raw.id || "",
    correctCount: raw.correctCount || 0,
    wrongCount: raw.wrongCount || 0,
    nextReview: null,
    interval: raw.interval || 0,
  }

  if (raw.nextReview !== null && raw.nextReview !== undefined) {
    if (typeof raw.nextReview === 'number') {
      // Старый формат – timestamp в миллисекундах
      const reviewDate = new Date(raw.nextReview)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (reviewDate <= today) {
        stats.nextReview = null   // пора повторить
        stats.interval = 0
      } else {
        stats.nextReview = reviewDate.toISOString().slice(0, 10)
      }
    } else if (typeof raw.nextReview === 'string') {
      stats.nextReview = raw.nextReview
    }
  }

  return stats
}

/**
 * Обновляет интервал и дату следующего повторения по алгоритму SM-2 (упрощённый).
 * Вызывается ДО updateWordStats, чтобы сначала пересчитать расписание.
 */
export function updateSpacedRepetition(stats: WordStats, isCorrect: boolean): WordStats {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  if (isCorrect) {
    let newInterval: number
    if (stats.interval === 0) {
      newInterval = 1
    } else if (stats.interval === 1) {
      newInterval = 3
    } else {
      newInterval = Math.round(stats.interval * 2.5)
    }
    const nextReview = new Date(now)
    nextReview.setDate(nextReview.getDate() + newInterval)
    return {
      ...stats,
      interval: newInterval,
      nextReview: nextReview.toISOString().slice(0, 10),
    }
  } else {
    return {
      ...stats,
      interval: 0,
      nextReview: null,
    }
  }
}

/**
 * Обновляет счётчики правильных/неправильных ответов.
 * Вызывается ПОСЛЕ updateSpacedRepetition, чтобы не затереть изменения интервала.
 */
export function updateWordStats(stats: WordStats, isCorrect: boolean): WordStats {
  return {
    ...stats,
    correctCount: stats.correctCount + (isCorrect ? 1 : 0),
    wrongCount: stats.wrongCount + (isCorrect ? 0 : 1),
  }
}

/**
 * Выбирает следующее слово из списка, отдавая приоритет тем,
 * у которых время повторения уже наступило (nextReview <= сегодня).
 */
export function selectNextWord(words: Word[], statsMap: Map<string, WordStats>): Word {
  const today = new Date().toISOString().slice(0, 10)

  const dueWords = words.filter((w) => {
    const key = `${w.slovak}|${w.russian}`
    const stat = statsMap.get(key)
    if (!stat || stat.nextReview === null || stat.nextReview === undefined) return true
    const next = String(stat.nextReview)
    return next <= today
  })

  if (dueWords.length > 0) {
    dueWords.sort((a, b) => {
      const aWrong = statsMap.get(`${a.slovak}|${a.russian}`)?.wrongCount || 0
      const bWrong = statsMap.get(`${b.slovak}|${b.russian}`)?.wrongCount || 0
      return bWrong - aWrong
    })
    return dueWords[0]
  }

  const all = [...words]
  all.sort((a, b) => {
    const getNext = (word: Word): string => {
      const stat = statsMap.get(`${word.slovak}|${word.russian}`)
      if (!stat || stat.nextReview === null || stat.nextReview === undefined) return "9999-12-31"
      const raw = stat.nextReview
      return typeof raw === 'string' ? raw : String(raw)
    }
    const aNext = getNext(a)
    const bNext = getNext(b)
    return aNext.localeCompare(bNext)
  })
  return all[0]
}