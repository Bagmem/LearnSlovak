"use client"

import { useState, useEffect, useCallback } from "react"

type GoalType =
  | "correctAnswers"
  | "xpGain"
  | "perfectLesson"
  | "reviewWords"
  | "completeTest"
  | "newWordsLearned"
  | "sessionsCompleted"
  | "streakDays"

export interface DailyGoal {
  id: string
  type: GoalType
  target: number
  progress: number
  reward: number
  description: string
}

const GOAL_POOL: Omit<DailyGoal, "id" | "progress">[] = [
  { type: "correctAnswers", target: 10, reward: 30, description: "Правильно ответить {target} раз" },
  { type: "correctAnswers", target: 20, reward: 50, description: "Правильно ответить {target} раз" },
  { type: "correctAnswers", target: 30, reward: 70, description: "Правильно ответить {target} раз" },
  { type: "xpGain", target: 50, reward: 30, description: "Набрать {target} XP" },
  { type: "xpGain", target: 100, reward: 60, description: "Набрать {target} XP" },
  { type: "xpGain", target: 150, reward: 90, description: "Набрать {target} XP" },
  { type: "perfectLesson", target: 1, reward: 40, description: "Завершить урок без ошибок" },
  { type: "perfectLesson", target: 2, reward: 80, description: "Завершить 2 урока без ошибок" },
  { type: "reviewWords", target: 5, reward: 25, description: "Повторить {target} слов" },
  { type: "reviewWords", target: 10, reward: 45, description: "Повторить {target} слов" },
  { type: "reviewWords", target: 20, reward: 70, description: "Повторить {target} слов" },
  { type: "completeTest", target: 1, reward: 50, description: "Пройти тест уровня" },
  { type: "newWordsLearned", target: 3, reward: 35, description: "Выучить {target} новых слов" },
  { type: "newWordsLearned", target: 5, reward: 60, description: "Выучить {target} новых слов" },
  { type: "sessionsCompleted", target: 3, reward: 40, description: "Завершить {target} учебных сессий" },
  { type: "sessionsCompleted", target: 5, reward: 70, description: "Завершить {target} учебных сессий" },
  { type: "streakDays", target: 3, reward: 50, description: "Достигнуть серии в {target} дня" },
  { type: "streakDays", target: 5, reward: 80, description: "Достигнуть серии в {target} дней" },
]

function generateDailyGoals(): DailyGoal[] {
  const shuffled = [...GOAL_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map((goal, idx) => ({
    ...goal,
    id: `goal_${Date.now()}_${idx}`,
    progress: 0,
    description: goal.description.replace("{target}", goal.target.toString()),
  }))
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoal[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem("daily_goals")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.date === getTodayStr() && Array.isArray(parsed.goals)) {
          return parsed.goals as DailyGoal[]
        }
      } catch {}
    }
    const newGoals = generateDailyGoals()
    localStorage.setItem("daily_goals", JSON.stringify({ date: getTodayStr(), goals: newGoals }))
    return newGoals
  })

  const [completedGoal, setCompletedGoal] = useState<DailyGoal | null>(null)

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("daily_goals", JSON.stringify({ date: getTodayStr(), goals }))
    }
  }, [goals])

  // Сброс целей в полночь
  useEffect(() => {
    const checkMidnight = () => {
      const saved = localStorage.getItem("daily_goals")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.date !== getTodayStr()) {
            const newGoals = generateDailyGoals()
            setGoals(newGoals)
          }
        } catch {}
      }
    }
    const now = new Date()
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const timer = setTimeout(() => {
      checkMidnight()
      const interval = setInterval(checkMidnight, 60_000)
      return () => clearInterval(interval)
    }, msToMidnight)
    return () => clearTimeout(timer)
  }, [])

  const updateProgress = useCallback((type: GoalType, amount: number = 1) => {
    setGoals(prev => {
      let changed = false
      const newGoals = prev.map(goal => {
        if (goal.type === type && goal.progress < goal.target) {
          changed = true
          const newProgress = Math.min(goal.progress + amount, goal.target)
          if (newProgress === goal.target && goal.progress < goal.target) {
            // Вместо тоста и XP здесь, мы вернём выполненную цель через состояние
            setCompletedGoal(goal)
          }
          return { ...goal, progress: newProgress }
        }
        return goal
      })
      return changed ? newGoals : prev
    })
  }, [])

  // Сбрасываем completedGoal после обработки
  const clearCompletedGoal = useCallback(() => setCompletedGoal(null), [])

  return { goals, updateProgress, completedGoal, clearCompletedGoal }
}