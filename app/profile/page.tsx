"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
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
} from "react-icons/fa"
import { auth, db } from "../../lib/firebase"

type UserProfile = {
  uid: string
  name: string
  email: string
  photoURL: string
  xp: number
  level: string
}

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: string | number
  accentClass: string
}

function StatCard({ icon, label, value, accentClass }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-4 shadow-lg">
      <div className={`mb-2 flex items-center gap-2 text-sm font-bold ${accentClass}`}>
        {icon}
        <span>{label}</span>
      </div>

      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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
    await signOut(auth)
    router.push("/login")
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.20),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(3,7,18,1))]" />

        <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl border border-gray-700 bg-gray-900/90 px-8 py-6 text-lg font-bold shadow-2xl">
            Загрузка профиля...
          </div>
        </section>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.20),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(3,7,18,1))]" />

        <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-700 bg-gray-900/90 p-6 text-center shadow-2xl">
            <FaUserCircle className="mx-auto mb-4 text-7xl text-gray-400" />

            <h1 className="text-3xl font-black">Вы не вошли</h1>

            <p className="mt-2 text-sm text-gray-400">
              Войдите в аккаунт, чтобы открыть страницу профиля.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.01] hover:from-orange-600 hover:to-amber-600"
              >
                Войти
              </button>

              <Link
                href="/"
                className="w-full rounded-2xl border border-gray-700 bg-gray-800 py-3 text-center font-bold text-white hover:bg-gray-700"
              >
                На главную
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const displayName = profile?.name || user.displayName || "Без имени"
  const displayEmail = profile?.email || user.email || "Email не найден"
  const photoURL = profile?.photoURL || user.photoURL || ""
  const xp = profile?.xp ?? 0
  const level = profile?.level || "A1"

  const levelBase = Math.floor(xp / 100) * 100
  const nextLevelXp = levelBase + 100
  const currentLevelProgress = xp - levelBase
  const progressPercent = Math.min((currentLevelProgress / 100) * 100, 100)
  const xpLeft = Math.max(nextLevelXp - xp, 0)

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.20),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(17,24,39,0.96),_rgba(3,7,18,1))]" />

      <section className="relative z-10 mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-gray-800"
          >
            <FaArrowLeft />
            На главную
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 shadow transition hover:bg-red-500/20"
          >
            <FaSignOutAlt />
            Выйти
          </button>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-gray-700 bg-gray-950/80 shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-white/25 bg-white/15 shadow-xl">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Аватар"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FaUserCircle className="text-7xl text-white" />
                    </div>
                  )}

                  <button
                    type="button"
                    className="absolute bottom-2 right-2 rounded-full bg-black/45 p-2 text-white backdrop-blur transition hover:bg-black/60"
                    title="Смена аватара будет добавлена позже"
                  >
                    <FaCamera className="text-xs" />
                  </button>
                </div>

                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                    Профиль пользователя
                  </p>

                  <h1 className="text-3xl font-black text-white md:text-4xl">
                    {displayName}
                  </h1>

                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/85">
                    <FaEnvelope />
                    {displayEmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-black text-white shadow-lg backdrop-blur transition hover:bg-white/20"
                title="Редактирование профиля будет добавлено позже"
              >
                <FaPen />
                Редактировать профиль
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<FaStar />}
                label="XP"
                value={xp}
                accentClass="text-orange-300"
              />

              <StatCard
                icon={<FaTrophy />}
                label="Уровень"
                value={level}
                accentClass="text-blue-300"
              />

              <StatCard
                icon={<FaFire />}
                label="Серия"
                value="0 дней"
                accentClass="text-red-300"
              />
            </div>

            <div className="mt-6 rounded-3xl border border-gray-700 bg-gray-900/80 p-5 shadow-lg">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Прогресс до следующего уровня
                  </h2>

                  <p className="text-sm text-gray-400">
                    Продолжай учиться и зарабатывай XP.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-800 px-4 py-2 text-sm font-bold text-white">
                  {xp} / {nextLevelXp} XP
                </div>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-400">
                Осталось{" "}
                <span className="font-black text-white">{xpLeft} XP</span>{" "}
                до следующего уровня.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-700 bg-gray-900/80 p-5 shadow-lg">
                <h3 className="text-lg font-black text-white">Быстрые действия</h3>

                <p className="mt-1 text-sm text-gray-400">
                  Здесь позже можно будет редактировать профиль и менять аватар.
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-left font-bold text-white transition hover:bg-gray-700"
                  >
                    Изменить имя
                  </button>

                  <button
                    type="button"
                    className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-left font-bold text-white transition hover:bg-gray-700"
                  >
                    Загрузить новый аватар
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-700 bg-gray-900/80 p-5 shadow-lg">
                <h3 className="text-lg font-black text-white">О профиле</h3>

                <p className="mt-1 text-sm text-gray-400">
                  Тут позже можно добавить друзей, достижения, статистику и магазин.
                </p>

                <div className="mt-4 space-y-3 text-sm text-gray-100">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-800 px-4 py-3">
                    <span className="text-gray-300">ID пользователя</span>
                    <span className="max-w-[160px] truncate font-bold">
                      {profile?.uid || user.uid}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-800 px-4 py-3">
                    <span className="text-gray-300">Email подтверждён</span>
                    <span className="font-bold">
                      {user.emailVerified ? "Да" : "Нет"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-800 px-4 py-3">
                    <span className="text-gray-300">Аккаунт активен</span>
                    <span className="font-bold">Да</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}