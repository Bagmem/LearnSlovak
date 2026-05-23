// data/achievements.ts

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  condition: (state: AchievementState) => boolean
  reward?: number // XP за получение
}

export type AchievementState = {
  totalXp: number
  totalCorrect: number
  totalWrong: number
  streak: number
  maxStreak: number
  completedCategories: number
  learnedWords: number
  flashcardAnswers: number
  writeAnswers: number
  choiceAnswers: number
}

export const achievements: Achievement[] = [
  // === Базовые ===
  {
    id: "first-blood",
    title: "Первый шаг",
    description: "Правильно ответить на первый вопрос",
    icon: "🎯",
    condition: (state) => state.totalCorrect >= 1,
    reward: 10,
  },
  {
    id: "streak-5",
    title: "Серия 5",
    description: "Правильно ответить 5 раз подряд",
    icon: "🔥",
    condition: (state) => state.maxStreak >= 5,
    reward: 20,
  },
  {
    id: "streak-10",
    title: "Серия 10",
    description: "Правильно ответить 10 раз подряд",
    icon: "🔥🔥",
    condition: (state) => state.maxStreak >= 10,
    reward: 50,
  },
  {
    id: "streak-25",
    title: "Железная воля",
    description: "Правильно ответить 25 раз подряд",
    icon: "⚡",
    condition: (state) => state.maxStreak >= 25,
    reward: 100,
  },
  {
    id: "streak-50",
    title: "Легенда",
    description: "Правильно ответить 50 раз подряд",
    icon: "🏅",
    condition: (state) => state.maxStreak >= 50,
    reward: 200,
  },
  // === XP ===
  {
    id: "xp-100",
    title: "100 XP",
    description: "Накопить 100 очков опыта",
    icon: "⭐",
    condition: (state) => state.totalXp >= 100,
    reward: 20,
  },
  {
    id: "xp-500",
    title: "500 XP",
    description: "Накопить 500 очков опыта",
    icon: "🌟🌟",
    condition: (state) => state.totalXp >= 500,
    reward: 50,
  },
  {
    id: "xp-1000",
    title: "1000 XP",
    description: "Накопить 1000 очков опыта",
    icon: "🏆",
    condition: (state) => state.totalXp >= 1000,
    reward: 100,
  },
  {
    id: "xp-5000",
    title: "Мастер XP",
    description: "Накопить 5000 очков опыта",
    icon: "👑",
    condition: (state) => state.totalXp >= 5000,
    reward: 250,
  },
  // === Точность ===
  {
    id: "accuracy-90",
    title: "Меткий стрелок",
    description: "Достичь точности 90% (минимум 10 ответов)",
    icon: "🎯",
    condition: (state) => {
      const total = state.totalCorrect + state.totalWrong
      return total >= 10 && (state.totalCorrect / total) >= 0.9
    },
    reward: 30,
  },
  {
    id: "accuracy-95",
    title: "Снайпер",
    description: "Достичь точности 95% (минимум 50 ответов)",
    icon: "🎯🎯",
    condition: (state) => {
      const total = state.totalCorrect + state.totalWrong
      return total >= 50 && (state.totalCorrect / total) >= 0.95
    },
    reward: 75,
  },
  // === Категории ===
  {
    id: "category-master",
    title: "Мастер категории",
    description: "Полностью пройти одну категорию",
    icon: "🏆",
    condition: (state) => state.completedCategories >= 1,
    reward: 50,
  },
  {
    id: "category-collector",
    title: "Коллекционер",
    description: "Полностью пройти 5 категорий",
    icon: "🏆🏆",
    condition: (state) => state.completedCategories >= 5,
    reward: 150,
  },
  {
    id: "category-legend",
    title: "Легенда категорий",
    description: "Полностью пройти 10 категорий",
    icon: "🏆🏆🏆",
    condition: (state) => state.completedCategories >= 10,
    reward: 300,
  },
  // === Слова ===
  {
    id: "words-50",
    title: "50 слов",
    description: "Выучить 50 слов",
    icon: "📚",
    condition: (state) => state.learnedWords >= 50,
    reward: 30,
  },
  {
    id: "words-100",
    title: "100 слов",
    description: "Выучить 100 слов",
    icon: "📚📚",
    condition: (state) => state.learnedWords >= 100,
    reward: 60,
  },
  {
    id: "words-250",
    title: "250 слов",
    description: "Выучить 250 слов",
    icon: "📚📚📚",
    condition: (state) => state.learnedWords >= 250,
    reward: 120,
  },
  {
    id: "words-500",
    title: "500 слов",
    description: "Выучить 500 слов",
    icon: "🏅",
    condition: (state) => state.learnedWords >= 500,
    reward: 250,
  },
  // === Режимы ===
  {
    id: "flashcard-master",
    title: "Картёжник",
    description: "Правильно ответить на 30 карточек",
    icon: "🃏",
    condition: (state) => state.flashcardAnswers >= 30,
    reward: 25,
  },
  {
    id: "flashcard-guru",
    title: "Гуру карточек",
    description: "Правильно ответить на 100 карточек",
    icon: "🃏🃏",
    condition: (state) => state.flashcardAnswers >= 100,
    reward: 60,
  },
  {
    id: "writer",
    title: "Писатель",
    description: "Правильно ответить в режиме письма 20 раз",
    icon: "✍️",
    condition: (state) => state.writeAnswers >= 20,
    reward: 25,
  },
  {
    id: "writer-pro",
    title: "Профессор письма",
    description: "Правильно ответить в режиме письма 100 раз",
    icon: "✍️✍️",
    condition: (state) => state.writeAnswers >= 100,
    reward: 75,
  },
  {
    id: "quiz-master",
    title: "Знаток тестов",
    description: "Правильно ответить в тесте 50 раз",
    icon: "✅",
    condition: (state) => state.choiceAnswers >= 50,
    reward: 40,
  },
  {
    id: "quiz-legend",
    title: "Легенда тестов",
    description: "Правильно ответить в тесте 200 раз",
    icon: "✅✅",
    condition: (state) => state.choiceAnswers >= 200,
    reward: 120,
  },
  // === Общие достижения ===
  {
    id: "perfect-day",
    title: "Идеальный день",
    description: "Правильно ответить на 20 вопросов без ошибок за один день",
    icon: "✨",
    condition: () => {
      // Достижение будет отслеживаться отдельно через localStorage, упростим:
      // Для простоты используем состояние: если totalCorrect за сегодня >=20 и totalWrong == 0
      // Но у нас нет отслеживания за день. Поэтому добавим позже, а пока оставим заглушку.
      return false
    },
    reward: 100,
  },
]