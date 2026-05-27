"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {
  FaArrowLeft, FaCamera, FaEnvelope, FaFire, FaPen, FaSignOutAlt,
  FaStar, FaTrophy, FaUserCircle, FaCalendarAlt, FaSkull, FaGraduationCap,
  FaCheckCircle, FaTimes, FaCopy, FaUserFriends, FaGem, FaMedal,
} from "react-icons/fa"
import { auth, db, storage } from "../../lib/firebase"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { achievements } from "../../data/achievements"
import { useAchievements } from "../../hooks/useAchievements"
import { useTheme } from "../../hooks/useTheme"
import { initAudio, playClickSound } from "../../lib/sounds"
import AchievementsList from "../components/AchievementsList"
import ActivityHeatmap from "../components/ActivityHeatmap"
import StreakModal from "../components/StreakModal"

type UserProfile = {
  uid: string
  name: string
  email: string
  photoURL: string
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
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней'
  if (lastDigit === 1) return 'день'
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня'
  return 'дней'
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
  if (typeof window === 'undefined') return 0
  const saved = localStorage.getItem('xp')
  return saved ? parseInt(saved, 10) : 0
}

const getStoredActiveDates = (): string[] => {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('slovak_active_dates')
  return saved ? JSON.parse(saved) : []
}

const getStoredWordStatsMap = (): Map<string, { correctCount: number; wrongCount: number }> => {
  if (typeof window === 'undefined') return new Map()
  const saved = localStorage.getItem('slovak_word_stats')
  if (!saved) return new Map()
  try {
    const parsed = JSON.parse(saved) as Record<string, { correctCount: number; wrongCount: number }>
    const map = new Map<string, { correctCount: number; wrongCount: number }>()
    Object.entries(parsed).forEach(([key, val]) => map.set(key, val))
    return map
  } catch {
    return new Map()
  }
}

const getStoredAchievements = (): { count: number; recent: SavedAchievement[] } => {
  if (typeof window === 'undefined') return { count: 0, recent: [] }
  const saved = localStorage.getItem('slovak_achievements')
  if (!saved) return { count: 0, recent: [] }
  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return { count: 0, recent: [] }
    const recent = parsed.slice(-3).reverse() as SavedAchievement[]
    return { count: parsed.length, recent }
  } catch {
    return { count: 0, recent: [] }
  }
}

const getStoredProgressData = (): Record<string, number> => {
  if (typeof window === 'undefined') return {}
  const progress: Record<string, number> = {}
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('slovak_app_cat_progress_')) {
      const value = localStorage.getItem(key)
      if (value) {
        const originalKey = key.replace('slovak_app_', '')
        progress[originalKey] = parseInt(value, 10)
      }
    }
  })
  return progress
}

function CircularProgress({ percent, label, icon, color = "#f97316", size = 120 }: { percent: number; label: string; icon: string; color?: string; size?: number }) {
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
      className="flex flex-col items-center p-3 overflow-visible"
    >
      <div className="relative overflow-visible" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full overflow-visible">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="6" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{icon}</span>
          <span className="text-xl font-black text-gray-800 dark:text-white">{Math.round(animatedPercent)}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold mt-2 text-gray-600 dark:text-gray-300">{label}</span>
    </motion.div>
  )
}

function StatCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { unlocked } = useAchievements()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [progressData] = useState<Record<string, number>>(() => getStoredProgressData())
  const [activeDates] = useState<string[]>(() => getStoredActiveDates())
  const [wordStatsMap] = useState<Map<string, { correctCount: number; wrongCount: number }>>(() => getStoredWordStatsMap())
  const [xp] = useState<number>(() => getStoredXp())
  const [unlockedAchievementsCount] = useState<number>(() => getStoredAchievements().count)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showXpModal, setShowXpModal] = useState(false)
  const [showLevelModal, setShowLevelModal] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [recentAchievements] = useState<SavedAchievement[]>(() => getStoredAchievements().recent)

  const streak = useMemo(() => calculateStreak(activeDates), [activeDates])

  useEffect(() => {
    const handleFirstClick = () => {
      try { initAudio() } catch {}
      document.removeEventListener("click", handleFirstClick)
    }
    document.addEventListener("click", handleFirstClick)
    return () => document.removeEventListener("click", handleFirstClick)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }
      setUser(currentUser)
      try {
        const profileRef = doc(db, "users", currentUser.uid)
        const profileSnap = await getDoc(profileRef)
        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile)
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
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
    await signOut(auth)
    router.push("/login")
  }

  async function handleSaveName() {
    if (!user || !newName.trim()) return
    playClickSound()
    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, { name: newName })
      setProfile((prev) => (prev ? { ...prev, name: newName } : null))
      setEditingName(false)
    } catch (error) {
      console.error("Ошибка изменения имени:", error)
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setUploadingAvatar(true)
      const storageRef = ref(storage, `avatars/${user.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, { photoURL: downloadURL })
      setProfile((prev) => (prev ? { ...prev, photoURL: downloadURL } : null))
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

  const uniqueLearnedWords = useMemo(() => {
    return Array.from(wordStatsMap.values()).filter(stat => stat.correctCount > 0).length
  }, [wordStatsMap])

  const allItems = useMemo(() => [...words, ...grammarTasks], [])
  const categoryTotalCount = useMemo(() => {
    const counts: Record<string, number> = {}
    allItems.forEach(item => {
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
    wordStatsMap.forEach(stat => {
      correct += stat.correctCount
      wrong += stat.wrongCount
    })
    return { totalCorrect: correct, totalWrong: wrong }
  }, [wordStatsMap])
  const totalAnswers = totalCorrect + totalWrong
  const accuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : 0

  const totalWordsCount = words.length
  const wordsPercent = totalWordsCount ? (uniqueLearnedWords / totalWordsCount) * 100 : 0
  const totalCategories = Object.keys(categoryTotalCount).length
  const categoriesPercent = totalCategories ? (completedCategoriesCount / totalCategories) * 100 : 0

  const levelStats = useMemo(() => {
    const levels = ["A1", "A2", "B1", "B2", "C1"] as const
    return levels.map(level => {
      const itemsInLevel = allItems.filter(i => i.level === level)
      const total = itemsInLevel.length
      if (!total) return { level, total, learned: 0, percent: 0 }
      const cats = new Set(itemsInLevel.map(i => i.category))
      let learned = 0
      cats.forEach(cat => {
        const totalInCat = itemsInLevel.filter(i => i.category === cat).length
        const passed = progressData[`cat_progress_${level}_${cat}`] || 0
        learned += Math.min(passed, totalInCat)
      })
      return { level, total, learned, percent: (learned / total) * 100 }
    })
  }, [progressData, allItems])

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

  const today = useMemo(() => new Date(), [])
  const last30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(today.getDate() - i)
      return d.toISOString().slice(0, 10)
    }).reverse()
  }, [today])
  const activitySet = useMemo(() => new Set(activeDates), [activeDates])
  const activeDaysCount = activeDates.filter(date => last30Days.includes(date)).length

  const displayName = profile?.name || user?.displayName || "Без имени"
  const displayEmail = profile?.email || user?.email || "Email не найден"
  const photoURL = profile?.photoURL || user?.photoURL || ""
  const level = profile?.level || null

  const profileLevel = Math.floor(xp / 100) + 1
  const levelBase = profileLevel > 1 ? (profileLevel - 1) * 100 : 0
  const nextLevelXp = levelBase + 100
  const currentLevelProgress = xp - levelBase
  const progressPercent = Math.min((currentLevelProgress / 100) * 100, 100)
  const xpLeft = Math.max(nextLevelXp - xp, 0)

  // Загрузочный экран – теперь светлый фон берётся из body, тёмный задаём явно
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gradient-to-br dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
        <div className="rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-xl p-8 font-bold text-xl">
          Загрузка профиля...
        </div>
      </div>
    )
  }

  // Экран "не авторизован"
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 dark:bg-gradient-to-br dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8 text-center">
          <FaUserCircle className="mx-auto mb-4 text-7xl text-orange-500 dark:text-orange-400" />
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">Вы не вошли</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Войдите в аккаунт, чтобы открыть страницу профиля.</p>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => { playClickSound(); router.push("/login"); }} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.02]">
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

  // Основной контент – светлый фон наследуется от body (радиальный градиент), тёмный задаём явно
  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-3"
        >
          <Link href="/" onClick={() => playClickSound()} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700">
            <FaArrowLeft /> На главную
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-5 py-2.5 text-sm font-bold text-red-600 dark:text-red-300 shadow-sm transition hover:bg-red-100 dark:hover:bg-red-900/50">
            <FaSignOutAlt /> Выйти
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl bg-white dark:bg-gray-800 bg-noise shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {photoURL ? (
                        <Image
                          src={photoURL}
                          alt="Аватар"
                          width={80}
                          height={80}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><FaUserCircle className="text-4xl text-gray-500 dark:text-gray-400" /></div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-orange-500 p-1 text-white shadow-md transition hover:bg-orange-600">
                      <FaCamera className="text-xs" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                    </label>
                  </div>
                  {editingName ? (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                      <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Новое имя" className="rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1 text-gray-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-400" />
                      <button onClick={handleSaveName} className="rounded-lg bg-orange-500 px-3 py-1 text-xs font-black text-white hover:bg-orange-600 transition">Сохранить</button>
                    </div>
                  ) : (
                    <h2 className="text-lg font-black text-gray-800 dark:text-white">{displayName}</h2>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><FaEnvelope /> {displayEmail}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <span>🆔</span><span className="font-mono">{user.uid.slice(0, 8)}...</span>
                    <button onClick={() => copyToClipboard(user.uid)} className="text-gray-400 hover:text-orange-500 transition"><FaCopy size={10} /></button>
                  </p>
                  <button onClick={() => { playClickSound(); setEditingName(true); setNewName(displayName); }} className="mt-2 inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"><FaPen size={10} /> Редактировать</button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard delay={0.2}>
                <div className="rounded-xl bg-white dark:bg-gray-800 bg-noise shadow-md border border-gray-100 dark:border-gray-700 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700" onClick={() => { playClickSound(); setShowXpModal(true); }}>
                  <FaStar className="text-orange-500 text-xl mx-auto mb-1" />
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{xp}</p>
                  <p className="text-[10px] text-gray-500">XP</p>
                </div>
              </StatCard>
              <StatCard delay={0.25}>
                <div className="rounded-xl bg-white dark:bg-gray-800 bg-noise shadow-md border border-gray-100 dark:border-gray-700 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700" onClick={() => { playClickSound(); setShowLevelModal(true); }}>
                  <FaTrophy className="text-blue-500 text-xl mx-auto mb-1" />
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{level || "—"}</p>
                  <p className="text-[10px] text-gray-500">Уровень языка</p>
                </div>
              </StatCard>
              <StatCard delay={0.3}>
                <div className="rounded-xl bg-white dark:bg-gray-800 bg-noise shadow-md border border-gray-100 dark:border-gray-700 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700" onClick={() => { playClickSound(); setShowStreakModal(true); }}>
                  <FaFire className="text-red-500 text-xl mx-auto mb-1" />
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{streak}</p>
                  <p className="text-[10px] text-gray-500">{getDayWord(streak)}</p>
                </div>
              </StatCard>
              <StatCard delay={0.35}>
                <div className="rounded-xl bg-white dark:bg-gray-800 bg-noise shadow-md border border-gray-100 dark:border-gray-700 p-3 text-center cursor-pointer hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700" onClick={() => { playClickSound(); setShowAchievements(true); }}>
                  <FaCheckCircle className="text-green-500 text-xl mx-auto mb-1" />
                  <p className="text-2xl font-black text-gray-800 dark:text-white">{unlockedAchievementsCount}/{achievements.length}</p>
                  <p className="text-[10px] text-gray-500">Достижения</p>
                </div>
              </StatCard>
            </div>
<StatCard delay={0.4}>
  <ActivityHeatmap activeDates={activeDates} days={30} />
</StatCard>
          </div>

          {/* Правая колонка */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard delay={0.25}>
                <div className="rounded-2xl bg-white dark:bg-gray-800 bg-noise shadow-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
                  <CircularProgress percent={wordsPercent} label="Слов изучено" icon="📚" color="#f97316" size={110} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{uniqueLearnedWords} из {totalWordsCount}</p>
                </div>
              </StatCard>
              <StatCard delay={0.3}>
                <div className="rounded-2xl bg-white dark:bg-gray-800 bg-noise shadow-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
                  <CircularProgress percent={categoriesPercent} label="Тем завершено" icon="🏆" color="#3b82f6" size={110} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{completedCategoriesCount} из {totalCategories}</p>
                </div>
              </StatCard>
              <StatCard delay={0.35}>
                <div className="rounded-2xl bg-white dark:bg-gray-800 bg-noise shadow-xl border border-gray-100 dark:border-gray-700 p-4 text-center">
                  <CircularProgress percent={accuracy} label="Точность" icon="🎯" color="#22c55e" size={110} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{totalCorrect} из {totalAnswers} ответов</p>
                </div>
              </StatCard>
            </div>

            <StatCard delay={0.4}>
              <div className="rounded-xl bg-white dark:bg-gray-800 bg-noise shadow-md border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaUserFriends className="text-indigo-500 text-lg" />
                    <h3 className="font-black text-gray-800 dark:text-white text-sm">Друзья</h3>
                  </div>
                  <button className="text-xs bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full text-orange-600 dark:text-orange-400 opacity-60 cursor-not-allowed">Пригласить</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 opacity-60">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <FaUserCircle className="text-base" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-3">Приглашайте друзей, чтобы соревноваться</p>
              </div>
            </StatCard>

            {recentAchievements.length > 0 && (
              <StatCard delay={0.45}>
                <div className="rounded-xl bg-white dark:bg-gray-800 bg-noise shadow-md border border-gray-100 dark:border-gray-700 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTrophy className="text-yellow-500 text-lg" />
                    <h3 className="font-black text-gray-800 dark:text-white text-sm">Недавние достижения</h3>
                  </div>
                  <div className="space-y-1">
                    {recentAchievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <FaMedal className="text-yellow-500 text-xs" />
                        <span>{typeof ach === 'string' ? ach : ach.title || ach.name || 'Достижение'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </StatCard>
            )}
          </div>
        </div>
      </div>

      {/* Модалки */}
      <AnimatePresence>
        {showXpModal && (
          <div key="xp-modal" className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowXpModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <h2 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2"><FaStar className="text-orange-500" /> Прогресс уровня профиля</h2>
                <button onClick={() => { playClickSound(); setShowXpModal(false); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><FaTimes size={20} /></button>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="text-5xl font-black text-orange-500">{profileLevel}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">текущий уровень профиля</p>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">XP набрано</span>
                  <span className="text-orange-500 font-bold">{xp} / {nextLevelXp}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1 mb-2">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>до следующего уровня</span>
                  <span className="font-bold text-orange-500">{xpLeft} XP</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  💡 За выполнение заданий вы получаете XP. Каждые 100 XP повышают уровень профиля.
                </div>
              </div>
              <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button onClick={() => { playClickSound(); setShowXpModal(false); }} className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:shadow-lg transition">Закрыть</button>
              </div>
            </motion.div>
          </div>
        )}

        {showLevelModal && (
          <div key="level-modal" className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowLevelModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-2xl w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2"><FaGraduationCap className="text-orange-500" /> Прогресс по уровням языка</h2>
                <button onClick={() => { playClickSound(); setShowLevelModal(false); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><FaTimes size={20} /></button>
              </div>
              <div className="p-5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4 mb-6">
                  {levelStats.map(stat => (
                    <div key={stat.level}>
                      <div className="flex justify-between text-sm font-bold mb-1"><span className="text-gray-700 dark:text-gray-300">{stat.level}</span><span className="text-gray-500 dark:text-gray-400">{stat.learned}/{stat.total} слов</span></div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all" style={{ width: `${stat.percent}%` }} /></div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold mt-4 mb-2 flex items-center gap-2 text-gray-800 dark:text-white"><FaSkull className="text-red-500" /> Сложные слова</h3>
                {hardWords.length > 0 ? (
                  <div className="space-y-2">
                    {hardWords.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                        <div><p className="font-bold text-sm text-gray-800 dark:text-white">{item.word}</p><p className="text-xs text-gray-500 dark:text-gray-400">{item.translation}</p></div>
                        <div className="text-xs"><span className="text-red-500">✗{item.wrong}</span> <span className="text-green-600">✓{item.correct}</span></div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500 dark:text-gray-400">Нет данных</p>}
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button onClick={() => { playClickSound(); setShowLevelModal(false); }} className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl">Закрыть</button>
              </div>
            </motion.div>
          </div>
        )}

        {showStreakModal && (
          <StreakModal
            key="streak-modal"
            isOpen={showStreakModal}
            onClose={() => setShowStreakModal(false)}
            currentStreak={streak}
            activeDates={activeDates}
          />
        )}

        {showAchievements && (
          <div key="achievements-modal" className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAchievements(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2"><FaGem className="text-orange-500" /> Достижения</h2>
                <button onClick={() => { playClickSound(); setShowAchievements(false); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><FaTimes size={20} /></button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <AchievementsList unlocked={unlocked} />
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <button onClick={() => { playClickSound(); setShowAchievements(false); }} className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl">Закрыть</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}