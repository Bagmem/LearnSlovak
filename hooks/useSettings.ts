import { useState, useEffect, useCallback, useRef } from "react"

export type Settings = {
  isMuted: boolean
  speechRate: number
  autoSpeakOnCorrect: boolean
}

const DEFAULT_SETTINGS: Settings = {
  isMuted: false,
  speechRate: 0.9,
  autoSpeakOnCorrect: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const isMountedRef = useRef(false)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = localStorage.getItem("slovak_settings")
    if (!saved) return

    try {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
    } catch {
      setSettings(DEFAULT_SETTINGS)
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    localStorage.setItem("slovak_settings", JSON.stringify(settings))
  }, [settings])

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleMute = useCallback(() => {
    setSettings(prev => ({ ...prev, isMuted: !prev.isMuted }))
  }, [])

  const setSpeechRate = useCallback((rate: number) => {
    setSettings(prev => ({ ...prev, speechRate: Math.min(1.5, Math.max(0.5, rate)) }))
  }, [])

  const setAutoSpeak = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, autoSpeakOnCorrect: enabled }))
  }, [])

  return {
    settings,
    updateSetting,
    toggleMute,
    setSpeechRate,
    setAutoSpeak,
  }
}