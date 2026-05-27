// lib/testData.ts
import { words, type LanguageLevel } from "../data/words"
import { texts, type SlovakText } from "../data/texts"
import { verbsByLevel } from "../data/verbs"
import { trueFalseQuestionsByLevel } from "../data/trueFalseQuestions"

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Секция 1: текст и вопросы
export function getTextSection(level: LanguageLevel): { text: SlovakText; questions: { text: string; options: string[]; correct: number }[] } | null {
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
    options: shuffleArray(q.options),
  }))
  return { text, questions }
}

// Секция 2: перевод слов (адаптивное количество)
export function getTranslationWords(level: LanguageLevel): { slovak: string; russian: string }[] {
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
  const categories = new Map<string, string[]>()
  levelWords.forEach(w => {
    if (!categories.has(w.category)) categories.set(w.category, [])
    categories.get(w.category)!.push(w.slovak)
  })
  const uniqueCategories = Array.from(categories.keys())
  const selectedCategories = shuffleArray(uniqueCategories).slice(0, targetCount)
  const selected: { slovak: string; russian: string }[] = []
  for (const cat of selectedCategories) {
    const wordObj = levelWords.find(w => w.category === cat)
    if (wordObj) selected.push({ slovak: wordObj.slovak, russian: wordObj.russian })
  }
  return shuffleArray(selected)
}

// Секция 3: выбор правильной формы глагола
export function getVerbQuestions(level: LanguageLevel, count: number = 6) {
  const verbs = verbsByLevel[level] || []
  if (verbs.length === 0) return []
  const shuffledVerbs = shuffleArray([...verbs])
  const selectedVerbs = shuffledVerbs.slice(0, count)
  const questions: { sentence: string; options: string[]; correct: number }[] = []
  for (const verb of selectedVerbs) {
    const formType = Math.floor(Math.random() * 3)
    let correctForm: string
    let formName: string
    switch (formType) {
      case 0:
        correctForm = verb.firstPerson
        formName = "1 лице единственного числа"
        break
      case 1:
        correctForm = verb.thirdPersonPlural
        formName = "3 лице множественного числа"
        break
      default:
        correctForm = verb.pastMasculine
        formName = "прошедшем времени (мужской род)"
    }
    const otherForms = [verb.firstPerson, verb.thirdPersonPlural, verb.pastMasculine].filter(f => f !== correctForm)
    let wrongOptions: string[] = []
    if (otherForms.length >= 2) {
      wrongOptions = shuffleArray(otherForms).slice(0, 2)
    } else {
      wrongOptions = [correctForm + "?", correctForm + "??"]
    }
    let options = [correctForm, ...wrongOptions]
    options = shuffleArray(options)
    const correctIndex = options.indexOf(correctForm)
    questions.push({
      sentence: `Выберите форму глагола "${verb.infinitive}" (${verb.translation}) в ${formName}:`,
      options,
      correct: correctIndex,
    })
  }
  return questions
}

// Секция 4: сопоставление пар
export function getMatchPairs(level: LanguageLevel, count: number = 6) {
  const levelWords = words.filter(w => w.level === level)
  const shuffled = shuffleArray([...levelWords])
  const selectedPairs = shuffled.slice(0, count).map(w => ({ slovak: w.slovak, russian: w.russian }))
  const left = shuffleArray(selectedPairs.map(p => p.slovak))
  const right = shuffleArray(selectedPairs.map(p => p.russian))
  return { left, right, pairs: selectedPairs }
}

// Секция 5: правда/ложь (адаптировано под уровень)
export function getTrueFalseQuestions(level: LanguageLevel, count: number = 6): { statement: string; isTrue: boolean }[] {
  const questions = trueFalseQuestionsByLevel[level] || trueFalseQuestionsByLevel.A1
  const shuffled = shuffleArray([...questions])
  return shuffled.slice(0, count)
}