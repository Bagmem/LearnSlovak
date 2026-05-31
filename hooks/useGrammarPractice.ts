"use client"

import { useState, useCallback, useMemo } from "react"
import { type GrammarExercise } from "../data/grammar"
import { saveProgress } from "../lib/storage"
import { playCorrectSound, playWrongSound } from "../lib/sounds"

type UseGrammarPracticeInput = {
  exercises: GrammarExercise[]
  category: string
  level: string
  xp: number
  setXp: (v: number | ((prev: number) => number)) => void
  progressData: Record<string, number>
  setProgressData: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void
  onXpEarned?: (amount: number, source: string) => void
  onComplete: () => void
}

type Mistake = { exercise: GrammarExercise; given: string }

export function useGrammarPractice({
  exercises,
  category,
  level,
  xp,
  setXp,
  progressData,
  setProgressData,
  onXpEarned,
  onComplete,
}: UseGrammarPracticeInput) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [showRule, setShowRule] = useState(true)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [userInput, setUserInput] = useState("")
  const [buildOrder, setBuildOrder] = useState<string[]>([])
  const [isFinished, setIsFinished] = useState(false)

  const currentExercise = exercises[currentIndex]
  const completedCount = completedIds.size
  const progressPercent = exercises.length ? (currentIndex / exercises.length) * 100 : 0

  const handleCheckAnswer = useCallback((answer: string) => {
    if (!currentExercise) return
    const isCorrect = answer.trim().toLowerCase() === currentExercise.correctAnswer.trim().toLowerCase()
    if (isCorrect) {
      playCorrectSound()
      const newCompleted = new Set(completedIds)
      newCompleted.add(currentExercise.id)
      setCompletedIds(newCompleted)
      setFeedback({ correct: true, message: "Правильно!" })
      const earned = 5
      setXp(prev => prev + earned)
      onXpEarned?.(earned, "grammar")
      const storageKey = `grammar_progress_${level}_${category}`
      setProgressData(prev => {
        const newProgress = { ...prev, [storageKey]: newCompleted.size }
        saveProgress(storageKey, newCompleted.size)
        return newProgress
      })
    } else {
      playWrongSound()
      setFeedback({ correct: false, message: `Ошибка. Правильно: ${currentExercise.correctAnswer}` })
      setMistakes(prev => [...prev, { exercise: currentExercise, given: answer }])
    }
    setSelectedOption(null)
    setUserInput("")
    setBuildOrder([])
  }, [currentExercise, completedIds, category, level, setXp, onXpEarned, setProgressData])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= exercises.length) {
      setIsFinished(true)
    } else {
      setCurrentIndex(prev => prev + 1)
      setFeedback(null)
      setShowRule(false)
    }
    setSelectedOption(null)
    setUserInput("")
    setBuildOrder([])
  }, [currentIndex, exercises.length])

  const dismissRule = useCallback(() => setShowRule(false), [])

  const shuffledWords = useMemo(() => {
    if (currentExercise?.type === "build-sentence" && currentExercise.words) {
      return [...currentExercise.words].sort(() => Math.random() - 0.5)
    }
    return []
  }, [currentExercise])

  return {
    currentExercise,
    showRule,
    feedback,
    selectedOption,
    setSelectedOption,
    userInput,
    setUserInput,
    buildOrder,
    setBuildOrder,
    shuffledWords,
    progressPercent,
    currentIndex,
    total: exercises.length,
    handleCheckAnswer,
    handleNext,
    dismissRule,
    completedIds,
    completedCount,
    isFinished,
    mistakes,
  }
}