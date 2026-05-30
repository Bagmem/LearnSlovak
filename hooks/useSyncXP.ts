import { useEffect, useRef, useCallback, useState } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useSyncXP(
  user: User | null,
  xp: number,
  setXp: React.Dispatch<React.SetStateAction<number>>
) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSyncedXpRef = useRef<number | null>(null)
  const [initialized, setInitialized] = useState(false)

  const sendImmediately = useCallback(async () => {
    if (!user) return
    if (lastSyncedXpRef.current === xp) return
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, xp }, { onConflict: "id" })
    if (!error) {
      lastSyncedXpRef.current = xp
    }
  }, [user, xp])

  useEffect(() => {
    if (!user) {
      lastSyncedXpRef.current = null
      setInitialized(false)
      return
    }

    const fetchXp = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("xp")
        .eq("id", user.id)
        .maybeSingle()

      if (error) {
        console.error("Ошибка загрузки XP из profiles:", error)
        setInitialized(true)
        return
      }

      const serverXp = data?.xp ?? 0
      if (serverXp > xp) {
        setXp(serverXp)
        lastSyncedXpRef.current = serverXp
      } else {
        lastSyncedXpRef.current = xp
        if (xp > serverXp) {
          await sendImmediately()
        }
      }
      setInitialized(true)
    }

    fetchXp()
  }, [user?.id])

  const syncXpToServer = useCallback(
    (newXp: number) => {
      if (!user) return
      if (lastSyncedXpRef.current === newXp) return

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(async () => {
        await sendImmediately()
      }, 2000)
    },
    [user, sendImmediately]
  )

  useEffect(() => {
    syncXpToServer(xp)
  }, [xp, syncXpToServer])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      sendImmediately()
    }
  }, [sendImmediately])

  const flush = useCallback(async () => {
    if (!user) return
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    await sendImmediately()
  }, [user, sendImmediately])

  return { flush, initialized }
}