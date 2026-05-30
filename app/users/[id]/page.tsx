"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FaArrowLeft,
  FaUserCircle,
  FaTrophy,
  FaStar,
  FaFire,
  FaMedal,
  FaLock,
} from "react-icons/fa"
import { supabase } from "../../../lib/supabase"
import { playClickSound } from "../../../lib/sounds"

type PublicProfile = {
  id: string
  name: string | null
  avatar_url: string | null
  xp: number | null
  level: string | null
}

function getDisplayName(profile: PublicProfile | null): string {
  if (!profile) return "Пользователь"
  return profile.name || "Пользователь"
}

function getProfileLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}

export default function PublicUserProfilePage() {
  const params = useParams()
  const router = useRouter()

  const userId = typeof params.id === "string" ? params.id : ""

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!userId) {
        setNotFound(true)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, avatar_url, xp, level")
          .eq("id", userId)
          .maybeSingle()

        if (error) throw error

        if (!isMounted) return

        if (!data) {
          setNotFound(true)
          setProfile(null)
        } else {
          setProfile(data as PublicProfile)
          setNotFound(false)
        }
      } catch (error) {
        console.error("Ошибка загрузки публичного профиля:", error)
        if (!isMounted) return
        setNotFound(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [userId])

  const displayName = getDisplayName(profile)
  const xp = profile?.xp || 0
  const languageLevel = profile?.level || "A1"
  const profileLevel = getProfileLevel(xp)
  const currentLevelXp = xp % 100
  const progressPercent = Math.min(currentLevelXp, 100)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
        <div className="rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-xl p-8 font-bold text-xl">
          Загрузка профиля...
        </div>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
        <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <FaUserCircle className="mx-auto mb-4 text-7xl text-orange-500 dark:text-orange-400" />

          <h1 className="text-3xl font-black text-gray-800 dark:text-white">
            Профиль не найден
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Возможно, пользователь был удалён или ссылка неправильная.
          </p>

          <button
            onClick={() => {
              playClickSound()
              router.push("/allusers")
            }}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.02]"
          >
            К списку пользователей
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-wrap gap-3"
        >
          <Link
            href="/"
            onClick={() => playClickSound()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FaArrowLeft />
            На главную
          </Link>

          <Link
            href="/allusers"
            onClick={() => playClickSound()}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 text-sm font-bold text-orange-600 dark:text-orange-300 shadow-sm transition hover:bg-orange-100 dark:hover:bg-orange-900/40"
          >
            Все пользователи
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="lg:col-span-1"
          >
            <div className="rounded-3xl bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 text-center">
              <div className="mx-auto h-28 w-28 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 ring-4 ring-orange-200/70 dark:ring-orange-800/50 shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Аватар"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FaUserCircle className="text-6xl text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-black text-gray-800 dark:text-white">
                {displayName}
              </h1>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Публичный профиль
              </p>

              <div className="mt-5 rounded-2xl border border-orange-200/70 bg-orange-50/70 p-4 dark:border-orange-800/40 dark:bg-orange-950/20">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                  Уровень языка
                </p>
                <p className="mt-1 text-4xl font-black text-gray-800 dark:text-white">
                  {languageLevel}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                  <FaStar className="text-orange-500" />
                </div>
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">
                  XP
                </p>
                <p className="mt-1 text-3xl font-black text-gray-800 dark:text-white">
                  {xp}
                </p>
              </div>

              <div className="rounded-2xl bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                  <FaTrophy className="text-orange-500" />
                </div>
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">
                  Профиль
                </p>
                <p className="mt-1 text-3xl font-black text-gray-800 dark:text-white">
                  Lv. {profileLevel}
                </p>
              </div>

              <div className="rounded-2xl bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                  <FaFire className="text-orange-500" />
                </div>
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase">
                  Статус
                </p>
                <p className="mt-1 text-3xl font-black text-gray-800 dark:text-white">
                  Active
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
                  <FaMedal className="text-orange-500" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-gray-800 dark:text-white">
                    Прогресс профиля
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    До следующего уровня профиля
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                <span>{currentLevelXp} XP</span>
                <span>100 XP</span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white/75 dark:bg-gray-800/75 backdrop-blur-sm shadow-md border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                  <FaLock className="text-gray-500 dark:text-gray-300" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-gray-800 dark:text-white">
                    Детальная статистика скрыта
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Публично показываются только имя, аватар, XP и уровень. Личные данные не отображаются.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}