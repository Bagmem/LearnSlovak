// data/achievements.ts

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  condition: (state: AchievementState) => boolean
  reward?: number
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
  // Новые поля для дополнительных достижений
  quizCompletedCount: number      // количество пройденных викторин (тексты)
  hardWordsMarked: number          // количество отмеченных сложных слов
  skipCount: number                // количество использованных пропусков
  perfectLessonCount: number       // количество уроков, завершённых с 100% точностью
  textsReadCount: number           // количество прочитанных текстов
  // (если какие-то не используются – можно убрать, но оставлю на будущее)
}

export const achievements: Achievement[] = [
  // === Базовые (были) ===
  { id: "first-blood", title: "Первый шаг", description: "Правильно ответить на первый вопрос", icon: "🎯", condition: (s) => s.totalCorrect >= 1, reward: 10 },
  { id: "streak-5", title: "Серия 5", description: "Правильно ответить 5 раз подряд", icon: "🔥", condition: (s) => s.maxStreak >= 5, reward: 20 },
  { id: "streak-10", title: "Серия 10", description: "Правильно ответить 10 раз подряд", icon: "🔥🔥", condition: (s) => s.maxStreak >= 10, reward: 50 },
  { id: "streak-25", title: "Железная воля", description: "Правильно ответить 25 раз подряд", icon: "⚡", condition: (s) => s.maxStreak >= 25, reward: 100 },
  { id: "streak-50", title: "Легенда", description: "Правильно ответить 50 раз подряд", icon: "🏅", condition: (s) => s.maxStreak >= 50, reward: 200 },
  // === XP ===
  { id: "xp-100", title: "100 XP", description: "Накопить 100 очков опыта", icon: "⭐", condition: (s) => s.totalXp >= 100, reward: 20 },
  { id: "xp-500", title: "500 XP", description: "Накопить 500 очков опыта", icon: "🌟🌟", condition: (s) => s.totalXp >= 500, reward: 50 },
  { id: "xp-1000", title: "1000 XP", description: "Накопить 1000 очков опыта", icon: "🏆", condition: (s) => s.totalXp >= 1000, reward: 100 },
  { id: "xp-5000", title: "Мастер XP", description: "Накопить 5000 очков опыта", icon: "👑", condition: (s) => s.totalXp >= 5000, reward: 250 },
  // === Точность ===
  { id: "accuracy-90", title: "Меткий стрелок", description: "Достичь точности 90% (минимум 10 ответов)", icon: "🎯", condition: (s) => { const t = s.totalCorrect + s.totalWrong; return t >= 10 && (s.totalCorrect / t) >= 0.9 }, reward: 30 },
  { id: "accuracy-95", title: "Снайпер", description: "Достичь точности 95% (минимум 50 ответов)", icon: "🎯🎯", condition: (s) => { const t = s.totalCorrect + s.totalWrong; return t >= 50 && (s.totalCorrect / t) >= 0.95 }, reward: 75 },
  // === Категории ===
  { id: "category-master", title: "Мастер категории", description: "Полностью пройти одну категорию", icon: "🏆", condition: (s) => s.completedCategories >= 1, reward: 50 },
  { id: "category-collector", title: "Коллекционер", description: "Полностью пройти 3 категории", icon: "🏆🏆", condition: (s) => s.completedCategories >= 3, reward: 100 },
  { id: "category-legend", title: "Легенда категорий", description: "Полностью пройти 7 категорий", icon: "🏆🏆🏆", condition: (s) => s.completedCategories >= 7, reward: 200 },
  // === Слова ===
  { id: "words-20", title: "20 слов", description: "Выучить 20 слов", icon: "📚", condition: (s) => s.learnedWords >= 20, reward: 20 },
  { id: "words-50", title: "50 слов", description: "Выучить 50 слов", icon: "📚📚", condition: (s) => s.learnedWords >= 50, reward: 40 },
  { id: "words-100", title: "100 слов", description: "Выучить 100 слов", icon: "📚📚📚", condition: (s) => s.learnedWords >= 100, reward: 80 },
  { id: "words-250", title: "250 слов", description: "Выучить 250 слов", icon: "🏅", condition: (s) => s.learnedWords >= 250, reward: 150 },
  // === Режимы ===
  { id: "flashcard-master", title: "Картёжник", description: "Правильно ответить на 20 карточек", icon: "🃏", condition: (s) => s.flashcardAnswers >= 20, reward: 25 },
  { id: "flashcard-guru", title: "Гуру карточек", description: "Правильно ответить на 60 карточек", icon: "🃏🃏", condition: (s) => s.flashcardAnswers >= 60, reward: 60 },
  { id: "writer", title: "Писатель", description: "Правильно ответить в режиме письма 10 раз", icon: "✍️", condition: (s) => s.writeAnswers >= 10, reward: 20 },
  { id: "writer-pro", title: "Профессор письма", description: "Правильно ответить в режиме письма 50 раз", icon: "✍️✍️", condition: (s) => s.writeAnswers >= 50, reward: 60 },
  { id: "quiz-master", title: "Знаток тестов", description: "Правильно ответить в тесте 30 раз", icon: "✅", condition: (s) => s.choiceAnswers >= 30, reward: 30 },
  { id: "quiz-legend", title: "Легенда тестов", description: "Правильно ответить в тесте 100 раз", icon: "✅✅", condition: (s) => s.choiceAnswers >= 100, reward: 100 },

  // ========== НОВЫЕ ДОСТИЖЕНИЯ ==========
  // Викторины по текстам
  {
    id: "first-quiz",
    title: "Первая викторина",
    description: "Пройдите первую викторину по тексту",
    icon: "📝",
    condition: (s) => s.quizCompletedCount >= 1,
    reward: 15,
  },
  {
    id: "quiz-master-5",
    title: "Любитель викторин",
    description: "Пройдите 5 викторин по текстам",
    icon: "📝📝",
    condition: (s) => s.quizCompletedCount >= 5,
    reward: 40,
  },
  {
    id: "quiz-professor",
    title: "Профессор викторин",
    description: "Пройдите 10 викторин по текстам",
    icon: "📝📝📝",
    condition: (s) => s.quizCompletedCount >= 10,
    reward: 80,
  },
  // Сложные слова
  {
    id: "first-hard-word",
    title: "Первое сложное слово",
    description: "Отметьте слово как сложное",
    icon: "💀",
    condition: (s) => s.hardWordsMarked >= 1,
    reward: 10,
  },
  {
    id: "hard-word-collector",
    title: "Коллекционер сложных слов",
    description: "Отметьте 10 слов как сложные",
    icon: "💀💀",
    condition: (s) => s.hardWordsMarked >= 10,
    reward: 50,
  },
  {
    id: "hard-word-master",
    title: "Мастер сложных слов",
    description: "Отметьте 30 слов как сложные",
    icon: "💀💀💀",
    condition: (s) => s.hardWordsMarked >= 30,
    reward: 120,
  },
  // Пропуски
  {
    id: "first-skip",
    title: "Первый пропуск",
    description: "Используйте пропуск слова",
    icon: "⏩",
    condition: (s) => s.skipCount >= 1,
    reward: 5,
  },
  {
    id: "skip-master",
    title: "Мастер пропусков",
    description: "Используйте пропуск 20 раз",
    icon: "⏩⏩",
    condition: (s) => s.skipCount >= 20,
    reward: 30,
  },
  {
    id: "skip-legend",
    title: "Легенда пропусков",
    description: "Используйте пропуск 50 раз",
    icon: "⏩⏩⏩",
    condition: (s) => s.skipCount >= 50,
    reward: 70,
  },
  // Идеальный урок
  {
    id: "first-perfect-lesson",
    title: "Идеальный урок",
    description: "Завершите урок с 100% точностью",
    icon: "💯",
    condition: (s) => s.perfectLessonCount >= 1,
    reward: 50,
  },
  {
    id: "perfect-lesson-collector",
    title: "Коллекционер идеалов",
    description: "Завершите 5 уроков с 100% точностью",
    icon: "💯💯",
    condition: (s) => s.perfectLessonCount >= 5,
    reward: 150,
  },
  // Чтение текстов
  {
    id: "first-text-read",
    title: "Первый текст",
    description: "Прочитайте первый текст",
    icon: "📖",
    condition: (s) => s.textsReadCount >= 1,
    reward: 10,
  },
  {
    id: "text-read-master",
    title: "Заядлый читатель",
    description: "Прочитайте 10 текстов",
    icon: "📖📖",
    condition: (s) => s.textsReadCount >= 10,
    reward: 40,
  },
  {
    id: "text-read-legend",
    title: "Книжный червь",
    description: "Прочитайте все тексты",
    icon: "📖📖📖",
    condition: (s) => s.textsReadCount >= 20, // если всего текстов 20 (пример)
    reward: 100,
  },
  // Серия 7 дней (заменяет идеальную неделю)
  {
    id: "streak-7",
    title: "Неделя без перерыва",
    description: "Заниматься 7 дней подряд",
    icon: "📅",
    condition: (s) => s.maxStreak >= 7,
    reward: 70,
  },
]