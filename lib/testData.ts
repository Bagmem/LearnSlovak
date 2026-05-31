import { words, type LanguageLevel } from "../data/words"
import { texts, type SlovakText } from "../data/texts"
import { grammarExercises } from "../data/grammar"
import { FACTS_DB } from "../data/trueFalse"

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Секция 1: текст и вопросы
export function getTextSection(
  level: LanguageLevel
): { text: SlovakText; questions: { text: string; options: string[]; correct: number }[] } | null {
  let levelTexts = texts.filter(t => t.level === level)
  if (levelTexts.length === 0) {
    const levelsOrder: LanguageLevel[] = ["A1", "A2", "B1", "B2", "C1"]
    const currentIndex = levelsOrder.indexOf(level)
    for (let i = currentIndex - 1; i >= 0; i--) {
      levelTexts = texts.filter(t => t.level === levelsOrder[i])
      if (levelTexts.length > 0) break
    }
  }
  if (levelTexts.length === 0) return null
  const text = levelTexts[Math.floor(Math.random() * levelTexts.length)]
  let questions = text.questions || []
  if (questions.length === 0) {
    questions = [
      {
        text: "О чём этот текст?",
        options: ["О школе", "О семье", "О работе", "О путешествиях"],
        correct: 0,
      },
      {
        text: "Какой уровень у этого текста?",
        options: ["A1", "A2", "B1", "B2"],
        correct: 0,
      },
    ]
  }
  questions = questions.slice(0, 6).map(q => ({
    ...q,
    options: shuffleArray(q.options),
  }))
  return { text, questions }
}

// Секция 2: перевод слов
export function getTranslationWords(
  level: LanguageLevel
): { slovak: string; russian: string; accepted?: string[] }[] {
  const levelWords = words.filter(w => w.level === level)
  let targetCount: number
  switch (level) {
    case "A1": targetCount = 12; break
    case "A2": targetCount = 10; break
    case "B1": targetCount = 8; break
    case "B2": targetCount = 6; break
    case "C1": targetCount = 5; break
    default: targetCount = 8
  }
  const selected = shuffleArray([...levelWords]).slice(0, targetCount).map(w => ({
    slovak: w.slovak,
    russian: w.russian,
    accepted: [] as string[],
  }))
  return selected
}

// Секция 3: формы глаголов
export function getVerbQuestions(
  level: LanguageLevel,
  count: number = 6
): {
  sentence: string
  options: string[]
  correct: number
  explanation?: string
}[] {
  let pool = grammarExercises.filter(
    e => e.level === level && e.type === "choose-form" && e.options && e.options.length > 0
  )
  const result: any[] = []

  if (pool.length >= count) {
    const selected = shuffleArray(pool).slice(0, count)
    return selected.map(e => ({
      sentence: e.sentence,
      options: shuffleArray([...e.options!]),
      correct: e.options!.indexOf(e.correctAnswer),
      explanation: e.explanation,
    }))
  }

  result.push(
    ...pool.map(e => ({
      sentence: e.sentence,
      options: shuffleArray([...e.options!]),
      correct: e.options!.indexOf(e.correctAnswer),
      explanation: e.explanation,
    }))
  )

  const fillPool = grammarExercises.filter(e => e.level === level && e.type === "fill-blank")
  const remaining = count - result.length
  if (fillPool.length > 0) {
    const selectedFill = shuffleArray(fillPool).slice(0, remaining)
    const allAnswers = grammarExercises
      .filter(e => e.level === level && e.correctAnswer)
      .map(e => e.correctAnswer)
    for (const f of selectedFill) {
      const wrongAnswers = shuffleArray(allAnswers.filter(a => a !== f.correctAnswer)).slice(0, 3)
      const options = shuffleArray([f.correctAnswer, ...wrongAnswers])
      result.push({
        sentence: f.sentence,
        options,
        correct: options.indexOf(f.correctAnswer),
        explanation: f.explanation,
      })
    }
  }

  return result
}

// Секция 4: сопоставление пар
export function getMatchPairs(level: LanguageLevel, count: number = 6) {
  const levelWords = words.filter(w => w.level === level)
  const shuffled = shuffleArray([...levelWords])
  const selectedPairs = shuffled.slice(0, count).map(w => ({
    slovak: w.slovak,
    russian: w.russian,
  }))
  const left = shuffleArray(selectedPairs.map(p => p.slovak))
  const right = shuffleArray(selectedPairs.map(p => p.russian))
  return { left, right, pairs: selectedPairs }
}

// Секция 5: правда/ложь (случайный выбор из базы фактов)
export function getTrueFalseQuestions(
  level: LanguageLevel,
  count: number = 6
): { statement: string; isTrue: boolean }[] {
  const pool = FACTS_DB[level] || FACTS_DB.A1
  const shuffled = shuffleArray([...pool])
  return shuffled.slice(0, count)
}