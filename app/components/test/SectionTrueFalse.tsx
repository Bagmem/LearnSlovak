"use client"

import { useState } from "react"
import { FaQuestionCircle, FaList, FaCheck, FaTimes } from "react-icons/fa"
import toast from "react-hot-toast"

type SectionTrueFalseProps = {
  statements: { statement: string; isTrue: boolean }[]
  onComplete: (score: number, maxScore: number, answers: boolean[]) => void
}

export default function SectionTrueFalse({ statements, onComplete }: SectionTrueFalseProps) {
  const [answers, setAnswers] = useState<boolean[]>(new Array(statements.length).fill(undefined as any))
  const allAnswered = answers.every(a => a !== undefined)

  const handleSubmit = () => {
    if (!allAnswered) {
      toast.error("Выберите ответы для всех утверждений!")
      return
    }
    let correct = 0
    answers.forEach((ans, idx) => {
      if (ans === statements[idx].isTrue) correct++
    })
    onComplete(correct, statements.length, answers)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <FaQuestionCircle className="text-orange-500" />
        <h3 className="font-bold text-lg">Правда / Ложь</h3>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <FaList className="text-orange-500" />
        <span>Утверждений: {statements.length}</span>
      </div>
      {statements.map((stmt, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{idx + 1}. {stmt.statement}</p>
          <div className="flex gap-4">
            <button
              onClick={() => { const newA = [...answers]; newA[idx] = true; setAnswers(newA); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${answers[idx] === true ? "bg-green-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
            >
              <FaCheck /> Верно
            </button>
            <button
              onClick={() => { const newA = [...answers]; newA[idx] = false; setAnswers(newA); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${answers[idx] === false ? "bg-red-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
            >
              <FaTimes /> Неверно
            </button>
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
        Завершить тест
      </button>
    </div>
  )
}