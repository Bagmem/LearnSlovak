"use client"

import { useState } from "react"
import { FaExchangeAlt, FaFlag, FaList } from "react-icons/fa"
import toast from "react-hot-toast"

type MatchData = {
  left: string[]
  right: string[]
  pairs: { slovak: string; russian: string }[]
}

type SectionMatchProps = {
  matchData: MatchData
  onComplete: (score: number, maxScore: number, connections: Map<number, number>) => void
}

export default function SectionMatch({ matchData, onComplete }: SectionMatchProps) {
  const { left, right, pairs } = matchData
  const [connections, setConnections] = useState<Map<number, number>>(new Map())
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)

  const allConnected = left.length === connections.size

  const handleLeftClick = (idx: number) => {
    if (connections.has(idx)) {
      const newConn = new Map(connections)
      newConn.delete(idx)
      setConnections(newConn)
      if (selectedLeft === idx) setSelectedLeft(null)
    } else {
      setSelectedLeft(idx)
    }
  }

  const handleRightClick = (idx: number) => {
    if (selectedLeft !== null) {
      const newConn = new Map(connections)
      let existingLeft: number | undefined
      for (const [l, r] of newConn.entries()) {
        if (r === idx) {
          existingLeft = l
          break
        }
      }
      if (existingLeft !== undefined) {
        newConn.delete(existingLeft)
      }
      newConn.set(selectedLeft, idx)
      setConnections(newConn)
      setSelectedLeft(null)
    } else {
      let leftToRemove: number | undefined
      for (const [l, r] of connections.entries()) {
        if (r === idx) {
          leftToRemove = l
          break
        }
      }
      if (leftToRemove !== undefined) {
        const newConn = new Map(connections)
        newConn.delete(leftToRemove)
        setConnections(newConn)
      }
    }
  }

  const handleNext = () => {
    if (!allConnected) {
      toast.error("Сопоставьте все пары!")
      return
    }
    let correct = 0
    for (const [l, r] of connections.entries()) {
      const slovak = left[l]
      const expected = pairs.find(p => p.slovak === slovak)?.russian
      if (expected === right[r]) correct++
    }
    onComplete(correct, pairs.length, connections)
  }

  const getLeftStyle = (idx: number) => {
    if (connections.has(idx)) return "bg-orange-100 dark:bg-orange-900 border-orange-400 shadow-md"
    if (selectedLeft === idx) return "bg-orange-100 dark:bg-orange-900 border-2 border-orange-500 shadow-md"
    return "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
  }

  const getRightStyle = (idx: number) => {
    let isConnected = false
    for (const r of connections.values()) if (r === idx) { isConnected = true; break }
    if (isConnected) return "bg-orange-100 dark:bg-orange-900 border-orange-400 shadow-md"
    return "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <FaExchangeAlt className="text-orange-500" />
        <h3 className="font-bold text-lg">Сопоставление пар</h3>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <FaList className="text-orange-500" />
        <span>Пар: {pairs.length}</span>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 flex items-center gap-1">
            <FaFlag className="text-blue-500" /> Словацкий
          </h3>
          {left.map((word, idx) => (
            <div key={idx} onClick={() => handleLeftClick(idx)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${getLeftStyle(idx)}`}>
              {word}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 flex items-center gap-1">
            <FaFlag className="text-red-500" /> Русский
          </h3>
          {right.map((word, idx) => (
            <div key={idx} onClick={() => handleRightClick(idx)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${getRightStyle(idx)}`}>
              {word}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleNext}
          disabled={!allConnected}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            allConnected
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          }`}
        >
          Далее →
        </button>
        <button
          onClick={() => { setConnections(new Map()); setSelectedLeft(null); }}
          className="px-4 py-3 rounded-xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Сбросить все
        </button>
      </div>
    </div>
  )
}