"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

type VictoryProps = {
  category: string
  xpEarned: number
  accuracy: number
  onBack: () => void
}

export default function VictoryScreen({ category, xpEarned, accuracy, onBack }: VictoryProps) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 200)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", damping: 20 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
          Урок завершён!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Тема: {category}</p>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 mx-auto">
          <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-gray-700 dark:text-gray-300">Награда</span>
            <span className="text-amber-500 font-bold">+{xpEarned} XP</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-bold text-gray-700 dark:text-gray-300">Точность</span>
            <span className="text-green-500 font-bold">{accuracy}%</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg"
        >
          ПРОДОЛЖИТЬ
        </motion.button>
      </motion.div>
    </motion.div>
  )
}