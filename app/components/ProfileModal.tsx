"use client"

import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {
  FaArrowLeft,
  FaCamera,
  FaEnvelope,
  FaFire,
  FaPen,
  FaSignOutAlt,
  FaStar,
  FaTrophy,
  FaUserCircle,
  FaCalendarAlt,
  FaSkull,
  FaGraduationCap,
  FaCheckCircle,
  FaTimes,
  FaCopy,
} from "react-icons/fa"
import { auth, db, storage } from "../../lib/firebase"
import { useTheme } from "../../hooks/useTheme"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { achievements } from "../../data/achievements"
import { useAchievements } from "../../hooks/useAchievements"
import AchievementsList from "../components/AchievementsList"

type UserProfile = {
  uid: string
  name: string
  email: string
  photoURL: string
  xp: number
  level: string | null
}

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: string | number
  accentClass: string
  isDark: boolean
  onClick?: () => void
  clickable?: boolean
}

function StatCard({ icon, label, value, accentClass, isDark, onClick, clickable }: StatCardProps) {
  const Wrapper = clickable ? "button" : "div"
  return (
    <Wrapper
      onClick={onClick}
      className={`rounded-2xl border p-4 shadow-lg transition-all hover:shadow-xl ${
        clickable ? "cursor-pointer hover:scale-[1.02]" : ""
      } ${isDark ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}
    >
      <div className={`mb-2 flex items-center gap-2 text-sm font-bold ${accentClass}`}>
        {icon}
        <span className="text-gray-700 dark:text-gray-200">{label}</span>
      </div>
      <p className={`text-3xl font-black ${isDark ? "text-white" : "text-gray-800"}`}>{value}</p>
    </Wrapper>
  )
}

export default function ProfilePage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const router = useRouter()
  const { unlocked } = useAchievements()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [progressData, setProgressData] = useState<Record<string, number>>({})
  const [activeDates, setActiveDates] = useState<string[]>([])
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, { correctCount: number; wrongCount: number }>>(new Map())
  const [xp, setXp] = useState<number>(0)
  const [unlockedAchievementsCount, setUnlockedAchievementsCount] = useState<number>(0)
  const [showAchievements, setShowAchievements] = useState(false)

  const forceSaveWordStats = () => {
    const obj: Record<string, any> = {}
    wordStatsMap.forEach((value, key) => {
      obj[key] = { correctCount: value.correctCount, wrongCount: value.wrongCount }
    })
    localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
  }

  useEffect(() => {
    const savedXp = localStorage.getItem("xp")
    if (savedXp) setXp(parseInt(savedXp, 10))

    const savedDates = localStorage.getItem("slovak_active_dates")
    if (savedDates) setActiveDates(JSON.parse(savedDates))

    const savedStats = localStorage.getItem("slovak_word_stats")
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats)
        const map = new Map()
        Object.entries(parsed).forEach(([key, val]: [string, any]) => {
          map.set(key, { correctCount: val.correctCount, wrongCount: val.wrongCount })
        })
        setWordStatsMap(map)
      } catch {}
    }

    const savedAchievements = localStorage.getItem("slovak_achievements")
    if (savedAchievements) {
      try {
        setUnlockedAchievementsCount(JSON.parse(savedAchievements).length)
      } catch {}
    }

    const progress: Record<string, number> = {}
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith("slovak_app_cat_progress_")) {
        const value = localStorage.getItem(key)
        if (value) {
          const originalKey = key.replace("slovak_app_", "")
          progress[originalKey] = parseInt(value, 10)
        }
      }
    })
    setProgressData(progress)
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

  async function handleLogout() {
    forceSaveWordStats()
    await signOut(auth)
    router.push("/login")
  }

  async function handleSaveName() {
    if (!user || !newName.trim()) return
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
    navigator.clipboard.writeText(text)
  }

  const allItems = useMemo(() => [...words, ...grammarTasks], [])
  const categoryTotalCount = useMemo(() => {
    const counts: Record<string, number> = {}
    allItems.forEach(item => {
      const key = `${item.level}_${item.category}`
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [allItems])

  const studiedCategoriesCount = useMemo(() => {
    let count = 0
    Object.entries(progressData).forEach(([key, passed]) => {
      const total = categoryTotalCount[key] || 1
      if (passed >= total) count++
    })
    return count
  }, [progressData, categoryTotalCount])

  const totalLearnedWords = useMemo(() => {
    let sum = 0
    Object.entries(progressData).forEach(([key, passed]) => {
      const total = categoryTotalCount[key] || 1
      sum += Math.min(passed, total)
    })
    return sum
  }, [progressData, categoryTotalCount])

  const hardWords = useMemo(() => {
    const wordsList: { word: string; translation: string; wrong: number; correct: number }[] = []
    wordStatsMap.forEach((stat, key) => {
      if (stat.wrongCount > 0 || stat.correctCount > 0) {
        const [slovak, russian] = key.split("|")
        wordsList.push({ word: slovak, translation: russian, wrong: stat.wrongCount, correct: stat.correctCount })
      }
    })
    wordsList.sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
    return wordsList.slice(0, 3)
  }, [wordStatsMap])

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
  const streak = activeDates.length

  const levelBase = Math.floor(xp / 100) * 100
  const nextLevelXp = levelBase + 100
  const currentLevelProgress = xp - levelBase
  const progressPercent = Math.min((currentLevelProgress / 100) * 100, 100)
  const xpLeft = Math.max(nextLevelXp - xp, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/90 p-6 text-lg font-bold text-gray-800 dark:text-white shadow-lg">
          Загрузка профиля...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/90 p-6 text-center shadow-lg">
          <FaUserCircle className="mx-auto mb-4 text-7xl text-gray-400" />
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">Вы не вошли</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Войдите в аккаунт, чтобы открыть страницу профиля.</p>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={() => router.push("/login")} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.01]">
              Войти
            </button>
            <Link href="/" className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 text-center font-bold text-gray-800 dark:text-white transition hover:bg-gray-100 dark:hover:bg-gray-700">
              На главную
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-100"}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold shadow transition ${isDark ? "border-gray-700 bg-gray-900/80 hover:bg-gray-800" : "border-gray-200 bg-white/80 hover:bg-gray-100"}`}>
            <FaArrowLeft className="text-gray-800 dark:text-white" /> 
            <span className="text-gray-800 dark:text-white">На главную</span>
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 shadow transition hover:bg-red-500/20">
            <FaSignOutAlt /> Выйти
          </button>
        </div>

        <div className={`overflow-hidden rounded-[28px] border shadow-2xl ${isDark ? "border-gray-700 bg-gray-950/80" : "border-gray-200 bg-white/80"}`}>
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white/25 bg-white/15 shadow-xl">
                  {photoURL ? (
                    <img src={photoURL} alt="Аватар" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FaUserCircle className="text-7xl text-white" />
                    </div>
                  )}
                  <label className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-black/45 p-2 text-white backdrop-blur transition hover:bg-black/60">
                    <FaCamera className="text-xs" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-white/80">Профиль пользователя</p>
                  {editingName ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Новое имя" className="rounded-2xl border border-white/20 bg-black/20 px-4 py-2 text-white outline-none" />
                      <button onClick={handleSaveName} className="rounded-2xl bg-white px-4 py-2 font-black text-black">Сохранить</button>
                    </div>
                  ) : (
                    <h1 className="text-3xl font-black text-white md:text-4xl">{displayName}</h1>
                  )}
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/85">
                    <FaEnvelope /> {displayEmail}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
                    <span>🆔 ID:</span>
                    <span className="font-mono">{user.uid}</span>
                    <button
                      onClick={() => copyToClipboard(user.uid)}
                      className="ml-1 text-white/50 hover:text-white transition"
                      title="Копировать ID"
                    >
                      <FaCopy size={12} />
                    </button>
                  </p>
                </div>
              </div>
              <button onClick={() => { setEditingName(true); setNewName(displayName) }} className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-black text-white shadow-lg backdrop-blur transition hover:bg-white/20">
                <FaPen /> Редактировать профиль
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard icon={<FaStar />} label="XP" value={xp} accentClass="text-orange-300" isDark={isDark} />
              <StatCard icon={<FaTrophy />} label="Уровень" value={level || "—"} accentClass="text-blue-300" isDark={isDark} />
              <StatCard icon={<FaFire />} label="Серия" value={`${streak} дн.`} accentClass="text-red-300" isDark={isDark} />
              <StatCard
                icon={<FaCheckCircle />}
                label="Достижения"
                value={`${unlockedAchievementsCount}/${achievements.length}`}
                accentClass="text-green-300"
                isDark={isDark}
                clickable
                onClick={() => setShowAchievements(true)}
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className={`rounded-3xl border p-5 shadow-lg ${isDark ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}>
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-800 dark:text-white">
                  <FaGraduationCap className="text-purple-500" /> Прогресс по уровням
                </h3>
                <div className="mt-3 space-y-3">
                  {levelStats.map(stat => (
                    <div key={stat.level}>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-700 dark:text-gray-300">{stat.level}</span>
                        <span className="text-gray-500 dark:text-gray-400">{stat.learned}/{stat.total} слов</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all" style={{ width: `${stat.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-3xl border p-5 shadow-lg ${isDark ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}>
                <h3 className="flex items-center gap-2 text-lg font-black text-gray-800 dark:text-white">
                  <FaSkull className="text-red-500" /> Самые сложные слова
                </h3>
                {hardWords.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {hardWords.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white">{item.word}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.translation}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-red-500">Ошибок: {item.wrong}</span><br />
                          <span className="text-xs text-green-500">Правильно: {item.correct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Пока нет данных</p>
                )}
              </div>
            </div>

            <div className={`mt-6 rounded-3xl border p-5 shadow-lg ${isDark ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}>
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-800 dark:text-white">
                <FaCalendarAlt className="text-orange-500" /> Активность за 30 дней
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Занимались {activeDaysCount} из 30 дней</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {last30Days.map(day => {
                  const isActive = activitySet.has(day)
                  const dayNum = new Date(day).getDate()
                  return (
                    <div key={day} className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${isActive ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`} title={day}>
                      {dayNum}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`mt-6 rounded-3xl border p-5 shadow-lg ${isDark ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-gray-800 dark:text-white">Прогресс до следующего уровня</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Продолжай учиться и зарабатывай XP.</p>
                </div>
                <div className={`rounded-2xl px-4 py-2 text-sm font-bold ${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {xp} / {nextLevelXp} XP
                </div>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Осталось <span className="font-bold text-white">{xpLeft} XP</span> до следующего уровня.</p>
            </div>
          </div>
        </div>
      </div>

      {showAchievements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" onClick={() => setShowAchievements(false)}>
          <div
            className={`rounded-2xl w-full max-w-md shadow-2xl border overflow-hidden animate-slideInScale ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
              }`}
            >
              <h2 className={`text-lg font-black ${isDark ? "text-white" : "text-gray-800"}`}>Достижения</h2>
              <button
                onClick={() => setShowAchievements(false)}
                className={isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <AchievementsList unlocked={unlocked} />
            </div>
            <div
              className={`p-4 border-t ${
                isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
              }`}
            >
              <button
                onClick={() => setShowAchievements(false)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}