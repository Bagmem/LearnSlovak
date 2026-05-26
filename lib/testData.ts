// lib/testData.ts
import { words, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { texts, type SlovakText } from "../data/texts"

// Вспомогательная функция для перемешивания массива
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Секция 1: текст и вопросы для конкретного уровня
export function getTextSection(level: LanguageLevel): { text: SlovakText; questions: any[] } | null {
  const levelTexts = texts.filter(t => t.level === level)
  if (levelTexts.length === 0) return null
  const text = levelTexts[0]
  let questions = text.questions || []
  if (questions.length === 0) {
    questions = [
      { text: "О чём этот текст?", options: ["О школе", "О семье", "О работе", "О путешествиях"], correct: 0 },
      { text: "Какой уровень у этого текста?", options: ["A1", "A2", "B1", "B2"], correct: 0 },
    ]
  }
  questions = questions.slice(0, 6).map(q => ({
    ...q,
    options: shuffleArray(q.options), // перемешиваем варианты ответов в вопросах текста
  }))
  return { text, questions }
}

// Секция 2: 12 слов для перевода (по одному из разных тем уровня)
export function getTranslationWords(level: LanguageLevel): { slovak: string; russian: string }[] {
  const levelWords = words.filter(w => w.level === level)
  const categories = new Map<string, string[]>()
  levelWords.forEach(w => {
    if (!categories.has(w.category)) categories.set(w.category, [])
    categories.get(w.category)!.push(w.slovak)
  })
  const uniqueCategories = Array.from(categories.keys())
  const selected: { slovak: string; russian: string }[] = []
  for (let i = 0; i < Math.min(12, uniqueCategories.length); i++) {
    const cat = uniqueCategories[i]
    const wordObj = levelWords.find(w => w.category === cat)
    if (wordObj) selected.push({ slovak: wordObj.slovak, russian: wordObj.russian })
  }
  return shuffleArray(selected) // перемешиваем порядок слов
}

// Секция 3: выбор правильной формы глагола (из грамматики уровня)
export function getVerbQuestions(level: LanguageLevel, count: number = 6) {
  const grammarItems = grammarTasks.filter(g => g.level === level)
  const shuffled = shuffleArray([...grammarItems])
  return shuffled.slice(0, count).map(item => {
    const correct = item.slovak
    // Генерируем 2 неправильных варианта (можно более изящно, но для простоты так)
    const wrong1 = item.slovak + "ť"
    const wrong2 = item.slovak.slice(0, -2)
    let options = [correct, wrong1, wrong2]
    options = shuffleArray(options) // перемешиваем варианты
    const correctIndex = options.indexOf(correct)
    return {
      sentence: `Выберите правильную форму глагола: ${item.russian}`,
      options,
      correct: correctIndex,
    }
  })
}

// Секция 4: сопоставление пар (6 пар)
export function getMatchPairs(level: LanguageLevel, count: number = 6) {
  const levelWords = words.filter(w => w.level === level)
  const shuffled = shuffleArray([...levelWords])
  const pairs = shuffled.slice(0, count).map(w => ({ slovak: w.slovak, russian: w.russian }))
  // Перемешиваем порядок отображения слов в левой и правой колонках (не нарушая соответствия)
  return {
    left: shuffleArray(pairs.map(p => p.slovak)),
    right: shuffleArray(pairs.map(p => p.russian)),
    pairs, // исходное соответствие
  }
}

// Секция 5: правда/ложь (6 утверждений, общих для всех уровней)
export function getTrueFalseQuestions(count: number = 6) {
  const statements = [
    { statement: "В словацком языке 7 падежей.", isTrue: true },
    { statement: "Словацкий язык использует кириллицу.", isTrue: false },
    { statement: "Словацкий и чешский взаимопонятны.", isTrue: true },
    { statement: "Ударение в словацком всегда падает на первый слог.", isTrue: true },
    { statement: "В словацком есть звук 'ы'.", isTrue: false },
    { statement: "Словацкий относится к славянским языкам.", isTrue: true },
  ]
  return shuffleArray(statements).slice(0, count)
}