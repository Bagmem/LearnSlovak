"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaUserCircle, FaSeedling, FaRocket, FaTrophy, FaFire, FaGem, FaStar, FaRegSmile, FaTimes, FaGraduationCap } from "react-icons/fa"
import { type UnlockedAchievement } from "../../hooks/useAchievements"
import { achievements } from "../../data/achievements"
import { getIconForAchievement } from "../../utils/achievementIcons"
import { useTheme } from "../../hooks/useTheme"

type ProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  xp: number
  streak: number
  correctAnswers: number
  totalClicks: number
  learnedWords: number
  completedCategories: number
  unlockedAchievements: UnlockedAchievement[]
  avatar: string
  onAvatarChange: (avatar: string) => void
}

const avatarOptions = [
  { id: "default", icon: <FaUserCircle size={48} className="text-gray-400" />, name: "Стандарт" },
  { id: "student", icon: <FaGraduationCap size={48} className="text-blue-500" />, name: "Студент" },
  { id: "hero", icon: <FaTrophy size={48} className="text-yellow-500" />, name: "Герой" },
  { id: "cat", icon: <FaRegSmile size={48} className="text-orange-500" />, name: "Котик" },
  { id: "star", icon: <FaStar size={48} className="text-yellow-400" />, name: "Звезда" },
  { id: "fire", icon: <FaFire size={48} className="text-red-500" />, name: "Пламя" },
]

export default function ProfileModal({
  isOpen,
  onClose,
  xp,
  streak,
  correctAnswers,
  totalClicks,
  learnedWords,
  completedCategories,
  unlockedAchievements,
  avatar,
  onAvatarChange,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "achievements">("stats")
  const { theme } = useTheme()

  const accuracy = totalClicks > 0 ? Math.round((correctAnswers / totalClicks) * 100) : 0
  const unlockedIds = new Set(unlockedAchievements.map(a => a.id))
  const totalAchievements = achievements.length
  const unlockedCount = unlockedAchievements.length

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const isDark = theme === "dark"

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl w-full max-w-md shadow-2xl border overflow-hidden ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div className={`flex items-center justify-between p-4 border-b ${
              isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
            }`}>
              <h2 className={`text-lg font-black ${isDark ? "text-white" : "text-gray-800"}`}>Профиль</h2>
              <button onClick={onClose} className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="text-center">
                <div className={`inline-block p-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  {avatarOptions.find(a => a.id === avatar)?.icon || avatarOptions[0].icon}
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {avatarOptions.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAvatarChange(opt.id)}
                      className={`p-2 rounded-full transition-all ${
                        avatar === opt.id
                          ? "ring-2 ring-orange-500 scale-110"
                          : isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      {opt.icon}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className={`flex rounded-xl p-1 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800`}>
                {["stats", "achievements"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-2 text-sm font-black rounded-lg transition-all ${
                      activeTab === tab
                        ? isDark
                          ? "bg-gray-600 text-orange-500 shadow-sm"
                          : "bg-white text-orange-500 shadow-sm"
                        : isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {tab === "stats" ? "Статистика" : `Достижения (${unlockedCount}/${totalAchievements})`}
                  </button>
                ))}
              </div>

              {activeTab === "stats" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: xp, label: "Опыт (XP)", color: "text-orange-500" },
                      { value: streak, label: "Дней подряд", color: "text-orange-500" },
                      { value: `${accuracy}%`, label: "Точность", color: "text-green-500" },
                      { value: learnedWords, label: "Выучено слов", color: "text-blue-500" }
                    ].map((stat, idx) => (
                      <div key={idx} className={`rounded-xl p-3 text-center ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                        <p className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className={`rounded-xl p-3 text-center ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                    <p className="text-2xl font-black text-purple-500">{completedCategories}</p>
                    <p className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>Пройдено категорий</p>
                  </div>
                </motion.div>
              )}

              {activeTab === "achievements" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scroll"
                >
                  {achievements.map((ach) => {
                    const isUnlocked = unlockedIds.has(ach.id)
                    return (
                      <div
                        key={ach.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isUnlocked
                            ? isDark
                              ? "bg-yellow-900/30 border-yellow-700"
                              : "bg-yellow-50 border-yellow-300"
                            : isDark
                              ? "bg-gray-700/50 border-gray-600 opacity-60"
                              : "bg-gray-50 border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getIconForAchievement(ach.id, 20)}</div>
                          <div>
                            <p className={`font-black text-sm ${isDark ? "text-white" : "text-gray-800"}`}>{ach.title}</p>
                            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{ach.description}</p>
                            {ach.reward && <p className="text-[10px] font-bold text-orange-500">+{ach.reward} XP</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </div>

            <div className={`p-4 border-t ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-md hover:shadow-lg transition"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}