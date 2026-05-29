"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabase"
import { canAccessLevel, normalizeUserLevel, getNextLevel, type UserLevel } from "../lib/levels"
import { words, type Word, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { texts, type SlovakText } from "../data/texts"
import { checkAnswer, generateWrongOptions, selectNextWord, updateWordStats, type WordStats, createEmptyWordStats } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import {
  playCorrectSound, playWrongSound, playLessonStartSound, playVictorySound, playClickSound,
  initAudio, setMuted, playSkipSound, playMarkHardSound, setGlobalVolume
} from "../lib/sounds"
import { canEarnXpForWord, canEarnLessonBonus } from "../lib/xpLimits"
import { useAchievements } from "../hooks/useAchievements"
import type { AchievementState } from "../data/achievements"
import { useTextProgress } from "../hooks/useTextProgress"
import { useSettings } from "../hooks/useSettings"
import { useTheme } from "./../hooks/useTheme"
import GameUI from "./components/game/GameUI"
import StartMenu from "./components/game/StartMenu"
import VictoryScreen from "./components/game/VictoryScreen"
import ReferenceView from "./components/ReferenceView" // он на месте
import FlashcardMode from "./components/game/FlashcardMode"
import TextsMenu from "./components/texts/TextsMenu"
import TextViewer from "./components/texts/TextViewer"
import TextQuiz from "./components/texts/TextQuiz"
import AchievementNotification from "./components/achievements/AchievementNotification"
import SettingsModal from "./components/SettingsModal"
import LevelTest from "./components/test/LevelTest"
import FullTest from "./components/test/FullTest"
import ConfirmModal from "./components/shared/ConfirmModal"
import TestResultModal from "./components/test/TestResultModal"
import Sidebar from "./components/Sidebar"
import GameScreen from "./components/GameScreen"
import { SkeletonLevelCard } from "./components/shared/Skeleton"

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

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

const getWordKey = (word: Word): string => `${word.slovak}|${word.russian}`

const getInitialProgressData = (): Record<string, number> => {
  const initialProgress: Record<string, number> = {}
  const allPools = [...words, ...grammarTasks]
  allPools.forEach((w) => {
    if (w.level && w.category) {
      const storageKey = `cat_progress_${w.level}_${w.category}`
      if (initialProgress[storageKey] === undefined) {
        const savedCount = loadProgress<number>(storageKey)
        initialProgress[storageKey] = savedCount !== null ? savedCount : 0
      }
    }
  })
  return initialProgress
}

const getStoredActiveDates = (): string[] => {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("slovak_active_dates")
  return saved ? JSON.parse(saved) : []
}

const getStoredWordStatsMap = (): Map<string, WordStats> => {
  if (typeof window === "undefined") return new Map()
  const saved = localStorage.getItem("slovak_word_stats")
  if (!saved) return new Map()
  try {
    const parsed = JSON.parse(saved)
    const map = new Map<string, WordStats>()
    Object.entries(parsed).forEach(([key, val]) => {
      map.set(key, val as WordStats)
    })
    return map
  } catch {
    return new Map()
  }
}

const getStoredHardWords = (): Set<string> => {
  if (typeof window === "undefined") return new Set()
  const saved = localStorage.getItem("slovak_hard_words")
  return new Set(saved ? JSON.parse(saved) : [])
}

const getStoredChoiceCorrectCount = (): number => {
  if (typeof window === "undefined") return 0
  const saved = localStorage.getItem("choiceCorrectCount")
  return saved ? parseInt(saved, 10) : 0
}

const getStoredWriteCorrectCount = (): number => {
  if (typeof window === "undefined") return 0
  const saved = localStorage.getItem("writeCorrectCount")
  return saved ? parseInt(saved, 10) : 0
}

const getStoredFlashcardCorrectCount = (): number => {
  if (typeof window === "undefined") return 0
  const saved = localStorage.getItem("flashcardCorrectCount")
  return saved ? parseInt(saved, 10) : 0
}

function getUserDisplayName(user: User): string {
  return (
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "Пользователь"
  )
}

export default function Home() {
  const { settings, toggleMute, setSpeechRate, setAutoSpeak, setVolume } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const { lastUnlocked, checkAchievements, isLoaded: achievementsLoaded } = useAchievements()
  const { isRead, markAsRead, getQuizScore, markQuizCompleted, hasXpEarned, isQuizCompleted } = useTextProgress()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevel>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  const [globalTab, setGlobalTab] = useState<"study" | "texts" | "test" | "reference">("study")
  const [screen, setScreen] = useState<"menu" | "game" | "victory">("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null)
  const [currentDataSource, setCurrentDataSource] = useState<"vocab" | "grammar">("vocab")
  const [gameMode, setGameMode] = useState<"choice" | "write" | "flashcard">("choice")
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [lessonWords, setLessonWords] = useState<Word[]>([])
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [xp, setXp] = useState<number>(() => {
    const savedXp = loadProgress<number>("xp")
    return savedXp !== null ? savedXp : 0
  })
  const [activeDates, setActiveDates] = useState<string[]>(getStoredActiveDates())
  const [streak, setStreak] = useState<number>(() => calculateStreak(getStoredActiveDates()))
  const [maxStreak, setMaxStreak] = useState<number>(() => {
    const saved = loadProgress<number>("maxStreak")
    return saved !== null ? saved : 0
  })
  const [lives, setLives] = useState<number>(() => {
    const saved = loadProgress<number>("lives")
    return saved !== null ? saved : 3
  })
  const [message, setMessage] = useState<string>("")
  const [isAnswering, setIsAnswering] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0)
  const [totalClicksCount, setTotalClicksCount] = useState<number>(0)
  const [choiceCorrectCount, setChoiceCorrectCount] = useState<number>(getStoredChoiceCorrectCount)
  const [writeCorrectCount, setWriteCorrectCount] = useState<number>(getStoredWriteCorrectCount)
  const [flashcardCorrectCount, setFlashcardCorrectCount] = useState<number>(getStoredFlashcardCorrectCount)
  const [progressData, setProgressData] = useState<Record<string, number>>(() => getInitialProgressData())
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, WordStats>>(() => getStoredWordStatsMap())
  const mountedRef = useRef(false)
  const [selectedText, setSelectedText] = useState<SlovakText | null>(null)
  const [quizText, setQuizText] = useState<SlovakText | null>(null)
  const [testLevel, setTestLevel] = useState<LanguageLevel | null>(null)

  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [sessionMistakes, setSessionMistakes] = useState<{ word: string; translation: string }[]>([])
  const [hardWordsSet, setHardWordsSet] = useState<Set<string>>(getStoredHardWords)

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const [showTestResultModal, setShowTestResultModal] = useState(false)
  const [testResultData, setTestResultData] = useState<{ level: string; percent: number; xpEarned: number; isPassed: boolean } | null>(null)

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

  useEffect(() => {
    localStorage.setItem("choiceCorrectCount", choiceCorrectCount.toString())
  }, [choiceCorrectCount])

  useEffect(() => {
    localStorage.setItem("writeCorrectCount", writeCorrectCount.toString())
  }, [writeCorrectCount])

  useEffect(() => {
    localStorage.setItem("flashcardCorrectCount", flashcardCorrectCount.toString())
  }, [flashcardCorrectCount])

  useEffect(() => {
    localStorage.setItem("slovak_skip_count", skipCount.toString())
  }, [skipCount])

  useEffect(() => {
    localStorage.setItem("slovak_perfect_lesson_count", perfectLessonCount.toString())
  }, [perfectLessonCount])

  useEffect(() => {
    setGlobalVolume(settings.volume)
  }, [settings.volume])

  const forceSaveWordStats = useCallback(() => {
    if (typeof window === "undefined") return
    const obj: Record<string, WordStats> = {}
    wordStatsMap.forEach((value, key) => {
      obj[key] = value
    })
    localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
  }, [wordStatsMap])

  const handleLogout = async () => {
    forceSaveWordStats()
    const { error } = await supabase.auth.signOut()
    if (error) console.error("Ошибка выхода:", error)
    setUser(null)
    setUserLevel(null)
    if (window.location.pathname !== "/") {
      router.push("/")
    }
  }

  useEffect(() => {
    let isMounted = true
    async function loadCurrentUser() {
      setIsLoadingUser(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (isMounted) {
          setUser(null)
          setUserLevel(null)
          setIsLoadingUser(false)
        }
        return
      }
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      if (!isMounted) return
      if (error) {
        console.error("Ошибка загрузки пользователя:", error)
        setUser(null)
        setUserLevel(null)
      } else {
        setUser(currentUser)
        if (!currentUser) setUserLevel(null)
      }
      setIsLoadingUser(false)
    }
    loadCurrentUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      setUser(session?.user ?? null)
      if (!session?.user) setUserLevel(null)
    })
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) return
    let isMounted = true
    const fetchUserLevel = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("level")
          .eq("id", user.id)
          .maybeSingle()
        if (error) throw error
        if (!isMounted) return
        setUserLevel(normalizeUserLevel(data?.level))
      } catch (error) {
        console.error("Ошибка загрузки уровня пользователя:", error)
        if (!isMounted) return
        setUserLevel(null)
      }
    }
    fetchUserLevel()
    return () => { isMounted = false }
  }, [user])

  useEffect(() => {
    setMuted(settings.isMuted)
  }, [settings.isMuted])

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("xp", xp.toString())
  }, [xp])

  const totalLessonWords = lessonWords.length
  const completedCount = completedWords.size
  const remainingWordsCount = totalLessonWords - completedCount
  const lessonProgressPercent = totalLessonWords ? (completedCount / totalLessonWords) * 100 : 0

  const learnedWordsCount = useMemo(
    () => Array.from(wordStatsMap.values()).filter(stat => stat.correctCount > 0).length,
    [wordStatsMap]
  )
  const completedCategoriesCount = useMemo(
    () => Object.values(progressData).filter(passed => passed > 0).length,
    [progressData]
  )

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

  useEffect(() => {
    initAudio()
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return
    saveProgress("lives", lives)
  }, [lives])

  useEffect(() => {
    if (!mountedRef.current || streak <= maxStreak) return
    setMaxStreak(streak)
    saveProgress("maxStreak", streak)
  }, [streak, maxStreak])

  useEffect(() => {
    mountedRef.current = true
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => forceSaveWordStats()
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [forceSaveWordStats])

  const updateCategoryProgress = useCallback((completedCount: number) => {
    if (!selectedCategory || !selectedLevel) return
    const storageKey = `cat_progress_${selectedLevel}_${selectedCategory}`
    setProgressData((prev) => {
      const currentSaved = prev[storageKey] || 0
      if (completedCount <= currentSaved) return prev
      saveProgress(storageKey, completedCount)
      return { ...prev, [storageKey]: completedCount }
    })
  }, [selectedCategory, selectedLevel])

  const setStatsForWord = useCallback((wordKey: string, isCorrect: boolean) => {
    setWordStatsMap((prev) => {
      const oldStats = prev.get(wordKey) || createEmptyWordStats(wordKey)
      const nextStats = updateWordStats(oldStats, isCorrect)
      nextStats.id = wordKey
      const newMap = new Map(prev)
      newMap.set(wordKey, nextStats)
      const obj: Record<string, WordStats> = {}
      newMap.forEach((value, key) => {
        obj[key] = value
      })
      localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
      return newMap
    })
  }, [])

  const getRemainingWords = useCallback(() => {
    return lessonWords.filter(w => !completedWords.has(getWordKey(w)))
  }, [lessonWords, completedWords])

  const handleSelectCategory = useCallback((category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => {
    if (!canAccessLevel(userLevel, level)) {
      toast.error(`Уровень ${level} пока закрыт. Твой текущий уровень: ${userLevel || "не задан"}`)
      return
    }
    const poolSource = dataSource === "vocab" ? words : grammarTasks
    const filteredWords = poolSource.filter((w: Word) => w.category === category && w.level === level)
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
  }, [wordStatsMap, userLevel])

  const triggerAchievementCheck = useCallback(() => {
    const quizCount = Object.values(isQuizCompleted).filter(Boolean).length
    const textsRead = Object.values(isRead).filter(Boolean).length
    const hardCount = hardWordsSet.size

    const state: AchievementState = {
      totalXp: xp,
      totalCorrect: correctAnswersCount,
      totalWrong: totalClicksCount - correctAnswersCount,
      streak,
      maxStreak,
      completedCategories: completedCategoriesCount,
      learnedWords: learnedWordsCount,
      flashcardAnswers: flashcardCorrectCount,
      writeAnswers: writeCorrectCount,
      choiceAnswers: choiceCorrectCount,
      quizCompletedCount: quizCount,
      hardWordsMarked: hardCount,
      skipCount: skipCount,
      perfectLessonCount: perfectLessonCount,
      textsReadCount: textsRead,
    }
    const newAchievements = checkAchievements(state)
    if (newAchievements.length > 0) {
      const reward = newAchievements.reduce((sum: number, ach: { reward?: number }) => sum + (ach.reward || 0), 0)
      if (reward > 0) setXp((v) => v + reward)
    }
  }, [
    xp, correctAnswersCount, totalClicksCount, streak, maxStreak,
    completedCategoriesCount, learnedWordsCount, flashcardCorrectCount,
    writeCorrectCount, choiceCorrectCount, isQuizCompleted, isRead,
    hardWordsSet, skipCount, perfectLessonCount, checkAchievements
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
    triggerAchievementCheck()
  }, [currentWord, getRemainingWords, triggerAchievementCheck])

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
    triggerAchievementCheck()
  }, [currentWord, getRemainingWords, triggerAchievementCheck])

  useEffect(() => {
    if (!mountedRef.current || !achievementsLoaded) return
    triggerAchievementCheck()
  }, [triggerAchievementCheck, achievementsLoaded])

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
        updateCategoryProgress(nextCompleted.size)
      }
    } else {
      playWrongSound()
      setLives((v) => v - 1)
      setMessage(`Ошибка! Правильно: ${currentWord.slovak}`)
      setSessionMistakes(prev => [...prev, { word: currentWord.slovak, translation: currentWord.russian }])
    }
    setIsAnswering(false)
    triggerAchievementCheck()
  }, [
    isAnswering, currentWord, lives, gameMode, completedWords,
    updateCategoryProgress, setStatsForWord, triggerAchievementCheck
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
      updateCategoryProgress(nextCompleted.size)
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
      setStreak(calculateStreak(updatedDates))
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
      triggerAchievementCheck()
      return
    }
    setCurrentWord(selectNextWord(remainingWords, wordStatsMap))
    setIsAnswering(false)
    triggerAchievementCheck()
  }, [
    isAnswering, currentWord, completedWords, lessonWords, updateCategoryProgress,
    setStatsForWord, wordStatsMap, activeDates, selectedLevel, selectedCategory,
    currentDataSource, totalLessonWords, sessionTotal, sessionCorrect, triggerAchievementCheck
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
      setStreak(calculateStreak(nextDates))
      if (sessionTotal === sessionCorrect && sessionTotal > 0) setPerfectLessonCount(prev => prev + 1)
      setScreen("victory")
      triggerAchievementCheck()
      return
    }
    if (notCompletedWords.length === 0) {
      setScreen("victory")
      triggerAchievementCheck()
      return
    }
    setCurrentWord(selectNextWord(notCompletedWords, wordStatsMap))
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
  }, [
    message, lives, remainingWordsCount, activeDates, notCompletedWords,
    wordStatsMap, selectedLevel, selectedCategory, currentDataSource,
    sessionTotal, sessionCorrect, triggerAchievementCheck
  ])

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

  const handleStartQuiz = (text: SlovakText) => {
    markAsRead(text.id)
    setQuizText(text)
  }

  const handleQuizComplete = (textId: string, score: number, total: number, xpEarned: number, firstTime: boolean) => {
    markQuizCompleted(textId, score, true)
    if (firstTime) setXp(prev => prev + xpEarned)
    triggerAchievementCheck()
  }

  const handleStartTest = (level: LanguageLevel) => {
    setTestLevel(level)
    setShowTestResultModal(false)
    setTestResultData(null)
  }

  const handleTestComplete = async (score: number, total: number, xpEarned: number) => {
    setXp(prev => prev + xpEarned)
    const percent = Math.round((score / total) * 100)
    const saved = localStorage.getItem("test_completed_levels")
    const completed = saved ? JSON.parse(saved) : {}
    const bestPercent = Math.max(completed[testLevel!] || 0, percent)
    const newProgress = { ...completed, [testLevel!]: bestPercent }
    localStorage.setItem("test_completed_levels", JSON.stringify(newProgress))

    const isPassed = bestPercent >= 90
    const wasAlreadyPassed = (completed[testLevel!] || 0) >= 90

    setTestResultData({
      level: testLevel!,
      percent: bestPercent,
      xpEarned,
      isPassed,
    })
    setShowTestResultModal(true)

    const expectedLevel = userLevel === null ? "A1" : getNextLevel(userLevel)
    if (testLevel === expectedLevel && user && isPassed && !wasAlreadyPassed) {
      const nextLevel = getNextLevel(userLevel)
      if (nextLevel) {
        try {
          const { error } = await supabase
            .from("profiles")
            .update({ level: nextLevel })
            .eq("id", user.id)
          if (error) throw error
          setUserLevel(nextLevel)
          toast.success(`🎉 Поздравляем! Ваш уровень повышен до ${nextLevel}!`)
        } catch (error) {
          console.error("Ошибка повышения уровня:", error)
          toast.error("Не удалось повысить уровень.")
        }
      }
    }
    setTestLevel(null)
    triggerAchievementCheck()
  }

  const handleBackToLevels = () => {
    setTestLevel(null)
    setShowTestResultModal(false)
    setTestResultData(null)
  }

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
  }, [sessionMistakes, lessonWords, wordStatsMap])

  const remainingCount = getRemainingWords().length

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl z-30 flex flex-col border-r border-gray-200/50 dark:border-gray-700/50">
          <div className="px-5 pt-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
          </div>
          <div className="flex-1 p-4 space-y-1.5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse" />)}
          </div>
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="h-10 bg-gray-200 dark:bg-gray-700/50 rounded-xl animate-pulse" />
          </div>
        </aside>
        <main className="ml-64 min-h-screen p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-32 bg-gray-200 dark:bg-gray-700/50 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700/50 rounded-2xl animate-pulse" />)}
            </div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700/50 rounded-2xl animate-pulse w-64 mx-auto" />
            <div className="space-y-8">
              {[...Array(5)].map((_, i) => <SkeletonLevelCard key={i} />)}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (screen === "game") {
    return (
      <GameScreen
        gameMode={gameMode}
        currentWord={currentWord}
        options={options}
        message={message}
        selectedOption={selectedOption}
        isAnswering={isAnswering}
        lives={lives}
        disabled={isAnswering || lives <= 0}
        lessonProgress={lessonProgressPercent}
        wordsLeft={remainingWordsCount}
        totalWords={totalLessonWords}
        remainingCount={remainingCount}
        xp={xp}
        streak={streak}
        sessionCorrect={sessionCorrect}
        sessionTotal={sessionTotal}
        speechRate={settings.speechRate}
        autoSpeakOnCorrect={settings.autoSpeakOnCorrect}
        onFlashcardNext={handleFlashcardRating}
        onAnswer={checkAnswerHandler}
        onNext={handleNextWord}
        onRestart={handleRestart}
        onBack={handleBack}
        onSkip={handleSkip}
        onMarkHard={handleMarkHard}
        isExitConfirmOpen={isExitConfirmOpen}
        onCloseExitConfirm={() => setIsExitConfirmOpen(false)}
        onConfirmExit={confirmExit}
        getWordKey={getWordKey}
      />
    )
  }

  if (screen === "victory") {
    const accuracy = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0
    const xpEarned = 50
    return (
      <VictoryScreen
        category={selectedCategory || ""}
        xpEarned={xpEarned}
        accuracy={accuracy}
        onBack={() => setScreen("menu")}
        mistakes={sessionMistakes}
        onRetryMistakes={handleRetryMistakes}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        user={user}
        globalTab={globalTab}
        onTabChange={setGlobalTab}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
        getUserDisplayName={getUserDisplayName}
        onLoginClick={() => router.push("/login")}
        onRegisterClick={() => router.push("/register")}
      />

      <main className="ml-64 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {globalTab === "study" && (
            <StartMenu
              onSelectCategory={handleSelectCategory}
              userLevel={userLevel}
              xp={xp}
              progressData={progressData}
              streak={streak}
              activeDates={activeDates}
              gameMode={gameMode}
              setGameMode={setGameMode}
              correctAnswersCount={correctAnswersCount}
              totalClicksCount={totalClicksCount}
              learnedWordsCount={learnedWordsCount}
              completedCategoriesCount={completedCategoriesCount}
              wordStatsMap={wordStatsMap}
            />
          )}
          {globalTab === "reference" && (
            <ReferenceView
              progressData={progressData}
              activeDates={activeDates}
              wordStatsMap={wordStatsMap}
            />
          )}
          {globalTab === "texts" && (
            quizText ? (
              <TextQuiz
                text={quizText}
                onComplete={(score, total, xpEarned, firstTime) => handleQuizComplete(quizText.id, score, total, xpEarned, firstTime)}
                onBack={() => setQuizText(null)}
                existingScore={getQuizScore(quizText.id)}
                xpAlreadyEarned={hasXpEarned(quizText.id)}
              />
            ) : selectedText ? (
              <TextViewer
                text={selectedText}
                onBack={() => setSelectedText(null)}
                onQuiz={() => handleStartQuiz(selectedText)}
                isRead={isRead(selectedText.id)}
              />
            ) : (
              <TextsMenu
                onSelectText={setSelectedText}
                readStatus={Object.fromEntries(texts.map((t: SlovakText) => [t.id, isRead(t.id)]))}
                quizStatus={Object.fromEntries(texts.map((t: SlovakText) => [t.id, isQuizCompleted(t.id)]))}
                userLevel={userLevel}
              />
            )
          )}
          {globalTab === "test" && (
            testLevel ? (
              <>
                <FullTest
                  level={testLevel}
                  onComplete={handleTestComplete}
                  onBack={handleBackToLevels}
                />
                {showTestResultModal && testResultData && (
                  <TestResultModal
                    isOpen={showTestResultModal}
                    onClose={() => {
                      setShowTestResultModal(false)
                      handleBackToLevels()
                    }}
                    onContinue={() => {
                      setShowTestResultModal(false)
                      handleBackToLevels()
                    }}
                    level={testResultData.level}
                    percent={testResultData.percent}
                    xpEarned={testResultData.xpEarned}
                    isPassed={testResultData.isPassed}
                  />
                )}
              </>
            ) : (
              <LevelTest onStartTest={handleStartTest} />
            )
          )}
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onToggleMute={toggleMute}
        onSetSpeechRate={setSpeechRate}
        onSetAutoSpeak={setAutoSpeak}
        onSetVolume={setVolume}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <AchievementNotification achievement={lastUnlocked} onHide={() => {}} />
    </div>
  )
}