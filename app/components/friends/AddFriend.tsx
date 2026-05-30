"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { FaSearch, FaUserPlus, FaUserCircle, FaHashtag } from "react-icons/fa"
import { supabase } from "../../../lib/supabase"

type Profile = {
  id: string
  name: string
  level: string | null
  avatar_url: string | null
}

export default function AddFriend() {
  const [mode, setMode] = useState<"name" | "id">("name")
  const [query, setQuery] = useState("")
  const [friendId, setFriendId] = useState("")
  const [results, setResults] = useState<Profile[]>([])
  const [searching, setSearching] = useState(false)
  const [message, setMessage] = useState("")
  const [idMessage, setIdMessage] = useState("")

  // Поиск по имени
  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setMessage("")
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, level, avatar_url")
        .ilike("name", `%${query}%`)
        .limit(5)

      if (error) throw error
      setResults(data || [])
    } catch (err) {
      console.error("Search failed:", err)
      setMessage("Ошибка при поиске")
    } finally {
      setSearching(false)
    }
  }

  // Отправка заявки по имени (из результатов поиска)
  const sendRequest = async (addresseeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("friendships")
        .insert({
          requester_id: user.id,
          addressee_id: addresseeId,
          status: "pending"
        })

      if (error) {
        if (error.code === "23505") {
          setMessage("Заявка уже отправлена или вы уже друзья")
        } else {
          throw error
        }
      } else {
        setMessage("Заявка отправлена!")
        setResults(prev => prev.filter(p => p.id !== addresseeId))
      }
    } catch (err) {
      console.error("Failed to send request:", err)
      setMessage("Ошибка при отправке заявки")
    }
  }

  // Добавление по ID
  const handleAddById = async () => {
    const trimmedId = friendId.trim()
    if (!trimmedId) return
    setIdMessage("")
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Проверяем существование профиля
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", trimmedId)
        .maybeSingle()

      if (profileError || !profile) {
        setIdMessage("Пользователь с таким ID не найден")
        return
      }

      // Проверяем, не пытаемся ли добавить себя
      if (profile.id === user.id) {
        setIdMessage("Нельзя добавить самого себя")
        return
      }

      // Отправляем заявку
      const { error: insertError } = await supabase
        .from("friendships")
        .insert({
          requester_id: user.id,
          addressee_id: profile.id,
          status: "pending"
        })

      if (insertError) {
        if (insertError.code === "23505") {
          setIdMessage("Заявка уже отправлена или вы уже друзья")
        } else {
          throw insertError
        }
      } else {
        setIdMessage("Заявка отправлена!")
        setFriendId("")
      }
    } catch (err) {
      console.error("Failed to add friend by ID:", err)
      setIdMessage("Ошибка при отправке заявки")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-xl p-5"
    >
      <h3 className="font-black text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaUserPlus className="text-orange-500" /> Добавить друга
      </h3>

      {/* Переключатель режимов */}
      <div className="flex mb-4 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
        <button
          onClick={() => setMode("name")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === "name"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaSearch className="inline mr-1" size={12} /> По имени
        </button>
        <button
          onClick={() => setMode("id")}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === "id"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FaHashtag className="inline mr-1" size={12} /> По ID
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "name" ? (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="flex-1 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-3 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <FaSearch />
              </button>
            </div>
            {message && (
              <p className="text-sm text-center mb-2 text-orange-500">{message}</p>
            )}
            {results.length > 0 && (
              <div className="space-y-2">
                {results.map(profile => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-gray-700/50"
                  >
                    <Link href={`/users/${profile.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0 transition-transform hover:scale-105">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FaUserCircle className="text-gray-500 dark:text-gray-400 text-lg" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{profile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Уровень: {profile.level || "—"}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => sendRequest(profile.id)}
                      className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs font-bold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition"
                    >
                      + Добавить
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="id"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Введите ID пользователя"
                value={friendId}
                onChange={e => setFriendId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleAddById}
                className="px-3 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <FaUserPlus />
              </button>
            </div>
            {idMessage && (
              <p className="text-sm text-center text-orange-500">{idMessage}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}