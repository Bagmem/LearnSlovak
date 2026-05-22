"use client"

import { useState, useEffect } from "react"
import { words } from "../data/words"
import { checkAnswer } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import GameUI from "./components/GameUI"

export default function Home() {
  const [queue, setQueue] = useState(words)

  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [message, setMessage] = useState("")

  const [options, setOptions] = useState<string[]>([])

  const word = queue[0]

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
    const correct = word.slovak

    const wrongOptions = words
      .filter((w) => w.slovak !== correct)
      .map((w) => w.slovak)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    setOptions([...wrongOptions, correct])
  }, [queue])

  // 🎮 логика ответа
  const checkAnswerHandler = (option: string) => {
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
      setLives={setLives}
      setXp={setXp}
      setStreak={setStreak}
      setQueue={setQueue}
    />
  )
}