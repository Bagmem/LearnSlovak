"use client"

import { type Word } from "../../data/words"
type Props = {
  xp: number
  streak: number
  lives: number
  word: Word | null
  options: string[]
  message: string
  onAnswer: (option: string) => void
  onRestart: () => void
  disabled: boolean
}

export default function GameUI({
  xp,
  streak,
  lives,
  word,
  options,
  message,
  onAnswer,
  onRestart,
  disabled,
}: Props) {
  return (
    <main className="min-h-screen bg-[#f7f7f7] flex flex-col items-center px-6 py-10">

      {/* HEADER */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold text-green-600">
          Slovak
        </h1>

        <div className="flex gap-4 text-sm font-semibold">
          <div className="bg-white px-3 py-1 rounded-full shadow">
            XP {xp}
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow">
            🔥 {streak}
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow text-red-500">
            ❤️ {lives}
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-md bg-gray-200 h-2 rounded-full mb-10">
        <div
          className="h-full bg-green-500"
          style={{ width: `${xp % 100}%` }}
        />
      </div>

      {/* WORD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center mb-10">
        <div className="text-gray-500 mb-2">Переведи слово:</div>
        <div className="text-4xl font-extrabold">
          {word ? word.russian : "Загрузка..."}
        </div>
      </div>

      {/* OPTIONS */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className="bg-white border rounded-xl py-4 text-lg font-semibold shadow-sm
                       hover:bg-green-50 hover:border-green-400 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {option}
          </button>
        ))}
      </div>

      {/* MESSAGE */}
      <div className="mt-6 text-lg font-medium">
        {message}
      </div>

      {/* GAME OVER */}
      {lives <= 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Игра окончена</h2>

            <button
              onClick={onRestart}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold"
            >
              Заново
            </button>
          </div>
        </div>
      )}
    </main>
  )
}