// hooks/useTextProgress.ts
import { useState, useEffect } from "react"

export type TextProgress = {
  [textId: string]: {
    read: boolean
    quizCompleted: boolean
    quizScore: number
    xpEarned: boolean
  }
}

export function useTextProgress() {
  const [progress, setProgress] = useState<TextProgress>({})

  useEffect(() => {
    const saved = localStorage.getItem("slovak_text_progress")
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("slovak_text_progress", JSON.stringify(progress))
  }, [progress])

  const markAsRead = (textId: string) => {
    setProgress(prev => ({
      ...prev,
      [textId]: {
        read: true,
        quizCompleted: prev[textId]?.quizCompleted || false,
        quizScore: prev[textId]?.quizScore || 0,
        xpEarned: prev[textId]?.xpEarned || false,
      },
    }))
  }

  const markQuizCompleted = (textId: string, score: number, xpAwarded: boolean = true) => {
    setProgress(prev => ({
      ...prev,
      [textId]: {
        read: prev[textId]?.read || false,
        quizCompleted: true,
        quizScore: score,
        xpEarned: xpAwarded,
      },
    }))
  }

  const isRead = (textId: string) => !!progress[textId]?.read
  const isQuizCompleted = (textId: string) => !!progress[textId]?.quizCompleted
  const getQuizScore = (textId: string) => {
    const data = progress[textId]
    return data?.quizCompleted ? data.quizScore : null
  }
  const hasXpEarned = (textId: string) => !!progress[textId]?.xpEarned

  return {
    progress,
    markAsRead,
    markQuizCompleted,
    isRead,
    isQuizCompleted,
    getQuizScore,
    hasXpEarned,
  }
}