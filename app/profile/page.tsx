"use client"

import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import {
  FaArrowLeft, FaCamera, FaEnvelope, FaFire, FaPen, FaSignOutAlt,
  FaStar, FaTrophy, FaUserCircle, FaCalendarAlt, FaSkull, FaGraduationCap,
  FaCheckCircle, FaTimes, FaCopy, FaUserFriends, FaGem, FaMedal,
  FaChartPie, FaBook, FaLayerGroup, FaBullseye,
} from "react-icons/fa"
import { supabase } from "../../lib/supabase"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { achievements } from "../../data/achievements"
import { useAchievements } from "../../hooks/useAchievements"
import { initAudio, playClickSound } from "../../lib/sounds"
import AchievementsList from "../components/AchievementsList"
import ActivityHeatmap from "../components/ActivityHeatmap"
import StreakModal from "../components/StreakModal"
import ProgressChart from "../components/ProgressChart"

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

function getDayWord(count: number): string {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "дней"
  if (lastDigit === 1) return "день"
  if (lastDigit >= 2 && lastDigit <= 4) return "дня"
  return "дней"
}

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

function CircularProgress({
  percent,
  label,
  icon,
  color = "#f97316",
  size = 80,
}: {
  percent: number
  label: string
  icon: string
  color?: string
  size?: number
}) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const [animatedPercent, setAnimatedPercent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100)
    return () => clearTimeout(timer)
  }, [percent])

  const offset = circumference - (animatedPercent / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center p-2 overflow-visible"
    >
      <div className="relative overflow-visible" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full overflow-visible">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="5"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl">{icon}</span>
          <span className="text-base font-black text-gray-800 dark:text-white">
            {Math.round(animatedPercent)}%
          </span>
        </div>
      </div>
      <span className="text-[10px] font-semibold mt-1 text-gray-600 dark:text-gray-300">
        {label}
      </span>
    </motion.div>
  )
}

function StatCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { unlocked } = useAchievements()

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

  const streak = useMemo(() => calculateStreak(activeDates), [activeDates])

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
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="lg:col-span-1 space-y-4">
            {/* Профиль */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-2">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {photoURL ? (
                        <img src={photoURL} alt="Аватар" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FaUserCircle className="text-3xl text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-orange-500 p-0.5 text-white shadow-md transition hover:bg-orange-600">
                      <FaCamera className="text-[10px]" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                    </label>
                  </div>
                  {editingName ? (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Новое имя"
                        className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400"
                      />
                      <button onClick={handleSaveName} className="rounded-lg bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white hover:bg-orange-600 transition">
                        Сохранить
                      </button>
                    </div>
                  ) : (
                    <h2 className="text-base font-black text-gray-800 dark:text-white">{displayName}</h2>
                  )}
                  <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FaEnvelope className="text-[10px]" /> {displayEmail}
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <span>🆔</span>
                    <span className="font-mono">{user.id.slice(0, 8)}...</span>
                    <button onClick={() => copyToClipboard(user.id)} className="text-gray-400 hover:text-orange-500 transition">
                      <FaCopy size={8} />
                    </button>
                  </p>
                  <button
                    onClick={() => { playClickSound(); setEditingName(true); setNewName(displayName) }}
                    className="mt-1 inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <FaPen size={8} /> Редактировать
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Друзья */}
            <StatCard delay={0.15}>
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
            </StatCard>

            <StatCard delay={0.4}>
              <ActivityHeatmap activeDates={activeDates} days={30} />
            </StatCard>
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="lg:col-span-2 space-y-4">
            {/* Строка 1: слова / темы / точность */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard delay={0.25}>
                <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center h-full flex flex-col">
                  <div className="flex justify-center mb-1">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaBook className="text-orange-500 text-base" />
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <CircularProgress percent={wordsPercent} label="Слов изучено" icon="📚" color="#f97316" size={80} />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {uniqueLearnedWords} из {totalWordsCount}
                  </p>
                </div>
              </StatCard>

              <StatCard delay={0.3}>
                <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center h-full flex flex-col">
                  <div className="flex justify-center mb-1">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaLayerGroup className="text-orange-500 text-base" />
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <CircularProgress percent={categoriesPercent} label="Тем завершено" icon="🏆" color="#3b82f6" size={80} />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {completedCategoriesCount} из {totalCategories}
                  </p>
                </div>
              </StatCard>

              <StatCard delay={0.35}>
                <div className="rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-3 text-center h-full flex flex-col">
                  <div className="flex justify-center mb-1">
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                      <FaBullseye className="text-orange-500 text-base" />
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <CircularProgress percent={accuracy} label="Точность" icon="🎯" color="#22c55e" size={80} />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    {totalCorrect} из {totalAnswers} ответов
                  </p>
                </div>
              </StatCard>
            </div>

            {/* Строка 2: уровень языка / серия / достижения */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard delay={0.4}>
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
              </StatCard>

              <StatCard delay={0.45}>
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
              </StatCard>

              <StatCard delay={0.5}>
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
              </StatCard>
            </div>

            {/* Распределение XP */}
            <StatCard delay={0.55}>
              <ProgressChart
                choiceCorrectCount={choiceCorrectCount}
                writeCorrectCount={writeCorrectCount}
                flashcardCorrectCount={flashcardCorrectCount}
              />
            </StatCard>

            {/* Недавние достижения */}
            {recentAchievements.length > 0 && (
              <StatCard delay={0.6}>
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
              </StatCard>
            )}
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <AnimatePresence>
        {showLevelModal && (
          <div
            key="level-modal"
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLevelModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl w-full max-w-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                  <FaGraduationCap className="text-orange-500 text-base" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-black text-gray-800 dark:text-white">Детали прогресса</h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">ваш путь в изучении словацкого</p>
                </div>
                <button onClick={() => { playClickSound(); setShowLevelModal(false) }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-orange-500 dark:text-orange-400">{profileLevel}</div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">текущий уровень профиля</p>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-300">XP</span>
                    <span className="text-orange-500 font-bold">{xp} / {nextLevelXp}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">до следующего уровня: {xpLeft} XP</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-1.5 text-xs text-gray-800 dark:text-white">
                    <FaChartPie className="text-orange-500 text-[10px]" /> Уровни языка
                  </h3>
                  <div className="space-y-2">
                    {levelStats.map((stat, idx) => (
                      <motion.div key={stat.level} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <div className="flex justify-between text-xs font-bold mb-0.5">
                          <span className="text-gray-700 dark:text-gray-300">{stat.level}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-[9px]">{stat.learned}/{stat.total} тем</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percent}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2 flex items-center gap-1.5 text-xs text-gray-800 dark:text-white">
                    <FaSkull className="text-red-500 text-[10px]" /> Сложные слова
                  </h3>
                  {hardWords.length > 0 ? (
                    <div className="space-y-1">
                      {hardWords.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex justify-between items-center p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
                        >
                          <div>
                            <p className="font-bold text-xs text-gray-800 dark:text-white">{item.word}</p>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400">{item.translation}</p>
                          </div>
                          <div className="text-[9px] font-mono">
                            <span className="text-red-500">✗{item.wrong}</span> <span className="text-green-600">✓{item.correct}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center py-2">🎉 Отлично! Сложных слов пока нет</p>
                  )}
                </div>
              </div>
              <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                <button onClick={() => { playClickSound(); setShowLevelModal(false) }} className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-sm hover:shadow-lg transition">
                  Закрыть
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showStreakModal && (
          <StreakModal key="streak-modal" isOpen={showStreakModal} onClose={() => setShowStreakModal(false)} currentStreak={streak} activeDates={activeDates} />
        )}

        {showAchievements && (
          <div key="achievements-modal" className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAchievements(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                  <FaGem className="text-orange-500 text-base" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-black text-gray-800 dark:text-white">Достижения</h2>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">ваши награды и успехи</p>
                </div>
                <button onClick={() => { playClickSound(); setShowAchievements(false) }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-3 max-h-[70vh] overflow-y-auto">
                <AchievementsList unlocked={unlocked} />
              </div>
              <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
                <button onClick={() => { playClickSound(); setShowAchievements(false) }} className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-sm hover:shadow-lg transition">
                  Закрыть
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}