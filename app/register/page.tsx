"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import { FaEnvelope, FaLock, FaUserPlus, FaUser } from "react-icons/fa"
import AuthShell from "../components/AuthShell"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    setError("")
    setMessage("")
    setLoading(true)

    try {
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: trimmedName,
            full_name: trimmedName,
          },
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (!data.session) {
        setMessage("Аккаунт создан. Проверь email для подтверждения.")
        return
      }

      router.push("/profile")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Регистрация"
      subtitle="Создай аккаунт и сохраняй свой прогресс"
      backgroundImage="/images/auth-bg.jpg"
      icon={<FaUserPlus className="text-2xl text-white" />}
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-gray-100">Имя</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 focus-within:border-orange-400">
            <FaUser className="text-gray-300" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Твоё имя"
              required
              disabled={loading}
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-gray-100">Email</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 focus-within:border-orange-400">
            <FaEnvelope className="text-gray-300" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              type="email"
              required
              disabled={loading}
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-gray-100">Пароль</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 focus-within:border-orange-400">
            <FaLock className="text-gray-300" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              type="password"
              minLength={6}
              required
              disabled={loading}
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </label>

        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.01] hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Создаём..." : "Создать профиль"}
        </button>
      </form>

      {message && (
        <div className="mt-4 rounded-2xl border border-green-400/40 bg-green-500/15 p-3 text-sm text-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/15 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-200">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-black text-orange-300 hover:text-orange-200">
          Войти
        </Link>
      </p>
    </AuthShell>
  )
}