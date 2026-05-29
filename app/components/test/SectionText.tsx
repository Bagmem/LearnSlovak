"use client"

import { useState } from "react"
import { type SlovakText } from "../../../data/texts"
import toast from "react-hot-toast"

type TextQuestion = { text: string; options: string[]; correct: number }

type SectionTextProps = {
  text: SlovakText
  questions: TextQuestion[]
  onComplete: (score: number, maxScore: number) => void
}

export default function SectionText({ text, questions, onComplete }: SectionTextProps) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const allAnswered = answers.every(a => a !== -1)

  const handleSubmit = () => {
    if (!allAnswered) {
      toast.error("Ответьте на все вопросы!")
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
      <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{text.content}</p>
      </div>
      {questions.map((q, idx) => (
        <div key={idx} className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{q.text}</p>
          <div className="space-y-2">
            {q.options.map((opt: string, optIdx: number) => (
              <button
                key={optIdx}
                onClick={() => {
                  const newAnswers = [...answers]
                  newAnswers[idx] = optIdx
                  setAnswers(newAnswers)
                }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                  answers[idx] === optIdx
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{opt}</span>
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