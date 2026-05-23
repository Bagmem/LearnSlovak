import { type Word } from "../data/words"

// Нормализация строки
export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
    .replace(/\s+/g, " ")
}

// Проверка ответа
export function checkAnswer(word: Word, userAnswer: string): boolean {
  return normalizeString(word.slovak) === normalizeString(userAnswer)
}

// Генерация неправильных вариантов для режима "Тест"
export function generateWrongOptions(
  correctWord: Word,
  allWords: Word[],
  count: number = 2
): string[] {
  const otherWords = allWords.filter((w) => w.slovak !== correctWord.slovak)
  const shuffled = [...otherWords].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map((w) => w.slovak)
}

// Тип для статистики слова (интервальные повторения)
export type WordStats = {
  id: string // уникальный ключ "slovak|russian"
  correctCount: number
  wrongCount: number
  lastSeen: number // timestamp
  nextReview: number // timestamp (когда показывать снова)
  easeFactor: number // 1.3 - 2.5, начальный 2.5
  interval: number // дни
}

// Начальные значения для нового слова
export function createEmptyWordStats(id: string): WordStats {
  return {
    id,
    correctCount: 0,
    wrongCount: 0,
    lastSeen: 0,
    nextReview: 0, // показывать сразу
    easeFactor: 2.5,
    interval: 0,
  }
}

// Обновление статистики по алгоритму SM-2 (упрощённо)
export function updateWordStats(stats: WordStats | null, isCorrect: boolean): WordStats {
  const now = Date.now()
  if (!stats) {
    // Такого быть не должно, но на всякий случай
    return {
      id: "",
      correctCount: isCorrect ? 1 : 0,
      wrongCount: isCorrect ? 0 : 1,
      lastSeen: now,
      nextReview: now + (isCorrect ? 3_600_000 : 600_000), // 1 час или 10 минут
      easeFactor: 2.5,
      interval: 0,
    }
  }

  let { correctCount, wrongCount, easeFactor, interval } = stats
  if (isCorrect) {
    correctCount++
    if (correctCount === 1) {
      interval = 1 // первый повтор через 1 день
    } else if (correctCount === 2) {
      interval = 6 // через 6 дней
    } else {
      interval = Math.round(interval * easeFactor)
    }
    // Корректировка easeFactor (не более 2.5, не менее 1.3)
    easeFactor = Math.min(2.5, Math.max(1.3, easeFactor + 0.1))
  } else {
    wrongCount++
    interval = 0 // сброс интервала, слово будет показано вскоре
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  }

  const nextReview = now + (interval * 24 * 60 * 60 * 1000) // интервал в днях
  return {
    ...stats,
    correctCount,
    wrongCount,
    lastSeen: now,
    nextReview: isCorrect ? nextReview : now + 600_000, // ошибка -> через 10 минут
    easeFactor,
    interval,
  }
}

// Выбор следующего слова на основе статистики (слова с просроченным nextReview или с наибольшим приоритетом)
export function selectNextWord(
  words: Word[],
  statsMap: Map<string, WordStats>
): Word {
  const now = Date.now()
  // Сначала слова, у которых наступило время повтора
  const dueWords = words.filter((w) => {
    const key = `${w.slovak}|${w.russian}`
    const stat = statsMap.get(key)
    return !stat || stat.nextReview <= now
  })
  if (dueWords.length > 0) {
    // Сортируем по количеству ошибок (у кого больше ошибок – тот вперёд)
    dueWords.sort((a, b) => {
      const aWrong = statsMap.get(`${a.slovak}|${a.russian}`)?.wrongCount || 0
      const bWrong = statsMap.get(`${b.slovak}|${b.russian}`)?.wrongCount || 0
      return bWrong - aWrong
    })
    return dueWords[0]
  }
  // Если все слова в будущем, берём слово с самой ранней nextReview
  const all = [...words]
  all.sort((a, b) => {
    const aNext = statsMap.get(`${a.slovak}|${a.russian}`)?.nextReview || 0
    const bNext = statsMap.get(`${b.slovak}|${b.russian}`)?.nextReview || 0
    return aNext - bNext
  })
  return all[0]
}