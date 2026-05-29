"use client"

import { motion } from "framer-motion"
import { FaGraduationCap, FaTimes, FaChartPie, FaSkull } from "react-icons/fa"

type LevelStat = {
  level: string
  total: number
  learned: number
  percent: number
}

type HardWord = {
  word: string
  translation: string
  wrong: number
  correct: number
}

type LevelDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  profileLevel: number
  xp: number
  nextLevelXp: number
  progressPercent: number
  xpLeft: number
  levelStats: LevelStat[]
  hardWords: HardWord[]
  playClickSound: () => void
}

export default function LevelDetailModal({
  isOpen,
  onClose,
  profileLevel,
  xp,
  nextLevelXp,
  progressPercent,
  xpLeft,
  levelStats,
  hardWords,
  playClickSound,
}: LevelDetailModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="rounded-2xl w-full max-w-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40">
            <FaGraduationCap className="text-orange-500 text-base" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-black text-gray-800 dark:text-white">Детали прогресса</h2>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">ваш путь в изучении словацкого</p>
          </div>
          <button onClick={() => { playClickSound(); onClose() }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <FaTimes size={18} />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500 dark:text-orange-400">{profileLevel}</div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">текущий уровень профиля</p>
            <div className="mt-2 flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-300">XP</span>
              <span className="text-orange-500 font-bold">{xp} / {nextLevelXp}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">до следующего уровня: {xpLeft} XP</p>
          </div>
          <div>
            <h3 className="font-bold mb-2 flex items-center gap-1.5 text-xs text-gray-800 dark:text-white">
              <FaChartPie className="text-orange-500 text-[10px]" /> Уровни языка
            </h3>
            <div className="space-y-2">
              {levelStats.map((stat, idx) => (
                <motion.div key={stat.level} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div className="flex justify-between text-xs font-bold mb-0.5">
                    <span className="text-gray-700 dark:text-gray-300">{stat.level}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-[9px]">{stat.learned}/{stat.total} тем</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percent}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2 flex items-center gap-1.5 text-xs text-gray-800 dark:text-white">
              <FaSkull className="text-red-500 text-[10px]" /> Сложные слова
            </h3>
            {hardWords.length > 0 ? (
              <div className="space-y-1">
                {hardWords.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-bold text-xs text-gray-800 dark:text-white">{item.word}</p>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">{item.translation}</p>
                    </div>
                    <div className="text-[9px] font-mono">
                      <span className="text-red-500">✗{item.wrong}</span> <span className="text-green-600">✓{item.correct}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center py-2">🎉 Отлично! Сложных слов пока нет</p>
            )}
          </div>
        </div>
        <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/30">
          <button onClick={() => { playClickSound(); onClose() }} className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-sm hover:shadow-lg transition">
            Закрыть
          </button>
        </div>
      </motion.div>
    </div>
  )
}