import { useState, useEffect, useCallback } from 'react'

type TextProgress = {
  read: Record<string, boolean>
  quizCompleted: Record<string, { score: number; xpEarned: boolean }>
}

const STORAGE_KEY = 'slovak_text_progress'

const loadTextProgress = (): TextProgress => {
  if (typeof window === 'undefined') return { read: {}, quizCompleted: {} }
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return { read: {}, quizCompleted: {} }
  try {
    const parsed = JSON.parse(saved)
    return {
      read: parsed.read || {},
      quizCompleted: parsed.quizCompleted || {},
    }
  } catch {
    return { read: {}, quizCompleted: {} }
  }
}

export function useTextProgress() {
  const [progress, setProgress] = useState<TextProgress>(loadTextProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const markAsRead = useCallback((textId: string) => {
    setProgress(prev => ({
      ...prev,
      read: { ...prev.read, [textId]: true },
    }))
  }, [])

  const isRead = useCallback((textId: string): boolean => {
    return !!progress.read[textId]
  }, [progress.read])

  const markQuizCompleted = useCallback((textId: string, score: number, xpEarned: boolean) => {
    setProgress(prev => ({
      ...prev,
      quizCompleted: {
        ...prev.quizCompleted,
        [textId]: { score, xpEarned },
      },
    }))
  }, [])

  const getQuizScore = useCallback((textId: string): number | null => {
    return progress.quizCompleted[textId]?.score ?? null
  }, [progress.quizCompleted])

  const hasXpEarned = useCallback((textId: string): boolean => {
    return progress.quizCompleted[textId]?.xpEarned ?? false
  }, [progress.quizCompleted])

  const isQuizCompleted = useCallback((textId: string): boolean => {
    return !!progress.quizCompleted[textId]
  }, [progress.quizCompleted])

  return {
    markAsRead,
    isRead,
    markQuizCompleted,
    getQuizScore,
    hasXpEarned,
    isQuizCompleted,
    isLoaded: true,
  }
}