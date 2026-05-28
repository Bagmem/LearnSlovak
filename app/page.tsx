"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { FaBullseye, FaBookOpen, FaScroll, FaUserCircle, FaSignOutAlt, FaCog, FaClipboardList } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth, db } from "../lib/firebase"
import { signOut, onAuthStateChanged, type User } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { canAccessLevel, normalizeUserLevel, getNextLevel, type UserLevel } from "../lib/levels"
import { words, type Word, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { texts, type SlovakText } from "../data/texts"
import { checkAnswer, generateWrongOptions, selectNextWord, updateWordStats, type WordStats, createEmptyWordStats } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import { playCorrectSound, playWrongSound, playLessonStartSound, playVictorySound, playClickSound, initAudio, setMuted } from "../lib/sounds"
import { canEarnXpForWord, canEarnLessonBonus } from "../lib/xpLimits"
import { useAchievements } from "../hooks/useAchievements"
import type { AchievementState } from "../data/achievements"
import { useTextProgress } from "../hooks/useTextProgress"
import { useSettings } from "../hooks/useSettings"
import { useTheme } from "../hooks/useTheme"
import GameUI from "./components/GameUI"
import StartMenu from "./components/StartMenu"
import VictoryScreen from "./components/VictoryScreen"
import ReferenceView from "./components/ReferenceView"
import FlashcardMode from "./components/FlashcardMode"
import TextsMenu from "./components/TextsMenu"
import TextViewer from "./components/TextViewer"
import TextQuiz from "./components/TextQuiz"
import AchievementNotification from "./components/AchievementNotification"
import SettingsModal from "./components/SettingsModal"
import LevelTest from "./components/LevelTest"
import FullTest from "./components/FullTest"

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

export default function Home() {
  const { settings, toggleMute, setSpeechRate, setAutoSpeak, setVolume } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const { lastUnlocked, checkAchievements, isLoaded: achievementsLoaded } = useAchievements()
  const { isRead, markAsRead, getQuizScore, markQuizCompleted, hasXpEarned, isQuizCompleted } = useTextProgress()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevel>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // ---------- Все useState ----------
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
  const [choiceCorrectCount, setChoiceCorrectCount] = useState<number>(0)
  const [writeCorrectCount, setWriteCorrectCount] = useState<number>(0)
  const [flashcardCorrectCount, setFlashcardCorrectCount] = useState<number>(0)
  const [progressData, setProgressData] = useState<Record<string, number>>(() => getInitialProgressData())
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, WordStats>>(() => getStoredWordStatsMap())
  const mountedRef = useRef(false)
  const [selectedText, setSelectedText] = useState<SlovakText | null>(null)
  const [quizText, setQuizText] = useState<SlovakText | null>(null)
  const [testLevel, setTestLevel] = useState<LanguageLevel | null>(null)

  // Сессионные статистики и сложные слова
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [sessionMistakes, setSessionMistakes] = useState<{ word: string; translation: string }[]>([])
  const [hardWordsSet, setHardWordsSet] = useState<Set<string>>(getStoredHardWords)
  const [writeInput, setWriteInput] = useState("")

  // ---------------------------------------------------------------------------

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
    await signOut(auth)
    router.push("/")
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setUserLevel(null)
      return
    }
    const fetchUserLevel = async () => {
      try {
        const profileRef = doc(db, "users", user.uid)
        const profileSnap = await getDoc(profileRef)
        if (profileSnap.exists()) {
          const data = profileSnap.data()
          setUserLevel(normalizeUserLevel(data.level))
        } else {
          setUserLevel(null)
        }
      } catch (error) {
        console.error("Ошибка загрузки уровня пользователя:", error)
        setUserLevel(null)
      }
    }
    fetchUserLevel()
  }, [user])

  useEffect(() => {
    setMuted(settings.isMuted)
  }, [settings.isMuted])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("xp", xp.toString())
    }
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

  // Вспомогательная функция для получения списка ещё не выученных слов
  const getRemainingWords = useCallback(() => {
    return lessonWords.filter(w => !completedWords.has(getWordKey(w)))
  }, [lessonWords, completedWords])

  // ---------- ПРОПУСК (просто переключаемся на следующее слово по кругу) ----------
  const handleSkip = useCallback(() => {
    if (!currentWord) return
    playClickSound()

    const remaining = getRemainingWords()
    if (remaining.length < 2) return  // некуда пропускать

    const currentKey = getWordKey(currentWord)
    const currentIndex = remaining.findIndex(w => getWordKey(w) === currentKey)
    let nextWord: Word
    if (currentIndex === -1) {
      // текущее слово уже выучено – просто берём первое
      nextWord = remaining[0]
    } else {
      const nextIndex = (currentIndex + 1) % remaining.length
      nextWord = remaining[nextIndex]
    }

    if (nextWord && getWordKey(nextWord) !== currentKey) {
      setCurrentWord(nextWord)
    }

    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
    setWriteInput("")
  }, [currentWord, getRemainingWords])

  // ---------- ОТМЕТКА СЛОЖНОГО СЛОВА (глобально + в ошибки + переключение) ----------
  const handleMarkHard = useCallback((word: Word) => {
    const wordKey = getWordKey(word)

    // Глобальный список сложных слов
    setHardWordsSet(prev => {
      const newSet = new Set(prev)
      newSet.add(wordKey)
      localStorage.setItem("slovak_hard_words", JSON.stringify(Array.from(newSet)))
      return newSet
    })

    // Добавляем в ошибки сессии (покажется в VictoryScreen)
    setSessionMistakes(prev => [...prev, { word: word.slovak, translation: word.russian }])

    // Пропускаем текущее слово (та же логика, что в handleSkip)
    if (!currentWord) return
    playClickSound()

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

    if (nextWord && getWordKey(nextWord) !== currentKey) {
      setCurrentWord(nextWord)
    }

    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
    setWriteInput("")
  }, [currentWord, getRemainingWords])

  const handleSelectCategory = useCallback((category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => {
    if (!canAccessLevel(userLevel, level)) {
      setMessage(`Уровень ${level} пока закрыт. Твой текущий уровень: ${userLevel || "не задан"}`)
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
    setWriteInput("")
    setScreen("game")
    playLessonStartSound()
  }, [wordStatsMap, userLevel])

  const triggerAchievementCheck = useCallback(() => {
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
    }
    const newAchievements = checkAchievements(state)
    if (newAchievements.length > 0) {
      const reward = newAchievements.reduce((sum: number, ach: { reward?: number }) => sum + (ach.reward || 0), 0)
      if (reward > 0) setXp((v) => v + reward)
    }
  }, [xp, correctAnswersCount, totalClicksCount, streak, maxStreak, completedCategoriesCount, learnedWordsCount, flashcardCorrectCount, writeCorrectCount, choiceCorrectCount, checkAchievements])

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
  }, [isAnswering, currentWord, lives, gameMode, completedWords, updateCategoryProgress, setStatsForWord])

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
      setScreen("victory")
      setIsAnswering(false)
      return
    }
    setCurrentWord(selectNextWord(remainingWords, wordStatsMap))
    setIsAnswering(false)
  }, [isAnswering, currentWord, completedWords, lessonWords, updateCategoryProgress, setStatsForWord, wordStatsMap, activeDates, selectedLevel, selectedCategory, currentDataSource, totalLessonWords])

  const handleNextWord = useCallback(() => {
    if (lives <= 0) return
    if (message !== "Правильно!") {
      setMessage("")
      setIsAnswering(false)
      setSelectedOption(null)
      setWriteInput("")
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
      setScreen("victory")
      return
    }
    if (notCompletedWords.length === 0) {
      setScreen("victory")
      return
    }
    setCurrentWord(selectNextWord(notCompletedWords, wordStatsMap))
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
    setWriteInput("")
  }, [message, lives, remainingWordsCount, activeDates, notCompletedWords, wordStatsMap, selectedLevel, selectedCategory, currentDataSource])

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
    if (screen === "game") {
      if (confirm("Вы уверены, что хотите выйти? Прогресс текущего урока будет потерян.")) {
        setScreen("menu")
      }
    } else {
      setScreen("menu")
    }
  }, [screen])

  const handleStartQuiz = (text: SlovakText) => {
    markAsRead(text.id)
    setQuizText(text)
  }

  const handleQuizComplete = (textId: string, score: number, total: number, xpEarned: number, firstTime: boolean) => {
    if (firstTime) {
      markQuizCompleted(textId, score, true)
      setXp(prev => prev + xpEarned)
    }
  }

  const handleStartTest = (level: LanguageLevel) => {
    setTestLevel(level)
  }

  const handleTestComplete = async (score: number, total: number, xpEarned: number) => {
    setXp(prev => prev + xpEarned)
    const saved = localStorage.getItem("test_completed_levels")
    const completed = saved ? JSON.parse(saved) : {}
    if (testLevel) {
      if (score === total) {
        completed[testLevel] = true
        localStorage.setItem("test_completed_levels", JSON.stringify(completed))
        const expectedLevel = userLevel === null ? "A1" : getNextLevel(userLevel)
        if (testLevel === expectedLevel && user) {
          const nextLevel = getNextLevel(userLevel)
          if (nextLevel) {
            try {
              const userRef = doc(db, "users", user.uid)
              await updateDoc(userRef, { level: nextLevel })
              setUserLevel(nextLevel)
              alert(`🎉 Поздравляем! Ваш уровень повышен до ${nextLevel}!`)
            } catch (error) {
              console.error("Ошибка повышения уровня:", error)
            }
          }
        }
      }
    }
    setTestLevel(null)
  }

  const handleBackToLevels = () => {
    setTestLevel(null)
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
      setWriteInput("")
      setScreen("game")
    } else {
      setScreen("menu")
    }
  }, [sessionMistakes, lessonWords, wordStatsMap])

  // Количество реально невыученных слов для передачи в UI
  const remainingCount = getRemainingWords().length

  // ---------------------------------------------------------------------------
  // Рендер
  // ---------------------------------------------------------------------------
  if (screen === "game") {
    if (gameMode === "flashcard") {
      return (
        <FlashcardMode
          key={currentWord ? getWordKey(currentWord) : undefined}
          word={currentWord}
          onNext={handleFlashcardRating}
          onBack={handleBack}
          onRestart={handleRestart}
          lessonProgress={lessonProgressPercent}
          wordsLeft={remainingWordsCount}
          totalWords={totalLessonWords}
          remainingCount={remainingCount}
          onSkip={handleSkip}
          onMarkHard={handleMarkHard}
          sessionCorrect={sessionCorrect}
          sessionTotal={sessionTotal}
        />
      )
    }
    return (
      <GameUI
        xp={xp}
        streak={streak}
        lives={lives}
        word={currentWord}
        options={options}
        message={message}
        selectedOption={selectedOption}
        onAnswer={checkAnswerHandler}
        onNext={handleNextWord}
        onRestart={handleRestart}
        onBack={handleBack}
        onSkip={handleSkip}
        onMarkHard={handleMarkHard}
        disabled={isAnswering || lives <= 0}
        lessonProgress={lessonProgressPercent}
        gameMode={gameMode}
        wordsLeft={remainingWordsCount}
        totalWords={totalLessonWords}
        remainingCount={remainingCount}
        speechRate={settings.speechRate}
        autoSpeakOnCorrect={settings.autoSpeakOnCorrect}
        sessionCorrect={sessionCorrect}
        sessionTotal={sessionTotal}
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
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl z-30 flex flex-col border-r border-gray-200/50 dark:border-gray-700/50">
        <div className="px-5 pt-6 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            LearnSlovak
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {([
            { id: "study", label: "Изучение", icon: <FaBullseye size={20} />, active: globalTab === "study" },
            { id: "texts", label: "Тексты", icon: <FaScroll size={20} />, active: globalTab === "texts" },
            { id: "test", label: "Тест", icon: <FaClipboardList size={20} />, active: globalTab === "test" },
            { id: "reference", label: "Справочник", icon: <FaBookOpen size={20} />, active: globalTab === "reference" },
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => setGlobalTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                item.active
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <span className={`${item.active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors"}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm">{item.label}</span>
              {item.active && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
          {user ? (
            <>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
              >
                <FaCog size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-bold text-sm">Настройки</span>
              </button>
              <Link
                href="/profile"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
              >
                <FaUserCircle size={20} className="group-hover:scale-105 transition-transform" />
                <span className="font-bold text-sm">Мой профиль</span>
              </Link>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                    <FaUserCircle size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"
                  title="Выйти"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2.5 text-center text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition"
              >
                Войти
              </button>
              <button
                onClick={() => router.push("/register")}
                className="w-full py-2.5 text-center text-sm font-bold border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-800 dark:text-gray-200"
              >
                Регистрация
              </button>
            </div>
          )}
        </div>
      </aside>

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
              <FullTest
                level={testLevel}
                onComplete={handleTestComplete}
                onBack={handleBackToLevels}
              />
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