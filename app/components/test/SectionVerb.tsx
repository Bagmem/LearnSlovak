"use client"

import { useState } from "react"
import toast from "react-hot-toast"

type VerbQuestion = { sentence: string; options: string[]; correct: number }

type SectionVerbProps = {
  questions: VerbQuestion[]
  onComplete: (score: number, maxScore: number) => void
}

export default function SectionVerb({ questions, onComplete }: SectionVerbProps) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const allAnswered = answers.every(a => a !== -1)

  const handleSubmit = () => {
    if (!allAnswered) {
      toast.error("Выберите ответы для всех вопросов!")
      return
    }
    let correct = 0
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) correct++
    })
    onComplete(correct, questions.length)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      {questions.map((q, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{q.sentence}</p>
          <div className="flex flex-wrap gap-3">
            {q.options.map((opt: string, optIdx: number) => (
              <button
                key={optIdx}
                onClick={() => {
                  const newAnswers = [...answers]
                  newAnswers[idx] = optIdx
                  setAnswers(newAnswers)
                }}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  answers[idx] === optIdx
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-orange-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          allAnswered
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
        }`}
      >
        Далее →
      </button>
    </div>
  )
}