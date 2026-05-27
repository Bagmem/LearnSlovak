import { useState, useEffect, useCallback } from "react"

export type Settings = {
  isMuted: boolean
  speechRate: number
  autoSpeakOnCorrect: boolean
  volume: number
}

const DEFAULT_SETTINGS: Settings = {
  isMuted: false,
  speechRate: 0.9,
  autoSpeakOnCorrect: true,
  volume: 0.7,
}

const loadSettings = (): Settings => {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  const saved = localStorage.getItem("slovak_settings")
  if (!saved) return DEFAULT_SETTINGS
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [isLoaded] = useState(true)

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

  const setVolume = useCallback((volume: number) => {
    setSettings(prev => ({ ...prev, volume: Math.min(1, Math.max(0, volume)) }))
  }, [])

  return {
    settings,
    isLoaded,
    updateSetting,
    toggleMute,
    setSpeechRate,
    setAutoSpeak,
    setVolume,
  }
}