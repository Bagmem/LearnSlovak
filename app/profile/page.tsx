"use client"

import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import {
  FaArrowLeft, FaFire, FaSignOutAlt, FaTrophy,
  FaUserCircle, FaCheckCircle, FaUserFriends,
  FaMedal, FaTimes,
} from "react-icons/fa"
import { supabase } from "../../lib/supabase"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { achievements } from "../../data/achievements"
import { useAchievements } from "../../hooks/useAchievements"
import { initAudio, playClickSound } from "../../lib/sounds"
import AchievementsList from "../components/achievements/AchievementsList"
import ActivityHeatmap from "../components/streak/ActivityHeatmap"
import StreakModal from "../components/streak/StreakModal"
import ProgressChart from "../components/streak/ProgressChart"
import UserProfileCard from "./UserProfileCard"
import StatsCards from "./StatsCards"
import LevelDetailModal from "./LevelDetailModal"

// ─── Типы ────────────────────────────────────────────────
type UserProfile = {
  id: string
  name: string
  email: string
  avatar_url: string
  xp: number
  level: string | null
}

type SavedAchievement =
  | string
  | {
      id: string
      title?: string
      name?: string
      description?: string
      icon?: string
      reward?: number
    }

// ─── Утилиты для streak / localStorage ────────────────
function getLocalDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function calculateStreak(dates: string[]): number {
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

const getStoredXp = (): number => {
  if (typeof window === "undefined") return 0
  const saved = localStorage.getItem("xp")
  return saved ? parseInt(saved, 10) : 0
}

const getStoredActiveDates = (): string[] => {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem("slovak_active_dates")
  return saved ? JSON.parse(saved) : []
}

const getStoredWordStatsMap = (): Map<string, { correctCount: number; wrongCount: number }> => {
  if (typeof window === "undefined") return new Map()
  const saved = localStorage.getItem("slovak_word_stats")
  if (!saved) return new Map()
  try {
    const parsed = JSON.parse(saved) as Record<string, { correctCount: number; wrongCount: number }>
    const map = new Map()
    Object.entries(parsed).forEach(([key, val]) => map.set(key, val))
    return map
  } catch {
    return new Map()
  }
}

const getStoredAchievements = (): { count: number; recent: SavedAchievement[] } => {
  if (typeof window === "undefined") return { count: 0, recent: [] }
  const saved = localStorage.getItem("slovak_achievements")
  if (!saved) return { count: 0, recent: [] }
  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return { count: 0, recent: [] }
    const recent = parsed.slice(-3).reverse()
    return { count: parsed.length, recent }
  } catch {
    return { count: 0, recent: [] }
  }
}

const getStoredProgressData = (): Record<string, number> => {
  if (typeof window === "undefined") return {}
  const progress: Record<string, number> = {}
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("slovak_app_cat_progress_")) {
      const value = localStorage.getItem(key)
      if (value) {
        const originalKey = key.replace("slovak_app_", "")
        progress[originalKey] = parseInt(value, 10)
      }
    }
  })
  return progress
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
    "Без имени"
  )
}

function getUserAvatarUrl(user: User): string {
  return user.user_metadata?.avatar_url || ""
}

async function getOrCreateProfile(user: User): Promise<UserProfile> {
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_url, xp, level")
    .eq("id", user.id)
    .maybeSingle()
  if (selectError) throw selectError
  if (existingProfile) return existingProfile as UserProfile

  const newProfile = {
    id: user.id,
    name: getUserDisplayName(user),
    email: user.email || "",
    avatar_url: getUserAvatarUrl(user),
    xp: 0,
    level: "A1",
  }
  const { data: createdProfile, error: insertError } = await supabase
    .from("profiles")
    .insert(newProfile)
    .select("id, name, email, avatar_url, xp, level")
    .single()
  if (insertError) throw insertError
  return createdProfile as UserProfile
}

// ─── Презентационная обёртка для анимированных блоков ────
function AnimatedBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Модальное окно достижений (обёртка для AnimatePresence) ─────
function AchievementsModal({
  isOpen,
  onClose,
  unlocked,
}: {
  isOpen: boolean
  onClose: () => void
  unlocked: any[]
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="rounded-2xl w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
            <FaTrophy className="text-orange-500 text-base" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-gray-800 dark:text-white">Достижения</h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">ваши награды и успехи</p>
          </div>
          <button onClick={() => { playClickSound(); onClose() }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <FaTimes size={18} />
          </button>
        </div>
        <div className="p-3 max-h-[70vh] overflow-y-auto">
          <AchievementsList unlocked={unlocked} />
        </div>
        <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
          <button onClick={() => { playClickSound(); onClose() }} className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-sm hover:shadow-lg transition">
            Закрыть
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Основной компонент страницы ─────────────────────────
export default function ProfilePage() {
  const router = useRouter()
  const { unlocked } = useAchievements()

  // ─── Состояния ─────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [progressData] = useState<Record<string, number>>(() => getStoredProgressData())
  const [activeDates] = useState<string[]>(() => getStoredActiveDates())
  const [wordStatsMap] = useState<Map<string, { correctCount: number; wrongCount: number }>>(() => getStoredWordStatsMap())
  const [xp, setXp] = useState<number>(() => getStoredXp())
  const [unlockedAchievementsCount] = useState<number>(() => getStoredAchievements().count)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showLevelModal, setShowLevelModal] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [recentAchievements] = useState<SavedAchievement[]>(() => getStoredAchievements().recent)

  const [choiceCorrectCount] = useState(() => getStoredChoiceCorrectCount())
  const [writeCorrectCount] = useState(() => getStoredWriteCorrectCount())
  const [flashcardCorrectCount] = useState(() => getStoredFlashcardCorrectCount())

  // ─── Производные значения ──────────────────────────────
  const streak = useMemo(() => calculateStreak(activeDates), [activeDates])

  function isWordLearned(stat: { correctCount: number; wrongCount: number }): boolean {
    return stat.correctCount >= 2 && stat.correctCount >= stat.wrongCount
  }

  const wordKeysSet = useMemo(() => {
    return new Set(words.map((word) => `${word.slovak}|${word.russian}`))
  }, [])

  const uniqueLearnedWords = useMemo(() => {
    let count = 0
    for (const [key, stat] of wordStatsMap.entries()) {
      if (wordKeysSet.has(key) && isWordLearned(stat)) count++
    }
    return count
  }, [wordStatsMap, wordKeysSet])

  const totalWordsCount = words.length

  const allItems = useMemo(() => [...words, ...grammarTasks], [])

  const categoryTotalCount = useMemo(() => {
    const counts: Record<string, number> = {}
    allItems.forEach((item) => {
      const key = `${item.level}_${item.category}`
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [allItems])

  const completedCategoriesCount = useMemo(() => {
    let completed = 0
    Object.entries(progressData).forEach(([key, passed]) => {
      const total = categoryTotalCount[key] || 1
      if (passed >= total) completed++
    })
    return completed
  }, [progressData, categoryTotalCount])

  const { totalCorrect, totalWrong } = useMemo(() => {
    let correct = 0, wrong = 0
    wordStatsMap.forEach((stat) => {
      correct += stat.correctCount
      wrong += stat.wrongCount
    })
    return { totalCorrect: correct, totalWrong: wrong }
  }, [wordStatsMap])

  const totalAnswers = totalCorrect + totalWrong
  const accuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : 0
  const wordsPercent = totalWordsCount ? (uniqueLearnedWords / totalWordsCount) * 100 : 0
  const totalCategories = Object.keys(categoryTotalCount).length
  const categoriesPercent = totalCategories ? (completedCategoriesCount / totalCategories) * 100 : 0

  const levelStats = useMemo(() => {
    const levels = ["A1", "A2", "B1", "B2", "C1"] as const
    return levels.map((levelItem) => {
      const itemsInLevel = allItems.filter((item) => item.level === levelItem)
      if (!itemsInLevel.length) return { level: levelItem, total: 0, learned: 0, percent: 0 }
      const uniqueCategories = new Set(itemsInLevel.map((item) => item.category))
      let completedCategories = 0
      uniqueCategories.forEach((category) => {
        const totalInCat = itemsInLevel.filter((item) => item.category === category).length
        const passed = progressData[`cat_progress_${levelItem}_${category}`] || 0
        if (passed >= totalInCat) completedCategories++
      })
      const total = uniqueCategories.size
      return { level: levelItem, total, learned: completedCategories, percent: total ? (completedCategories / total) * 100 : 0 }
    })
  }, [allItems, progressData])

  const hardWords = useMemo(() => {
    const wordsList: { word: string; translation: string; wrong: number; correct: number }[] = []
    wordStatsMap.forEach((stat, key) => {
      if (stat.wrongCount > 0 || stat.correctCount > 0) {
        const [slovak, russian] = key.split("|")
        wordsList.push({ word: slovak, translation: russian, wrong: stat.wrongCount, correct: stat.correctCount })
      }
    })
    wordsList.sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
    return wordsList.slice(0, 5)
  }, [wordStatsMap])

  // ─── Данные профиля ────────────────────────────────────
  const displayName = profile?.name || user?.user_metadata?.name || user?.user_metadata?.full_name || "Без имени"
  const displayEmail = profile?.email || user?.email || "Email не найден"
  const photoURL = profile?.avatar_url || user?.user_metadata?.avatar_url || ""
  const level = profile?.level || null

  const profileLevel = Math.floor(xp / 100) + 1
  const levelBase = profileLevel > 1 ? (profileLevel - 1) * 100 : 0
  const nextLevelXp = levelBase + 100
  const currentLevelProgress = xp - levelBase
  const progressPercent = Math.min((currentLevelProgress / 100) * 100, 100)
  const xpLeft = Math.max(nextLevelXp - xp, 0)

  // ─── Эффекты ───────────────────────────────────────────
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "xp") {
        const newXp = e.newValue ? parseInt(e.newValue, 10) : 0
        setXp(newXp)
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const handleFirstClick = () => {
      try { initAudio() } catch {}
      document.removeEventListener("click", handleFirstClick)
    }
    document.addEventListener("click", handleFirstClick)
    return () => document.removeEventListener("click", handleFirstClick)
  }, [])

  useEffect(() => {
    let isMounted = true
    async function loadProfile() {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!currentUser) {
          if (!isMounted) return
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }
        const loadedProfile = await getOrCreateProfile(currentUser)
        if (!isMounted) return
        setUser(currentUser)
        setProfile(loadedProfile)
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error)
        if (!isMounted) return
        setUser(null)
        setProfile(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadProfile()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => loadProfile())
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ─── Обработчики ───────────────────────────────────────
  const forceSaveWordStats = () => {
    const obj: Record<string, { correctCount: number; wrongCount: number }> = {}
    wordStatsMap.forEach((value, key) => {
      obj[key] = { correctCount: value.correctCount, wrongCount: value.wrongCount }
    })
    localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
  }

  async function handleLogout() {
    playClickSound()
    forceSaveWordStats()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Ошибка выхода:", error)
      return
    }
    router.push("/login")
    router.refresh()
  }

  async function handleSaveName() {
    if (!user) return
    const trimmedName = newName.trim()
    if (!trimmedName) return
    playClickSound()
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: trimmedName })
        .eq("id", user.id)
      if (profileError) throw profileError
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: trimmedName, full_name: trimmedName }
      })
      if (authError) console.warn("Имя в auth metadata не обновилось:", authError)
      setProfile((prev) => (prev ? { ...prev, name: trimmedName } : null))
      setEditingName(false)
    } catch (error) {
      console.error("Ошибка изменения имени:", error)
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      console.error("Выбранный файл не является изображением")
      return
    }
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.error("Размер файла не должен превышать 5MB")
      return
    }
    try {
      setUploadingAvatar(true)
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const filePath = `${user.id}/avatar.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath)
      const avatarUrl = `${publicUrl}?v=${Date.now()}`
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id)
      if (profileError) throw profileError
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl }
      })
      if (authError) console.warn("Аватар в auth metadata не обновился:", authError)
      setProfile((prev) => (prev ? { ...prev, avatar_url: avatarUrl } : null))
      event.target.value = ""
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const copyToClipboard = (text: string) => {
    playClickSound()
    navigator.clipboard.writeText(text)
  }

  // ─── Рендер ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:bg-gradient-to-br dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
        <div className="rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-xl p-8 font-bold text-xl">
          Загрузка профиля...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100 dark:bg-gradient-to-br dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
        <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <FaUserCircle className="mx-auto mb-4 text-7xl text-orange-500 dark:text-orange-400" />
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">Вы не вошли</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Войдите в аккаунт, чтобы открыть страницу профиля.</p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => { playClickSound(); router.push("/login") }}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.02]"
            >
              Войти
            </button>
            <Link href="/" onClick={() => playClickSound()} className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 py-3 text-center font-bold transition">
              На главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:bg-gradient-to-br dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        {/* Шапка */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-3"
        >
          <Link
            href="/"
            onClick={() => playClickSound()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaArrowLeft /> На главную
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-300 shadow-sm transition hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            <FaSignOutAlt /> Выйти
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка */}
          <div className="lg:col-span-1 space-y-4">
            {/* Карточка профиля */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <UserProfileCard
                photoURL={photoURL}
                displayName={displayName}
                editingName={editingName}
                newName={newName}
                setNewName={setNewName}
                onSaveName={handleSaveName}
                onStartEdit={() => { playClickSound(); setEditingName(true); setNewName(displayName) }}
                displayEmail={displayEmail}
                userId={user.id}
                onCopyId={copyToClipboard}
                uploadingAvatar={uploadingAvatar}
                onAvatarUpload={handleAvatarUpload}
              />
            </motion.div>

            {/* Друзья */}
            <AnimatedBlock delay={0.15}>
              <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaUserFriends className="text-orange-500 text-sm" />
                    </div>
                    <h3 className="font-black text-gray-800 dark:text-white text-xs">Друзья</h3>
                  </div>
                  <button className="text-[10px] bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full text-orange-600 dark:text-orange-400 opacity-60 cursor-not-allowed">
                    Пригласить
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 opacity-60">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <FaUserCircle className="text-base" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mt-2">
                  Приглашайте друзей, чтобы соревноваться
                </p>
              </div>
            </AnimatedBlock>

            {/* Тепловая карта активности */}
            <AnimatedBlock delay={0.4}>
              <ActivityHeatmap activeDates={activeDates} days={30} />
            </AnimatedBlock>
          </div>

          {/* Правая колонка */}
          <div className="lg:col-span-2 space-y-4">
            {/* Статистические круги */}
            <StatsCards
              wordsPercent={wordsPercent}
              uniqueLearnedWords={uniqueLearnedWords}
              totalWordsCount={totalWordsCount}
              categoriesPercent={categoriesPercent}
              completedCategoriesCount={completedCategoriesCount}
              totalCategories={totalCategories}
              accuracy={accuracy}
              totalCorrect={totalCorrect}
              totalAnswers={totalAnswers}
            />

            {/* Карточки: уровень языка, серия, достижения */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatedBlock delay={0.4}>
                <div
                  className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700 h-full flex flex-col justify-center"
                  onClick={() => { playClickSound(); setShowLevelModal(true) }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaTrophy className="text-orange-500 text-lg" />
                    </div>
                  </div>
                  <h3 className="text-xs font-black text-gray-800 dark:text-white mb-0.5">Уровень языка</h3>
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{level || "—"}</p>
                </div>
              </AnimatedBlock>
              <AnimatedBlock delay={0.45}>
                <div
                  className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700 h-full flex flex-col justify-center"
                  onClick={() => { playClickSound(); setShowStreakModal(true) }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaFire className="text-orange-500 text-lg" />
                    </div>
                  </div>
                  <h3 className="text-xs font-black text-gray-800 dark:text-white mb-0.5">Серия</h3>
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{streak}</p>
                </div>
              </AnimatedBlock>
              <AnimatedBlock delay={0.5}>
                <div
                  className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700 h-full flex flex-col justify-center"
                  onClick={() => { playClickSound(); setShowAchievements(true) }}
                >
                  <div className="flex justify-center mb-2">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaCheckCircle className="text-orange-500 text-lg" />
                    </div>
                  </div>
                  <h3 className="text-xs font-black text-gray-800 dark:text-white mb-0.5">Достижения</h3>
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{unlockedAchievementsCount}/{achievements.length}</p>
                </div>
              </AnimatedBlock>
            </div>

            {/* График прогресса */}
            <AnimatedBlock delay={0.55}>
              <ProgressChart
                choiceCorrectCount={choiceCorrectCount}
                writeCorrectCount={writeCorrectCount}
                flashcardCorrectCount={flashcardCorrectCount}
              />
            </AnimatedBlock>

            {/* Недавние достижения */}
            {recentAchievements.length > 0 && (
              <AnimatedBlock delay={0.6}>
                <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaTrophy className="text-orange-500 text-sm" />
                    </div>
                    <h3 className="font-black text-gray-800 dark:text-white text-xs">Недавние достижения</h3>
                  </div>
                  <div className="space-y-1">
                    {recentAchievements.slice(0, 3).map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700 dark:text-gray-300">
                        <FaMedal className="text-yellow-500 text-[10px]" />
                        <span className="truncate">{typeof ach === "string" ? ach : ach.title || ach.name || "Достижение"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedBlock>
            )}
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <AnimatePresence>
        <LevelDetailModal
          key="level-modal"
          isOpen={showLevelModal}
          onClose={() => setShowLevelModal(false)}
          profileLevel={profileLevel}
          xp={xp}
          nextLevelXp={nextLevelXp}
          progressPercent={progressPercent}
          xpLeft={xpLeft}
          levelStats={levelStats}
          hardWords={hardWords}
          playClickSound={playClickSound}
        />

        <StreakModal
          key="streak-modal"
          isOpen={showStreakModal}
          onClose={() => setShowStreakModal(false)}
          currentStreak={streak}
          activeDates={activeDates}
        />

        <AchievementsModal
          key="achievements-modal"
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
          unlocked={unlocked}
        />
      </AnimatePresence>
    </div>
  )
}