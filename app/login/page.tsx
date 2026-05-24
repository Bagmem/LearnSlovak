"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { FaEnvelope, FaGoogle, FaLock, FaSignInAlt } from "react-icons/fa"
import { auth, db } from "../../lib/firebase"
import AuthShell from "../components/AuthShell"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function createProfileIfMissing(user: {
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
  }) {
    const profileRef = doc(db, "users", user.uid)
    const profileSnap = await getDoc(profileRef)

    if (profileSnap.exists()) {
      return
    }

    await setDoc(profileRef, {
      uid: user.uid,
      name: user.displayName || "Без имени",
      email: user.email || "",
      photoURL: user.photoURL || "",
      xp: 0,
      level: "A1",
      createdAt: serverTimestamp(),
    })
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError("")
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      await createProfileIfMissing(result.user)

      router.push("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа через Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Вход"
      subtitle="Войди в аккаунт и продолжи изучение словацкого"
      icon={<FaSignInAlt className="text-2xl text-white" />}
      backgroundImage="/bratislava2.png"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-gray-100">
            Email
          </span>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 focus-within:border-orange-400">
            <FaEnvelope className="text-gray-300" />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              type="email"
              required
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-300"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-gray-100">
            Пароль
          </span>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 focus-within:border-orange-400">
            <FaLock className="text-gray-300" />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              type="password"
              required
              className="w-full bg-transparent text-white outline-none placeholder:text-gray-300"
            />
          </div>
        </label>

        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-black text-white shadow-lg transition hover:scale-[1.01] hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Входим..." : "Войти"}
        </button>

        <button
          disabled={loading}
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 py-3 font-black text-white shadow-lg transition hover:scale-[1.01] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaGoogle />
          Войти через Google
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/15 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-200">
        Нет аккаунта?{" "}
        <Link
          href="/register"
          className="font-black text-orange-300 hover:text-orange-200"
        >
          Зарегистрироваться
        </Link>
      </p>
    </AuthShell>
  )
}