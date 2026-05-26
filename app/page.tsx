"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { FaBullseye, FaBookOpen, FaScroll, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth, db } from "../lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { canAccessLevel, normalizeUserLevel } from "../lib/levels"
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
import { useSettings } from "../hooks/useSettings"
import { useTheme } from "../hooks/useTheme"

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

  const startDateStr = uniqueDates.has(todayStr)
    ? todayStr
    : uniqueDates.has(yesterdayStr)
      ? yesterdayStr
      : ""

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

export default function Home() {
  const { settings, toggleMute, setSpeechRate, setAutoSpeak, setVolume } = useSettings()
  const { theme, toggleTheme } = useTheme()
  const { unlocked, lastUnlocked, checkAchievements, isLoaded: achievementsLoaded } = useAchievements()
  const { isRead, markAsRead, isQuizCompleted, getQuizScore, markQuizCompleted, hasXpEarned } = useTextProgress()
const router = useRouter()
const [user, setUser] = useState<any>(null)
const [userLevel, setUserLevel] = useState<LanguageLevel>("A1")
const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser)

    if (!currentUser) {
      setUserLevel("A1")
      return
    }

    try {
      const profileRef = doc(db, "users", currentUser.uid)
      const profileSnap = await getDoc(profileRef)

      if (profileSnap.exists()) {
        const data = profileSnap.data()
        setUserLevel(normalizeUserLevel(data.level))
      } else {
        setUserLevel("A1")
      }
    } catch (error) {
      console.error("Ошибка загрузки уровня пользователя:", error)
      setUserLevel("A1")
    }
  })

  return () => unsubscribe()
}, [])

  // ---------- Все useState (объявлены до всех useCallback/useEffect) ----------
  const [globalTab, setGlobalTab] = useState<"study" | "reference" | "texts">("study")
  const [screen, setScreen] = useState<"menu" | "game" | "victory">("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null)
  const [currentDataSource, setCurrentDataSource] = useState<"vocab" | "grammar">("vocab")
  const [gameMode, setGameMode] = useState<"choice" | "write" | "flashcard">("choice")
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [lessonWords, setLessonWords] = useState<Word[]>([])
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [xp, setXp] = useState<number>(0)
  const [streak, setStreak] = useState<number>(0)
  const [maxStreak, setMaxStreak] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const [message, setMessage] = useState<string>("")
  const [isAnswering, setIsAnswering] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0)
  const [totalClicksCount, setTotalClicksCount] = useState<number>(0)
  const [choiceCorrectCount, setChoiceCorrectCount] = useState<number>(0)
  const [writeCorrectCount, setWriteCorrectCount] = useState<number>(0)
  const [flashcardCorrectCount, setFlashcardCorrectCount] = useState<number>(0)
  const [progressData, setProgressData] = useState<Record<string, number>>({})
  const [activeDates, setActiveDates] = useState<string[]>([])
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, WordStats>>(new Map())
  const mountedRef = useRef(false)
  const [selectedText, setSelectedText] = useState<SlovakText | null>(null)
  const [quizText, setQuizText] = useState<SlovakText | null>(null)
  // ---------------------------------------------------------------------------

  // Принудительное сохранение (для выхода)
  const forceSaveWordStats = () => {
    if (typeof window === "undefined") return
    const obj: Record<string, WordStats> = {}
    wordStatsMap.forEach((value, key) => {
      obj[key] = value
    })
    localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
    console.log("forceSaveWordStats: сохранено", Object.keys(obj).length)
  }

  const handleLogout = async () => {
    forceSaveWordStats()
    await new Promise(resolve => setTimeout(resolve, 100)) // даём время на запись
    await signOut(auth)
    router.push("/")
  }

  useEffect(() => {
    setMuted(settings.isMuted)
  }, [settings.isMuted])

  // Сохранение XP
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
      (w) => w.category === selectedCategory && w.level === selectedLevel
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

  // Загрузка всех данных из localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    const savedXp = loadProgress<number>("xp")
    if (savedXp !== null) setXp(savedXp)
    const savedLives = loadProgress<number>("lives")
    if (savedLives !== null) setLives(savedLives)
    const savedMaxStreak = loadProgress<number>("maxStreak")
    if (savedMaxStreak !== null) setMaxStreak(savedMaxStreak)
    const savedDatesStr = localStorage.getItem("slovak_active_dates")
    const dates: string[] = savedDatesStr ? JSON.parse(savedDatesStr) : []
    setActiveDates(dates)
    setStreak(calculateStreak(dates))
    setProgressData(getInitialProgressData())
    
    // Загрузка статистики слов
    const savedStats = localStorage.getItem("slovak_word_stats")
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats)
        const map = new Map<string, WordStats>()
        Object.entries(parsed).forEach(([key, val]: [string, any]) => {
          map.set(key, val as WordStats)
        })
        setWordStatsMap(map)
        console.log("Загружено статистики слов:", map.size)
      } catch (e) {}
    }
    mountedRef.current = true
  }, [])

  // Сохранение при закрытии страницы
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

  // ОСНОВНОЕ ИСПРАВЛЕНИЕ: сохраняем статистику СРАЗУ при изменении
  const setStatsForWord = useCallback((wordKey: string, isCorrect: boolean) => {
    setWordStatsMap((prev) => {
      const oldStats = prev.get(wordKey) || createEmptyWordStats(wordKey)
      const nextStats = updateWordStats(oldStats, isCorrect)
      nextStats.id = wordKey
      const newMap = new Map(prev)
      newMap.set(wordKey, nextStats)
      
      // Синхронное сохранение в localStorage
      const obj: Record<string, WordStats> = {}
      newMap.forEach((value, key) => {
        obj[key] = value
      })
      localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
      
      return newMap
    })
  }, [])

 const handleSelectCategory = useCallback((category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => {
  if (!canAccessLevel(userLevel, level)) {
    setMessage(`Уровень ${level} пока закрыт. Твой текущий уровень: ${userLevel}`)
    return
  }

  const poolSource = dataSource === "vocab" ? words : grammarTasks
  const filteredWords = poolSource.filter((w) => w.category === category && w.level === level)

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
      const reward = newAchievements.reduce((sum, ach) => sum + (ach.reward || 0), 0)
      if (reward > 0) setXp((v) => v + reward)
    }
  }, [xp, correctAnswersCount, totalClicksCount, streak, maxStreak, completedCategoriesCount, learnedWordsCount, flashcardCorrectCount, writeCorrectCount, choiceCorrectCount, checkAchievements])

  useEffect(() => {
    if (!mountedRef.current) return
    if (!achievementsLoaded) return
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
    if (isCorrect) {
      playCorrectSound()
      const earnedXp = canEarnXpForWord(wordKey) ? (gameMode === "write" ? 15 : 10) : 0
      if (earnedXp > 0) setXp((v) => v + earnedXp)
      setCorrectAnswersCount((v) => v + 1)
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
    if (known && !completedWords.has(wordKey)) {
      nextCompleted = new Set(completedWords)
      nextCompleted.add(wordKey)
      setCompletedWords(nextCompleted)
      updateCategoryProgress(nextCompleted.size)
      setCorrectAnswersCount((v) => v + 1)
      setFlashcardCorrectCount((v) => v + 1)
      if (canEarnXpForWord(wordKey)) setXp((v) => v + 5)
      playCorrectSound()
    } else if (!known) {
      playWrongSound()
    }

    const remainingWords = lessonWords.filter((w) => !nextCompleted.has(getWordKey(w)))
    if (remainingWords.length === 0) {
      playVictorySound()
      const todayStr = getLocalDateString()
      let updatedDates = [...activeDates]
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
  }, [message, lives, remainingWordsCount, activeDates, notCompletedWords, wordStatsMap, selectedLevel, selectedCategory, currentDataSource])

  const handleRestart = useCallback(() => {
    playClickSound()
    if (selectedCategory && selectedLevel && currentDataSource) {
      handleSelectCategory(selectedCategory, selectedLevel, currentDataSource)
    } else {
      setScreen("menu")
    }
  }, [selectedCategory, selectedLevel, currentDataSource, handleSelectCategory])

  useEffect(() => { if (!mountedRef.current) return; saveProgress("lives", lives) }, [lives])
  useEffect(() => { if (!mountedRef.current || streak <= maxStreak) return; setMaxStreak(streak); saveProgress("maxStreak", streak) }, [streak, maxStreak])
  useEffect(() => { mountedRef.current = true }, [])

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

  const handleQuizComplete = (textId: string, score: number, total: number, xp: number, firstTime: boolean) => {
    if (firstTime) {
      markQuizCompleted(textId, score, true)
      setXp(prev => prev + xp)
    }
  }

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
        disabled={isAnswering || lives <= 0}
        lessonProgress={lessonProgressPercent}
        gameMode={gameMode}
        wordsLeft={remainingWordsCount}
        totalWords={totalLessonWords}
        speechRate={settings.speechRate}
        autoSpeakOnCorrect={settings.autoSpeakOnCorrect}
      />
    )
  }

  if (screen === "victory") {
    const accuracy = Math.round((correctAnswersCount / totalClicksCount) * 100) || 0
    return <VictoryScreen category={selectedCategory || ""} xpEarned={50} accuracy={accuracy} onBack={() => setScreen("menu")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-30 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇸🇰</span>
            <h1 className="text-xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              LearnSlovak
            </h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setGlobalTab("study")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              globalTab === "study" ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaBullseye size={20} />
            <span>Изучение</span>
          </button>
          <button
            onClick={() => setGlobalTab("reference")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              globalTab === "reference" ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaBookOpen size={20} />
            <span>Справочник</span>
          </button>
          <button
            onClick={() => setGlobalTab("texts")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              globalTab === "texts" ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <FaScroll size={20} />
            <span>Тексты</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <FaCog size={20} />
            <span>Настройки</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all mb-2"
              >
                <FaUserCircle size={20} />
                <span>Мой профиль</span>
              </Link>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <FaUserCircle size={24} className="text-gray-500" />
                  <span className="text-sm font-medium truncate">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Выйти"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => router.push("/login")}
                className="w-full py-2 text-center text-sm font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
              >
                Войти
              </button>
              <button
                onClick={() => router.push("/register")}
                className="w-full py-2 text-center text-sm font-bold border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
  settings={settings}
  onToggleMute={toggleMute}
  onSetSpeechRate={setSpeechRate}
  onSetAutoSpeak={setAutoSpeak}
  theme={theme}
  onToggleTheme={toggleTheme}
  correctAnswersCount={correctAnswersCount}
  totalClicksCount={totalClicksCount}
  learnedWordsCount={learnedWordsCount}
  completedCategoriesCount={completedCategoriesCount}
/>)}
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
                onComplete={(score, total, xp, firstTime) => handleQuizComplete(quizText.id, score, total, xp, firstTime)}
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
  readStatus={Object.fromEntries(texts.map(t => [t.id, isRead(t.id)]))}
  userLevel={userLevel}
/>
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