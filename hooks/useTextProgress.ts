import { useState, useEffect, useCallback } from 'react'

type TextProgress = {
  read: Record<string, boolean>        // id текста -> прочитан ли
  quizCompleted: Record<string, { score: number; xpEarned: boolean }> // id текста -> результат
}

const STORAGE_KEY = 'slovak_text_progress'

export function useTextProgress() {
  const [progress, setProgress] = useState<TextProgress>({
    read: {},
    quizCompleted: {},
  })
  const [isLoaded, setIsLoaded] = useState(false)

  // Загрузка сохранённых данных при монтировании
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setProgress({
          read: parsed.read || {},
          quizCompleted: parsed.quizCompleted || {},
        })
      } catch (e) {
        console.error('Ошибка загрузки прогресса текстов', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Сохранение при каждом изменении прогресса
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress, isLoaded])

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
    isLoaded,
  }
}