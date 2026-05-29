"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { words, type Word, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { checkAnswer, generateWrongOptions, selectNextWord, updateWordStats, type WordStats, createEmptyWordStats, updateSpacedRepetition } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import {
  playCorrectSound, playWrongSound, playLessonStartSound, playVictorySound, playClickSound,
  initAudio, playSkipSound, playMarkHardSound
} from "../lib/sounds"
import { canEarnXpForWord, canEarnLessonBonus } from "../lib/xpLimits"
import { canAccessLevel, type UserLevel } from "../lib/levels"
import toast from "react-hot-toast"

const getLocalDateString = (date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const calculateStreak = (dates: string[]): number => {
  if (!dates || dates.length === 0) return 0
  const uniqueDates = new Set(dates)
  const todayStr = getLocalDateString(new Date())
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = getLocalDateString(yesterday)
  const startDateStr = uniqueDates.has(todayStr) ? todayStr : uniqueDates.has(yesterdayStr) ? yesterdayStr : ""
  if (!startDateStr) return 0
  let streakCount = 0
  const checkDate = new Date(startDateStr)
  while (true) {
    const checkStr = getLocalDateString(checkDate)
    if (!uniqueDates.has(checkStr)) break
    streakCount++
    checkDate.setDate(checkDate.getDate() - 1)
  }
  return streakCount
}

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

type GameEngineInput = {
  userLevel: UserLevel
  xp: number
  setXp: (value: number | ((prev: number) => number)) => void
  activeDates: string[]
  setActiveDates: (value: string[] | ((prev: string[]) => string[])) => void
  progressData: Record<string, number>
  setProgressData: (value: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void
  wordStatsMap: Map<string, WordStats>
  setWordStatsMap: (value: Map<string, WordStats> | ((prev: Map<string, WordStats>) => Map<string, WordStats>)) => void
  correctAnswersCount: number
  setCorrectAnswersCount: (value: number | ((prev: number) => number)) => void
  totalClicksCount: number
  setTotalClicksCount: (value: number | ((prev: number) => number)) => void
  choiceCorrectCount: number
  setChoiceCorrectCount: (value: number | ((prev: number) => number)) => void
  writeCorrectCount: number
  setWriteCorrectCount: (value: number | ((prev: number) => number)) => void
  flashcardCorrectCount: number
  setFlashcardCorrectCount: (value: number | ((prev: number) => number)) => void
  hardWordsSet: Set<string>
  setHardWordsSet: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void
  onAchievementCheck: (skipCount: number, perfectLessonCount: number) => void
}

export type GameEngine = {
  screen: "menu" | "game" | "victory"
  setScreen: (screen: "menu" | "game" | "victory") => void
  selectedCategory: string | null
  selectedLevel: LanguageLevel | null
  currentDataSource: "vocab" | "grammar"
  gameMode: "choice" | "write" | "flashcard"
  setGameMode: (mode: "choice" | "write" | "flashcard") => void
  currentWord: Word | null
  lessonWords: Word[]
  completedWords: Set<string>
  options: string[]
  message: string
  selectedOption: string | null
  isAnswering: boolean
  lives: number
  disabled: boolean
  lessonProgressPercent: number
  remainingWordsCount: number
  totalLessonWords: number
  remainingCount: number
  sessionCorrect: number
  sessionTotal: number
  sessionMistakes: { word: string; translation: string }[]
  isExitConfirmOpen: boolean
  setIsExitConfirmOpen: (open: boolean) => void
  skipCount: number
  perfectLessonCount: number
  handleSelectCategory: (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar", customWords?: Word[]) => void
  checkAnswerHandler: (userInput: string) => void
  handleNextWord: () => void
  handleSkip: () => void
  handleMarkHard: (word: Word) => void
  handleFlashcardRating: (known: boolean) => void
  handleRestart: () => void
  handleBack: () => void
  confirmExit: () => void
  handleRetryMistakes: () => void
  getWordKey: (word: Word) => string
}

export function useGameEngine(input: GameEngineInput): GameEngine {
  const {
    userLevel,
    xp, setXp,
    activeDates, setActiveDates,
    progressData, setProgressData,
    wordStatsMap, setWordStatsMap,
    correctAnswersCount, setCorrectAnswersCount,
    totalClicksCount, setTotalClicksCount,
    choiceCorrectCount, setChoiceCorrectCount,
    writeCorrectCount, setWriteCorrectCount,
    flashcardCorrectCount, setFlashcardCorrectCount,
    hardWordsSet, setHardWordsSet,
    onAchievementCheck,
  } = input

  const [screen, setScreen] = useState<"menu" | "game" | "victory">("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null)
  const [currentDataSource, setCurrentDataSource] = useState<"vocab" | "grammar">("vocab")
  const [gameMode, setGameMode] = useState<"choice" | "write" | "flashcard">("choice")
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [lessonWords, setLessonWords] = useState<Word[]>([])
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [lives, setLives] = useState<number>(() => {
    const saved = loadProgress<number>("lives")
    return saved !== null ? saved : 3
  })
  const [message, setMessage] = useState<string>("")
  const [isAnswering, setIsAnswering] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [sessionMistakes, setSessionMistakes] = useState<{ word: string; translation: string }[]>([])
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)

  const [skipCount, setSkipCount] = useState(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("slovak_skip_count")
    return saved ? parseInt(saved, 10) : 0
  })
  const [perfectLessonCount, setPerfectLessonCount] = useState(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("slovak_perfect_lesson_count")
    return saved ? parseInt(saved, 10) : 0
  })

  const getWordKey = (word: Word): string => `${word.slovak}|${word.russian}`

  const totalLessonWords = lessonWords.length
  const completedCount = completedWords.size
  const remainingWordsCount = totalLessonWords - completedCount
  const lessonProgressPercent = totalLessonWords ? (completedCount / totalLessonWords) * 100 : 0

  const notCompletedWords = useMemo(
    () => lessonWords.filter((w) => !completedWords.has(getWordKey(w))),
    [lessonWords, completedWords]
  )

  const options = useMemo(() => {
    if (!currentWord || !selectedCategory || !selectedLevel || gameMode === "flashcard") return []
    const poolSource = currentDataSource === "vocab" ? words : grammarTasks
    const samePoolWords = poolSource.filter(
      (w: Word) => w.category === selectedCategory && w.level === selectedLevel
    )
    const pool = samePoolWords.length >= 3 ? samePoolWords : poolSource
    const wrongOptions = generateWrongOptions(
      currentWord,
      pool,
      2,
      currentDataSource
    )
    return shuffleArray([...wrongOptions, currentWord.slovak])
  }, [currentWord, selectedCategory, selectedLevel, currentDataSource, gameMode])

  const getRemainingWords = useCallback(() => {
    return lessonWords.filter(w => !completedWords.has(getWordKey(w)))
  }, [lessonWords, completedWords])

  const remainingCount = getRemainingWords().length

  const handleSelectCategory = useCallback((category: string, level: LanguageLevel, dataSource: "vocab" | "grammar", customWords?: Word[]) => {
    if (!canAccessLevel(userLevel, level) && category !== "review") {
      toast.error(`Уровень ${level} пока закрыт. Твой текущий уровень: ${userLevel || "не задан"}`)
      return
    }
    const poolSource = dataSource === "vocab" ? words : grammarTasks
    const filteredWords = customWords ? customWords : poolSource.filter((w: Word) => w.category === category && w.level === level)
    setLessonWords(filteredWords)
    setCompletedWords(new Set())
    setCurrentDataSource(dataSource)
    setSelectedCategory(category)
    setSelectedLevel(level)
    setCorrectAnswersCount(0)
    setTotalClicksCount(0)
    setLives(3)
    setMessage("")
    setSelectedOption(null)
    setIsAnswering(false)
    setCurrentWord(filteredWords.length > 0 ? selectNextWord(filteredWords, wordStatsMap) : null)
    setSessionCorrect(0)
    setSessionTotal(0)
    setSessionMistakes([])
    setScreen("game")
    playLessonStartSound()
  }, [wordStatsMap, userLevel, setCorrectAnswersCount, setTotalClicksCount])

  const setStatsForWord = useCallback((wordKey: string, isCorrect: boolean) => {
    setWordStatsMap((prev) => {
      const oldStats = prev.get(wordKey) || createEmptyWordStats(wordKey)
      const updatedStats = updateSpacedRepetition(oldStats, isCorrect)
      const nextStats = updateWordStats(updatedStats, isCorrect)
      nextStats.id = wordKey
      const newMap = new Map(prev)
      newMap.set(wordKey, nextStats)
      return newMap
    })
  }, [setWordStatsMap])

  const checkAnswerHandler = useCallback((userInput: string) => {
    if (isAnswering || !currentWord || lives <= 0) return
    initAudio()
    setIsAnswering(true)
    setSelectedOption(userInput)
    setTotalClicksCount((v) => v + 1)
    const isCorrect = checkAnswer(currentWord, userInput)
    const wordKey = getWordKey(currentWord)
    setStatsForWord(wordKey, isCorrect)
    setSessionTotal(prev => prev + 1)
    if (isCorrect) {
      playCorrectSound()
      const earnedXp = canEarnXpForWord(wordKey) ? (gameMode === "write" ? 15 : 10) : 0
      if (earnedXp > 0) setXp((v) => v + earnedXp)
      setCorrectAnswersCount((v) => v + 1)
      setSessionCorrect(prev => prev + 1)
      if (gameMode === "choice") setChoiceCorrectCount((v) => v + 1)
      if (gameMode === "write") setWriteCorrectCount((v) => v + 1)
      setMessage("Правильно!")
      if (!completedWords.has(wordKey)) {
        const nextCompleted = new Set(completedWords)
        nextCompleted.add(wordKey)
        setCompletedWords(nextCompleted)
        if (selectedCategory && selectedLevel) {
          const storageKey = `cat_progress_${selectedLevel}_${selectedCategory}`
          setProgressData((prev) => {
            const currentSaved = prev[storageKey] || 0
            if (nextCompleted.size <= currentSaved) return prev
            saveProgress(storageKey, nextCompleted.size)
            return { ...prev, [storageKey]: nextCompleted.size }
          })
        }
      }
    } else {
      playWrongSound()
      setLives((v) => v - 1)
      setMessage(`Ошибка! Правильно: ${currentWord.slovak}`)
      setSessionMistakes(prev => [...prev, { word: currentWord.slovak, translation: currentWord.russian }])
    }
    setIsAnswering(false)
    onAchievementCheck(skipCount, perfectLessonCount)
  }, [
    isAnswering, currentWord, lives, gameMode, completedWords,
    selectedCategory, selectedLevel, setProgressData, setStatsForWord,
    setXp, setCorrectAnswersCount, setChoiceCorrectCount, setWriteCorrectCount,
    setTotalClicksCount, onAchievementCheck, skipCount, perfectLessonCount
  ])

  const handleFlashcardRating = useCallback((known: boolean) => {
    if (isAnswering || !currentWord) return
    initAudio()
    setIsAnswering(true)
    setTotalClicksCount((v) => v + 1)
    const wordKey = getWordKey(currentWord)
    setStatsForWord(wordKey, known)
    let nextCompleted = completedWords
    setSessionTotal(prev => prev + 1)
    if (known && !completedWords.has(wordKey)) {
      nextCompleted = new Set(completedWords)
      nextCompleted.add(wordKey)
      setCompletedWords(nextCompleted)
      if (selectedCategory && selectedLevel) {
        const storageKey = `cat_progress_${selectedLevel}_${selectedCategory}`
        setProgressData((prev) => {
          const currentSaved = prev[storageKey] || 0
          if (nextCompleted.size <= currentSaved) return prev
          saveProgress(storageKey, nextCompleted.size)
          return { ...prev, [storageKey]: nextCompleted.size }
        })
      }
      setCorrectAnswersCount((v) => v + 1)
      setFlashcardCorrectCount((v) => v + 1)
      setSessionCorrect(prev => prev + 1)
      if (canEarnXpForWord(wordKey)) setXp((v) => v + 5)
      playCorrectSound()
    } else if (!known) {
      playWrongSound()
      setSessionMistakes(prev => [...prev, { word: currentWord.slovak, translation: currentWord.russian }])
    }
    const remainingWords = lessonWords.filter((w: Word) => !nextCompleted.has(getWordKey(w)))
    if (remainingWords.length === 0) {
      playVictorySound()
      const todayStr = getLocalDateString()
      const updatedDates = [...activeDates]
      if (!activeDates.includes(todayStr)) {
        updatedDates.push(todayStr)
        setActiveDates(updatedDates)
        localStorage.setItem("slovak_active_dates", JSON.stringify(updatedDates))
      }
      const categoryKey = `${selectedLevel}_${selectedCategory}_${currentDataSource}`
      if (canEarnLessonBonus(categoryKey)) setXp((v) => v + 50)
      if (selectedCategory && selectedLevel && currentDataSource) {
        const storageKey = `cat_progress_${selectedLevel}_${selectedCategory}`
        saveProgress(storageKey, totalLessonWords)
        setProgressData(prev => ({ ...prev, [storageKey]: totalLessonWords }))
      }
      if (sessionTotal === sessionCorrect && sessionTotal > 0) setPerfectLessonCount(prev => prev + 1)
      setScreen("victory")
      setIsAnswering(false)
      onAchievementCheck(skipCount, perfectLessonCount)
      return
    }
    setCurrentWord(selectNextWord(remainingWords, wordStatsMap))
    setIsAnswering(false)
    onAchievementCheck(skipCount, perfectLessonCount)
  }, [
    isAnswering, currentWord, completedWords, lessonWords,
    selectedCategory, selectedLevel, currentDataSource, totalLessonWords,
    sessionTotal, sessionCorrect, activeDates,
    setStatsForWord, setProgressData, setXp, setCorrectAnswersCount,
    setFlashcardCorrectCount, setTotalClicksCount, setActiveDates,
    setPerfectLessonCount, onAchievementCheck, wordStatsMap, skipCount, perfectLessonCount
  ])

  const handleNextWord = useCallback(() => {
    if (lives <= 0) return
    if (message !== "Правильно!") {
      setMessage("")
      setIsAnswering(false)
      setSelectedOption(null)
      return
    }
    if (remainingWordsCount === 0) {
      playVictorySound()
      const categoryKey = `${selectedLevel}_${selectedCategory}_${currentDataSource}`
      if (canEarnLessonBonus(categoryKey)) setXp((v) => v + 50)
      const todayStr = getLocalDateString()
      const nextDates = activeDates.includes(todayStr) ? activeDates : [...activeDates, todayStr]
      if (!activeDates.includes(todayStr)) {
        setActiveDates(nextDates)
        localStorage.setItem("slovak_active_dates", JSON.stringify(nextDates))
      }
      if (sessionTotal === sessionCorrect && sessionTotal > 0) setPerfectLessonCount(prev => prev + 1)
      setScreen("victory")
      onAchievementCheck(skipCount, perfectLessonCount)
      return
    }
    if (notCompletedWords.length === 0) {
      setScreen("victory")
      onAchievementCheck(skipCount, perfectLessonCount)
      return
    }
    setCurrentWord(selectNextWord(notCompletedWords, wordStatsMap))
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
  }, [
    message, lives, remainingWordsCount, activeDates, notCompletedWords,
    wordStatsMap, selectedLevel, selectedCategory, currentDataSource,
    sessionTotal, sessionCorrect, setXp, setActiveDates, setPerfectLessonCount,
    onAchievementCheck, skipCount, perfectLessonCount
  ])

  const handleSkip = useCallback(() => {
    if (!currentWord) return
    playClickSound()
    playSkipSound()
    setSkipCount(prev => prev + 1)
    const remaining = getRemainingWords()
    if (remaining.length < 2) return
    const currentKey = getWordKey(currentWord)
    const currentIndex = remaining.findIndex(w => getWordKey(w) === currentKey)
    let nextWord: Word
    if (currentIndex === -1) {
      nextWord = remaining[0]
    } else {
      const nextIndex = (currentIndex + 1) % remaining.length
      nextWord = remaining[nextIndex]
    }
    if (nextWord && getWordKey(nextWord) !== currentKey) setCurrentWord(nextWord)
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
    onAchievementCheck(skipCount + 1, perfectLessonCount)
  }, [currentWord, getRemainingWords, onAchievementCheck, skipCount, perfectLessonCount])

  const handleMarkHard = useCallback((word: Word) => {
    const wordKey = getWordKey(word)
    setHardWordsSet(prev => {
      const newSet = new Set(prev)
      newSet.add(wordKey)
      localStorage.setItem("slovak_hard_words", JSON.stringify(Array.from(newSet)))
      return newSet
    })
    setSessionMistakes(prev => [...prev, { word: word.slovak, translation: word.russian }])
    if (!currentWord) return
    playClickSound()
    playMarkHardSound()
    const remaining = getRemainingWords()
    if (remaining.length < 2) return
    const currentKey = getWordKey(currentWord)
    const currentIndex = remaining.findIndex(w => getWordKey(w) === currentKey)
    let nextWord: Word
    if (currentIndex === -1) {
      nextWord = remaining[0]
    } else {
      const nextIndex = (currentIndex + 1) % remaining.length
      nextWord = remaining[nextIndex]
    }
    if (nextWord && getWordKey(nextWord) !== currentKey) setCurrentWord(nextWord)
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
    onAchievementCheck(skipCount, perfectLessonCount)
  }, [currentWord, getRemainingWords, setHardWordsSet, onAchievementCheck, skipCount, perfectLessonCount])

  const handleRestart = useCallback(() => {
    playClickSound()
    if (selectedCategory && selectedLevel && currentDataSource) {
      handleSelectCategory(selectedCategory, selectedLevel, currentDataSource)
    } else {
      setScreen("menu")
    }
  }, [selectedCategory, selectedLevel, currentDataSource, handleSelectCategory])

  const handleBack = useCallback(() => {
    playClickSound()
    if (screen === "game") setIsExitConfirmOpen(true)
    else setScreen("menu")
  }, [screen])

  const confirmExit = useCallback(() => {
    setIsExitConfirmOpen(false)
    setScreen("menu")
  }, [])

  const handleRetryMistakes = useCallback(() => {
    if (sessionMistakes.length === 0) {
      setScreen("menu")
      return
    }
    const mistakeWords = sessionMistakes
      .map(m => lessonWords.find(w => w.slovak === m.word && w.russian === m.translation))
      .filter(Boolean) as Word[]
    if (mistakeWords.length) {
      setLessonWords(mistakeWords)
      setCompletedWords(new Set())
      setCorrectAnswersCount(0)
      setTotalClicksCount(0)
      setLives(3)
      setMessage("")
      setSelectedOption(null)
      setIsAnswering(false)
      setCurrentWord(selectNextWord(mistakeWords, wordStatsMap))
      setSessionCorrect(0)
      setSessionTotal(0)
      setSessionMistakes([])
      setScreen("game")
    } else {
      setScreen("menu")
    }
  }, [sessionMistakes, lessonWords, wordStatsMap, setCorrectAnswersCount, setTotalClicksCount])

  useEffect(() => {
    initAudio()
  }, [])

  useEffect(() => {
    if (screen === "game") {
      saveProgress("lives", lives)
    }
  }, [lives, screen])

  useEffect(() => {
    localStorage.setItem("slovak_skip_count", skipCount.toString())
  }, [skipCount])

  useEffect(() => {
    localStorage.setItem("slovak_perfect_lesson_count", perfectLessonCount.toString())
  }, [perfectLessonCount])

  const disabled = isAnswering || lives <= 0

  return {
    screen,
    setScreen,
    selectedCategory,
    selectedLevel,
    currentDataSource,
    gameMode,
    setGameMode,
    currentWord,
    lessonWords,
    completedWords,
    options,
    message,
    selectedOption,
    isAnswering,
    lives,
    disabled,
    lessonProgressPercent,
    remainingWordsCount,
    totalLessonWords,
    remainingCount,
    sessionCorrect,
    sessionTotal,
    sessionMistakes,
    isExitConfirmOpen,
    setIsExitConfirmOpen,
    skipCount,
    perfectLessonCount,
    handleSelectCategory,
    checkAnswerHandler,
    handleNextWord,
    handleSkip,
    handleMarkHard,
    handleFlashcardRating,
    handleRestart,
    handleBack,
    confirmExit,
    handleRetryMistakes,
    getWordKey,
  }
}