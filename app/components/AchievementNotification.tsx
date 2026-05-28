"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { FaTrophy, FaStar, FaMedal } from "react-icons/fa"
import { useTheme } from "../../hooks/useTheme"

type AchievementNotificationProps = {
  achievement: {
    title: string
    description: string
    icon: string
    reward?: number
  } | null
  onHide: () => void
  duration?: number
}

export default function AchievementNotification({ achievement, onHide, duration = 4000 }: AchievementNotificationProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onHide, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [achievement, duration, onHide])

  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${
            isDark ? "bg-gray-800/95 backdrop-blur-xl border-gray-700" : "bg-white/95 backdrop-blur-sm border-gray-200 shadow-2xl"
          } border rounded-2xl p-4 shadow-xl`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-2xl shadow-lg">
              {achievement.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                <span className={isDark ? "text-white" : "text-gray-900"}>Достижение получено!</span>
              </h3>
              <p className={`font-bold text-sm mt-1 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {achievement.title}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {achievement.description}
              </p>
              {achievement.reward && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <FaStar size={10} /> +{achievement.reward} XP
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}