"use client"

import { useState, useEffect } from "react"
import { words, type Word } from "../data/words"
import { checkAnswer } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import GameUI from "./components/GameUI"

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function Home() {
  const [queue, setQueue] = useState<Word[]>(words)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [message, setMessage] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [isAnswering, setIsAnswering] = useState(false)

  const word = queue[0] ?? null

  // 📥 загрузка прогресса
  useEffect(() => {
    const savedXp = loadProgress("xp")
    const savedStreak = loadProgress("streak")
    const savedLives = loadProgress("lives")

    if (savedXp !== null) setXp(savedXp)
    if (savedStreak !== null) setStreak(savedStreak)
    if (savedLives !== null) setLives(savedLives)
  }, [])

  // 💾 сохранение
  useEffect(() => {
    saveProgress("xp", xp)
  }, [xp])

  useEffect(() => {
    saveProgress("streak", streak)
  }, [streak])

  useEffect(() => {
    saveProgress("lives", lives)
  }, [lives])

  // 🎯 генерация вариантов
  useEffect(() => {
    if (!word) {
      setOptions([])
      return
    }

    const wrongOptions = words
      .filter((w) => w.slovak !== word.slovak)
      .map((w) => w.slovak)
      .slice(0, 2)

    setOptions(shuffleArray([...wrongOptions, word.slovak]))
  }, [word])

  // 🎮 логика ответа
  const checkAnswerHandler = (option: string) => {
    if (isAnswering || !word || lives <= 0) return

    setIsAnswering(true)

    if (checkAnswer(word, option)) {
      setXp((v) => v + 10)
      setStreak((v) => v + 1)
      setMessage("✅ Правильно!")
    } else {
      setLives((v) => v - 1)
      setStreak(0)
      setMessage("❌ Неправильно!")
    }

    setTimeout(() => {
      setQueue((prev) => {
        const [, ...rest] = prev
        return [...rest, prev[0]]
      })
      setMessage("")
      setIsAnswering(false)
    }, 800)
  }

  // 🔁 рестарт
  const restartGame = () => {
    setLives(3)
    setXp(0)
    setStreak(0)
    setQueue(words)
  }

  return (
    <GameUI
      xp={xp}
      streak={streak}
      lives={lives}
      word={word}
      options={options}
      message={message}
      onAnswer={checkAnswerHandler}
      onRestart={restartGame}
      disabled={isAnswering || lives <= 0}
    />
  )
}