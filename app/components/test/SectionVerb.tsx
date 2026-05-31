"use client"

import { useState } from "react"
import { FaLanguage, FaList } from "react-icons/fa"
import toast from "react-hot-toast"
import { LanguageLevel } from "../../../data/words"

export type VerbQuestion = {
  sentence: string
  options: string[]
  correct: number
  explanation?: string
}

type SectionVerbProps = {
  questions: VerbQuestion[]
  onComplete: (score: number, maxScore: number, answers: (number | string)[]) => void
  level: LanguageLevel
}

export default function SectionVerb({ questions, onComplete, level }: SectionVerbProps) {
  const isInputMode = level === "B2" || level === "C1"
  const [answers, setAnswers] = useState<(number | string)[]>(
    new Array(questions.length).fill(isInputMode ? "" : -1)
  )
  const allAnswered = answers.every(a => (isInputMode ? (a as string).trim() !== "" : a !== -1))

  const handleSubmit = () => {
    if (!allAnswered) {
      toast.error(isInputMode ? "Заполните все поля!" : "Выберите ответы для всех вопросов!")
      return
    }
    let correct = 0
    answers.forEach((ans, idx) => {
      const correctStr = questions[idx].options[questions[idx].correct].toLowerCase().trim()
      if (isInputMode) {
        if ((ans as string).toLowerCase().trim() === correctStr) correct++
      } else {
        if (ans === questions[idx].correct) correct++
      }
    })
    onComplete(correct, questions.length, answers)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <FaLanguage className="text-orange-500" />
        <h3 className="font-bold text-lg">Формы глаголов</h3>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <FaList className="text-orange-500" />
        <span>Вопросов: {questions.length}</span>
        {isInputMode && <span className="text-xs bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full text-purple-700 dark:text-purple-300">Ввод с клавиатуры</span>}
      </div>
      {questions.map((q, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{idx + 1}. {q.sentence}</p>
          {isInputMode ? (
            <input
              type="text"
              value={answers[idx] as string}
              onChange={e => {
                const newAnswers = [...answers]
                newAnswers[idx] = e.target.value
                setAnswers(newAnswers)
              }}
              placeholder="Введите правильную форму"
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            />
          ) : (
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
          )}
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