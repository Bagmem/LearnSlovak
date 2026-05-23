import { type Word } from "../data/words"
import { type GrammarWord } from "../data/grammar"

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

export function generateWrongOptions(
  correctWord: Word | GrammarWord,
  pool: (Word | GrammarWord)[],
  count: number = 2,
  dataType: "vocab" | "grammar" = "vocab"
): string[] {
  let candidates = pool.filter(w => w.slovak !== correctWord.slovak)
  
  if (dataType === "vocab") {
    const sameCategory = candidates.filter(w => w.category === correctWord.category && w.level === correctWord.level)
    if (sameCategory.length >= count) candidates = sameCategory
    else {
      const sameLevel = candidates.filter(w => w.level === correctWord.level)
      if (sameLevel.length >= count) candidates = sameLevel
    }
    candidates.sort((a, b) => 
      Math.abs(a.slovak.length - correctWord.slovak.length) - Math.abs(b.slovak.length - correctWord.slovak.length)
    )
  } else {
    const sameCategory = candidates.filter(w => w.category === correctWord.category && w.level === correctWord.level)
    if (sameCategory.length >= count) candidates = sameCategory
    else {
      const sameLevel = candidates.filter(w => w.level === correctWord.level)
      if (sameLevel.length >= count) candidates = sameLevel
    }
    const correctStart = correctWord.slovak.slice(0, 3).toLowerCase()
    candidates.sort((a, b) => {
      const aScore = a.slovak.toLowerCase().startsWith(correctStart) ? 0 : 1
      const bScore = b.slovak.toLowerCase().startsWith(correctStart) ? 0 : 1
      return aScore - bScore
    })
  }
  
  const shuffled = [...candidates].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(w => w.slovak)
}

export type WordStats = {
  id: string
  correctCount: number
  wrongCount: number
  lastSeen: number
  nextReview: number
  easeFactor: number
  interval: number
}

export function createEmptyWordStats(id: string): WordStats {
  return {
    id,
    correctCount: 0,
    wrongCount: 0,
    lastSeen: 0,
    nextReview: 0,
    easeFactor: 2.5,
    interval: 0,
  }
}

export function updateWordStats(stats: WordStats | null, isCorrect: boolean): WordStats {
  const now = Date.now()
  if (!stats) {
    return {
      id: "",
      correctCount: isCorrect ? 1 : 0,
      wrongCount: isCorrect ? 0 : 1,
      lastSeen: now,
      nextReview: now + (isCorrect ? 3_600_000 : 600_000),
      easeFactor: 2.5,
      interval: 0,
    }
  }

  let { correctCount, wrongCount, easeFactor, interval } = stats
  if (isCorrect) {
    correctCount++
    if (correctCount === 1) {
      interval = 1
    } else if (correctCount === 2) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    easeFactor = Math.min(2.5, Math.max(1.3, easeFactor + 0.1))
  } else {
    wrongCount++
    interval = 0
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  }

  const nextReview = now + (interval * 24 * 60 * 60 * 1000)
  return {
    ...stats,
    correctCount,
    wrongCount,
    lastSeen: now,
    nextReview: isCorrect ? nextReview : now + 600_000,
    easeFactor,
    interval,
  }
}

export function selectNextWord(words: Word[], statsMap: Map<string, WordStats>): Word {
  const now = Date.now()
  const dueWords = words.filter((w) => {
    const key = `${w.slovak}|${w.russian}`
    const stat = statsMap.get(key)
    return !stat || stat.nextReview <= now
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
    const aNext = statsMap.get(`${a.slovak}|${a.russian}`)?.nextReview || 0
    const bNext = statsMap.get(`${b.slovak}|${b.russian}`)?.nextReview || 0
    return aNext - bNext
  })
  return all[0]
}