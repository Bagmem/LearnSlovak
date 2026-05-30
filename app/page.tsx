"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import toast from "react-hot-toast"
import { supabase } from "../lib/supabase"
import { normalizeUserLevel, getNextLevel, type UserLevel } from "../lib/levels"
import { words, type Word, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { texts, type SlovakText } from "../data/texts"
import { migrateStats, type WordStats } from "../lib/game"
import { loadProgress } from "../lib/storage"
import { setGlobalVolume } from "../lib/sounds"
import { useAchievements } from "../hooks/useAchievements"
import type { AchievementState } from "../data/achievements"
import { useTextProgress } from "../hooks/useTextProgress"
import { useSettings } from "../hooks/useSettings"
import { useTheme } from "../hooks/useTheme"
import dynamic from "next/dynamic"
import StartMenu from "./components/game/StartMenu"
import VictoryScreen from "./components/game/VictoryScreen"
import TextsMenu from "./components/texts/TextsMenu"
import TextViewer from "./components/texts/TextViewer"
import TextQuiz from "./components/texts/TextQuiz"
import AchievementNotification from "./components/achievements/AchievementNotification"
import SettingsModal from "./components/SettingsModal"
import LevelTest from "./components/test/LevelTest"
import TestResultModal from "./components/test/TestResultModal"
import Sidebar from "./components/Sidebar"
import GameScreen from "./components/GameScreen"
import { SkeletonLevelCard } from "./components/shared/Skeleton"
import { useGameEngine } from "../hooks/useGameEngine"
import { useDailyGoals } from "../hooks/useDailyGoals"
import Leaderboard from "./components/activity/Leaderboard"
import UserRank from "./components/activity/UserRank"
import LevelDistribution from "./components/friends/LevelDistribution"
import AddFriend from "./components/friends/AddFriend"
import FriendRequests from "./components/friends/FriendRequests"
import FriendsList from "./components/friends/FriendsList"
import { FaUserCircle, FaIdBadge } from "react-icons/fa"
import { useSyncXP } from "../hooks/useSyncXP"
import RecentActivityFeed from "./components/activity/RecentActivityFeed"
import WeeklyXpChart from "./components/activity/WeeklyXpChart"

const ReferenceView = dynamic(() => import("./components/ReferenceView"), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  ),
})

const FullTest = dynamic(() => import("./components/test/FullTest"), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  ),
})

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
  const [globalTab, setGlobalTab] = useState<"study" | "texts" | "test" | "reference" | "activity" | "friends">("study")

  const [xp, setXp] = useState<number>(() => {
    const savedXp = loadProgress<number>("xp")
    return savedXp !== null ? savedXp : 0
  })

  // Синхронизация XP с Supabase
  const { flush: flushXp, initialized } = useSyncXP(user, xp, setXp)

  const [activeDates, setActiveDates] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("slovak_active_dates")
    return saved ? JSON.parse(saved) : []
  })
  const [streak, setStreak] = useState<number>(() => {
    const dates = activeDates
    return calculateStreak(dates)
  })
  const [maxStreak, setMaxStreak] = useState<number>(() => {
    const saved = loadProgress<number>("maxStreak")
    return saved !== null ? saved : 0
  })
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0)
  const [totalClicksCount, setTotalClicksCount] = useState<number>(0)
  const [choiceCorrectCount, setChoiceCorrectCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("choiceCorrectCount")
    return saved ? parseInt(saved, 10) : 0
  })
  const [writeCorrectCount, setWriteCorrectCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("writeCorrectCount")
    return saved ? parseInt(saved, 10) : 0
  })
  const [flashcardCorrectCount, setFlashcardCorrectCount] = useState<number>(() => {
    if (typeof window === "undefined") return 0
    const saved = localStorage.getItem("flashcardCorrectCount")
    return saved ? parseInt(saved, 10) : 0
  })
  const [progressData, setProgressData] = useState<Record<string, number>>(() => getInitialProgressData())
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, WordStats>>(() => {
    if (typeof window === "undefined") return new Map()
    const saved = localStorage.getItem("slovak_word_stats")
    if (!saved) return new Map()
    try {
      const parsed = JSON.parse(saved)
      const map = new Map<string, WordStats>()
      Object.entries(parsed).forEach(([key, val]) => {
        map.set(key, migrateStats(val))
      })
      return map
    } catch {
      return new Map()
    }
  })
  const [hardWordsSet, setHardWordsSet] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    const saved = localStorage.getItem("slovak_hard_words")
    return new Set(saved ? JSON.parse(saved) : [])
  })

  const [selectedText, setSelectedText] = useState<SlovakText | null>(null)
  const [quizText, setQuizText] = useState<SlovakText | null>(null)
  const [testLevel, setTestLevel] = useState<LanguageLevel | null>(null)
  const [showTestResultModal, setShowTestResultModal] = useState(false)
  const [testResultData, setTestResultData] = useState<{
    level: string; percent: number; xpEarned: number; isPassed: boolean
  } | null>(null)

  // Пересчёт XP при загрузке, если он не соответствует новым правилам (2/3/1)
  useEffect(() => {
    if (typeof window === "undefined") return
    const newXp = choiceCorrectCount * 2 + writeCorrectCount * 3 + flashcardCorrectCount * 1
    const savedXp = loadProgress<number>("xp")
    if (savedXp !== null && savedXp !== newXp) {
      setXp(newXp)
      localStorage.setItem("xp", newXp.toString())
      if (user) {
        supabase.from("profiles").upsert({ id: user.id, xp: newXp }, { onConflict: "id" })
      }
    }
  }, [choiceCorrectCount, writeCorrectCount, flashcardCorrectCount, user, setXp])

  // Коллбэк для записи истории XP
  const handleXpEarned = useCallback(async (amount: number, source: string) => {
    if (!user) return
    const { error } = await supabase
      .from("xp_history")
      .insert({ user_id: user.id, xp_gained: amount, source })
    if (error) console.error("❌ Ошибка записи в xp_history:", error.message, error.details)
  }, [user])

  // Удаляем все сохранённые дневные лимиты XP (они больше не используются)
  useEffect(() => {
    if (typeof window === "undefined") return
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith("xp_word_") || key.startsWith("xp_lesson_bonus_"))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  }, [])

  // Сохраняем XP перед перезагрузкой / закрытием вкладки
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushXp()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [flushXp])

  const [refreshKey, setRefreshKey] = useState(0)

  // При переходе на вкладки активности или друзей немедленно синхронизируем XP и обновляем компоненты
  useEffect(() => {
    if (globalTab === "activity" || globalTab === "friends") {
      const doSync = async () => {
        await flushXp()
        setRefreshKey(prev => prev + 1)
      }
      doSync()
    }
  }, [globalTab, flushXp])

  function calculateStreak(dates: string[]): number {
    if (!dates || dates.length === 0) return 0
    const uniqueDates = new Set(dates)
    const todayStr = new Date().toISOString().slice(0, 10)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().slice(0, 10)
    const startDateStr = uniqueDates.has(todayStr) ? todayStr : uniqueDates.has(yesterdayStr) ? yesterdayStr : ""
    if (!startDateStr) return 0
    let streakCount = 0
    const checkDate = new Date(startDateStr)
    while (true) {
      const checkStr = checkDate.toISOString().slice(0, 10)
      if (!uniqueDates.has(checkStr)) break
      streakCount++
      checkDate.setDate(checkDate.getDate() - 1)
    }
    return streakCount
  }

  const forceSaveWordStats = useCallback(() => {
    if (typeof window === "undefined") return
    const obj: Record<string, WordStats> = {}
    wordStatsMap.forEach((value, key) => {
      obj[key] = value
    })
    localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
  }, [wordStatsMap])

  const completedCategoriesCount = useMemo(
    () => Object.values(progressData).filter(passed => passed > 0).length,
    [progressData]
  )
  const learnedWordsCount = useMemo(
    () => Array.from(wordStatsMap.values()).filter(stat => stat.correctCount > 0).length,
    [wordStatsMap]
  )

  const triggerAchievementCheck = useCallback((skipCount: number, perfectLessonCount: number) => {
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
      skipCount,
      perfectLessonCount,
      textsReadCount: textsRead,
    }
    const newAchievements = checkAchievements(state)
    if (newAchievements.length > 0) {
      const reward = newAchievements.reduce((sum: number, ach: { reward?: number }) => sum + (ach.reward || 0), 0)
      if (reward > 0) {
        setXp((v) => v + reward)
        handleXpEarned(reward, "achievement")
      }
    }
  }, [
    xp, correctAnswersCount, totalClicksCount, streak, maxStreak,
    completedCategoriesCount, learnedWordsCount, flashcardCorrectCount,
    writeCorrectCount, choiceCorrectCount, isQuizCompleted, isRead,
    hardWordsSet, checkAchievements, setXp, handleXpEarned
  ])

  const game = useGameEngine({
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
    onAchievementCheck: triggerAchievementCheck,
    onXpEarned: handleXpEarned,
  })

  const { goals, updateProgress, completedGoal, clearCompletedGoal } = useDailyGoals()

  useEffect(() => {
    if (completedGoal) {
      toast.success(`🎉 Цель выполнена: ${completedGoal.description} (+${completedGoal.reward} XP)`, { duration: 4000 })
      setXp(prev => prev + completedGoal.reward)
      handleXpEarned(completedGoal.reward, "daily_goal")
      clearCompletedGoal()
    }
  }, [completedGoal, clearCompletedGoal, setXp, handleXpEarned])

  const prevSessionCorrect = useRef(0)
  const prevScreen = useRef<"menu" | "game" | "victory">("menu")
  const prevXp = useRef(xp)
  const prevLearnedWords = useRef(learnedWordsCount)

  useEffect(() => {
    if (game.sessionCorrect > prevSessionCorrect.current) {
      const diff = game.sessionCorrect - prevSessionCorrect.current
      updateProgress("correctAnswers", diff)
      if (game.gameMode === "flashcard") {
        updateProgress("reviewWords", diff)
      }
    }
    prevSessionCorrect.current = game.sessionCorrect
  }, [game.sessionCorrect, game.gameMode, updateProgress])

  useEffect(() => {
    if (prevScreen.current === "game" && game.screen === "victory") {
      updateProgress("sessionsCompleted", 1)
      if (game.sessionMistakes.length === 0) {
        updateProgress("perfectLesson", 1)
      }
    }
    prevScreen.current = game.screen
  }, [game.screen, game.sessionMistakes, updateProgress])

  useEffect(() => {
    if (xp > prevXp.current) {
      const diff = xp - prevXp.current
      updateProgress("xpGain", diff)
    }
    prevXp.current = xp
  }, [xp, updateProgress])

  useEffect(() => {
    if (learnedWordsCount > prevLearnedWords.current) {
      const diff = learnedWordsCount - prevLearnedWords.current
      updateProgress("newWordsLearned", diff)
    }
    prevLearnedWords.current = learnedWordsCount
  }, [learnedWordsCount, updateProgress])

  useEffect(() => {
    if (streak >= 1) {
      updateProgress("streakDays", streak)
    }
  }, [streak, updateProgress])

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
    if (typeof window !== "undefined") localStorage.setItem("xp", xp.toString())
  }, [xp])
  useEffect(() => {
    setGlobalVolume(settings.volume)
  }, [settings.volume])

  const handleLogout = async () => {
    forceSaveWordStats()
    await flushXp()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Ошибка выхода:", error)
      toast.error("Не удалось выйти. Попробуйте ещё раз.")
      return
    }
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
        toast.error("Не удалось загрузить данные пользователя. Попробуйте обновить страницу.")
        setUser(null)
        setUserLevel(null)
        setIsLoadingUser(false)
        return
      }
      setUser(currentUser)
      if (!currentUser) setUserLevel(null)
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
    if (typeof window !== "undefined") {
      localStorage.setItem("slovak_active_dates", JSON.stringify(activeDates))
    }
  }, [activeDates])

  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
  }, [])
  useEffect(() => {
    if (!mountedRef.current || streak <= maxStreak) return
    setMaxStreak(streak)
    if (typeof window !== "undefined") {
      localStorage.setItem("maxStreak", streak.toString())
    }
  }, [streak, maxStreak])

  useEffect(() => {
    const handleBeforeUnload = () => forceSaveWordStats()
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [forceSaveWordStats])

  const handleStartQuiz = (text: SlovakText) => {
    markAsRead(text.id)
    setQuizText(text)
  }

  const handleQuizComplete = (textId: string, score: number, total: number, xpEarned: number, firstTime: boolean) => {
    markQuizCompleted(textId, score, true)
    if (firstTime) {
      setXp(prev => prev + xpEarned)
      handleXpEarned(xpEarned, "quiz")
    }
    triggerAchievementCheck(game.skipCount, game.perfectLessonCount)
  }

  const handleStartTest = (level: LanguageLevel) => {
    setTestLevel(level)
    setShowTestResultModal(false)
    setTestResultData(null)
  }

  const handleTestComplete = async (score: number, total: number, xpEarned: number) => {
    setXp(prev => prev + xpEarned)
    handleXpEarned(xpEarned, "test")
    updateProgress("completeTest", 1)
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
          toast.error("Не удалось обновить уровень. Попробуйте позже.")
        }
      }
    }
    setTestLevel(null)
    triggerAchievementCheck(game.skipCount, game.perfectLessonCount)
  }

  const handleBackToLevels = () => {
    setTestLevel(null)
    setShowTestResultModal(false)
    setTestResultData(null)
  }

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

  if (game.screen === "game") {
    return (
      <GameScreen
        gameMode={game.gameMode}
        currentWord={game.currentWord}
        options={game.options}
        message={game.message}
        selectedOption={game.selectedOption}
        isAnswering={game.isAnswering}
        lives={game.lives}
        disabled={game.disabled}
        lessonProgress={game.lessonProgressPercent}
        wordsLeft={game.remainingWordsCount}
        totalWords={game.totalLessonWords}
        remainingCount={game.remainingCount}
        xp={xp}
        streak={streak}
        sessionCorrect={game.sessionCorrect}
        sessionTotal={game.sessionTotal}
        speechRate={settings.speechRate}
        autoSpeakOnCorrect={settings.autoSpeakOnCorrect}
        onFlashcardNext={game.handleFlashcardRating}
        onAnswer={game.checkAnswerHandler}
        onNext={game.handleNextWord}
        onRestart={game.handleRestart}
        onBack={game.handleBack}
        onSkip={game.handleSkip}
        onMarkHard={game.handleMarkHard}
        isExitConfirmOpen={game.isExitConfirmOpen}
        onCloseExitConfirm={() => game.setIsExitConfirmOpen(false)}
        onConfirmExit={game.confirmExit}
        getWordKey={game.getWordKey}
      />
    )
  }

  if (game.screen === "victory") {
    const accuracy = game.sessionTotal ? Math.round((game.sessionCorrect / game.sessionTotal) * 100) : 0
    const xpEarned = (game.gameMode === "write" ? 3 : game.gameMode === "flashcard" ? 1 : 2) * game.sessionCorrect
    return (
      <VictoryScreen
        category={game.selectedCategory || ""}
        xpEarned={xpEarned}
        accuracy={accuracy}
        sessionCorrect={game.sessionCorrect}
        sessionTotal={game.sessionTotal}
        onBack={() => game.setScreen("menu")}
        mistakes={game.sessionMistakes}
        onRetryMistakes={game.handleRetryMistakes}
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
              onSelectCategory={game.handleSelectCategory}
              userLevel={userLevel}
              xp={xp}
              progressData={progressData}
              streak={streak}
              activeDates={activeDates}
              gameMode={game.gameMode}
              setGameMode={game.setGameMode}
              correctAnswersCount={correctAnswersCount}
              totalClicksCount={totalClicksCount}
              learnedWordsCount={learnedWordsCount}
              completedCategoriesCount={completedCategoriesCount}
              wordStatsMap={wordStatsMap}
              onStartReview={(reviewWords) => {
                game.handleSelectCategory("review", "A1", "vocab", reviewWords)
              }}
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
          {globalTab === "activity" && (
            <div className="space-y-6" key={refreshKey}>
              {user && <UserRank currentXp={xp} currentUserId={user.id} />}
              <Leaderboard 
                currentUserId={user?.id} 
                currentUserName={user ? getUserDisplayName(user) : undefined}
                currentUserAvatar={user?.user_metadata?.avatar_url}
              />
              {user && <RecentActivityFeed userId={user.id} />}
              {user && <WeeklyXpChart userId={user.id} />}
            </div>
          )}
          {globalTab === "friends" && (
            <div className="space-y-6" key={refreshKey}>
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl p-5"
                >
                  <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FaIdBadge className="text-orange-500" /> Ваш профиль
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt={getUserDisplayName(user)} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FaUserCircle className="text-gray-500 dark:text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">{getUserDisplayName(user)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Уровень: {userLevel || "—"} • {xp} XP
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              <AddFriend />
              <FriendRequests />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <FriendsList />
                </div>
                <LevelDistribution currentUserId={user?.id} />
              </div>
            </div>
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