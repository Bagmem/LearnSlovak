import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser()

      if (!isMounted) return

      if (error) {
        console.error("Ошибка загрузки пользователя:", error)
        setUser(null)
        return
      }

      setUser(currentUser)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return

      setUser(session?.user ?? null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return user
}