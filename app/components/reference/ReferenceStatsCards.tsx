"use client"

import { motion } from "framer-motion"
import { FaBook, FaCheckCircle, FaTrophy } from "react-icons/fa"
import AnimatedCounter from "../shared/AnimatedCounter"

type ReferenceStatsCardsProps = {
  uniqueLearnedWords: number
  completedCategories: number
  accuracy: number
}

export default function ReferenceStatsCards({
  uniqueLearnedWords,
  completedCategories,
  accuracy,
}: ReferenceStatsCardsProps) {
  const stats = [
    {
      value: uniqueLearnedWords,
      label: "слов изучено",
      icon: <FaBook className="text-orange-500 text-3xl" />,
      gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      border: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      value: completedCategories,
      label: "тем завершено",
      icon: <FaCheckCircle className="text-green-500 text-3xl" />,
      gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      border: "border-green-200 dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      value: accuracy,
      suffix: "%",
      label: "точность",
      icon: <FaTrophy className="text-yellow-500 text-3xl" />,
      gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -12px rgba(0,0,0,0.15)" }}
          className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 shadow-lg border ${stat.border} text-center transition-all duration-200`}
        >
          <div className="flex justify-center mb-2">{stat.icon}</div>
          <p className={`text-4xl font-black ${stat.textColor}`}>
            <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
          </p>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}