"use client"

import { useState } from "react"

const words = [
  {
    slovak: "dom",
    correct: "house",
    options: ["house", "water", "road"]
  },
  {
    slovak: "voda",
    correct: "water",
    options: ["fire", "water", "sky"]
  }
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [xp, setXp] = useState(0)
  const [message, setMessage] = useState("")

  const checkAnswer = (option: string) => {
    if (option === words[current].correct) {
      setXp(xp + 10)
      setMessage("✅ Correct!")
    } else {
      setMessage("❌ Wrong!")
    }

    setTimeout(() => {
      setCurrent((current + 1) % words.length)
      setMessage("")
    }, 1000)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-4xl font-bold">
        Slovak Game
      </h1>

      <div className="text-2xl">
        XP: {xp}
      </div>

      <div className="text-5xl font-bold">
        {words[current].slovak}
      </div>

      <div className="flex flex-col gap-3">
        {words[current].options.map((option) => (
          <button
            key={option}
            onClick={() => checkAnswer(option)}
            className="rounded-xl bg-blue-500 px-6 py-3 text-white text-xl"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-2xl">
        {message}
      </div>
    </main>
  )
} 