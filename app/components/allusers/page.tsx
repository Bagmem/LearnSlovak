"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaArrowLeft, FaUsers, FaUserCircle, FaStar } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"
import { playClickSound } from "../../../lib/sounds"

type Profile = {
  id: string
  name: string | null
  level: string | null
  xp: number | null
  avatar_url: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name, level, xp, avatar_url")
          .order("xp", { ascending: false })

        if (error) throw error
        if (!isMounted) return

        setUsers(data || [])
      } catch (err) {
        console.error("Ошибка загрузки пользователей:", err)
        if (!isMounted) return
        setError("Не удалось загрузить пользователей. Попробуйте позже.")
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    loadUsers()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-[#1a1b3a] dark:to-[#0a0f2a]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white">
              Все пользователи
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Нажмите на аватар или имя, чтобы открыть публичный профиль.
            </p>
          </div>

          <Link
            href="/"
            onClick={() => playClickSound()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FaArrowLeft /> На главную
          </Link>
        </motion.div>

        <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              Пользователей пока нет.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900/80 p-5 shadow-sm"
                >
                  <Link
                    href={`/users/${user.id}`}
                    onClick={() => playClickSound()}
                    className="group flex flex-col items-center gap-4 text-center"
                  >
                    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 ring-4 ring-orange-100 dark:ring-orange-900/40 shadow-md transition duration-200 group-hover:scale-[1.02]">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name || "Аватар пользователя"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-5xl text-gray-500 dark:text-gray-400" />
                      )}
                    </div>

                    <div>
                      <p className="text-lg font-black text-gray-800 dark:text-white truncate">
                        {user.name || "Пользователь"}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                        {user.level || "Уровень не задан"}
                      </p>
                    </div>
                  </Link>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">XP</span>
                    <span>{user.xp ?? 0}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
