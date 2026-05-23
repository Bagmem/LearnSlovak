import { useState, useEffect, useCallback } from "react"

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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("slovak_settings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      } catch (e) {}
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("slovak_settings", JSON.stringify(settings))
    }
  }, [settings, isLoaded])

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
    isLoaded,
    updateSetting,
    toggleMute,
    setSpeechRate,
    setAutoSpeak,
  }
}