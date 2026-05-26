"use client"

import { motion } from "framer-motion"
import {
  FaArrowRight,
  FaCheckCircle,
  FaComments,
  FaUtensils,
  FaShoppingCart,
  FaHome,
  FaBus,
  FaBriefcase,
  FaHeartbeat,
  FaEnvelope,
  FaUsers,
  FaFutbol,
  FaCloudSun,
  FaSmile,
  FaLock,
} from "react-icons/fa"

type CategoryCardProps = {
  name: string
  passedCount: number
  totalCount: number
  isCompleted: boolean
  isLocked?: boolean
  onSelect: () => void
}

const categoryIconMap: Record<string, React.ReactNode> = {
  "💬 Разговорные фразы": <FaComments className="text-blue-500" size={20} />,
  "🍎 Еда и рестораны": <FaUtensils className="text-green-500" size={20} />,
  "🛒 Покупки и деньги": <FaShoppingCart className="text-indigo-500" size={20} />,
  "🏠 Жилье и аренда": <FaHome className="text-teal-500" size={20} />,
  "✈️ Город и транспорт": <FaBus className="text-cyan-500" size={20} />,
  "💼 Работа и учеба": <FaBriefcase className="text-purple-500" size={20} />,
  "🏥 Здоровье и медицина": <FaHeartbeat className="text-red-500" size={20} />,
  "📦 Почта, банк и документы": <FaEnvelope className="text-gray-500" size={20} />,
  "🏠 Семья и отношения": <FaUsers className="text-pink-500" size={20} />,
  "⚽ Хобби и спорт": <FaFutbol className="text-orange-500" size={20} />,
  "🌦 Погода и природа": <FaCloudSun className="text-yellow-500" size={20} />,
  "😊 Эмоции и чувства": <FaSmile className="text-amber-500" size={20} />,
}

const getIcon = (name: string) => {
  return categoryIconMap[name] || <FaComments className="text-gray-400" size={20} />
}

const cleanName = (name: string) => {
  return name.replace(/^[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, "")
}

export default function CategoryCard({
  name,
  passedCount,
  totalCount,
  isCompleted,
  isLocked = false,
  onSelect,
}: CategoryCardProps) {
  const percent = totalCount > 0 ? (passedCount / totalCount) * 100 : 0
  const clean = cleanName(name)
  const icon = getIcon(name)

  return (
    <motion.button
      whileHover={isLocked ? {} : { scale: 1.02, y: -2 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
      onClick={onSelect}
      disabled={isLocked}
      className={`group relative w-full flex items-center justify-between p-5 rounded-xl border transition-all shadow-sm ${
        isLocked
          ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 opacity-70 cursor-not-allowed"
          : isCompleted
            ? "border-green-400 dark:border-green-600 bg-gradient-to-r from-green-50 to-white dark:from-green-900/30 dark:to-gray-800"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md"
      }`}
    >
      {isLocked && (
  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-orange-200 bg-gradient-to-r from-orange-100 to-amber-100 px-2.5 py-1.5 text-orange-600 shadow-sm dark:border-orange-800/60 dark:from-orange-900/40 dark:to-amber-900/30 dark:text-orange-300">
    <FaLock size={12} />
    <span className="text-[10px] font-black uppercase tracking-wide">
      Locked
    </span>
  </div>
)}

      <div className="flex-1 text-left pr-8">
        <div className="flex items-center gap-3">
          <span className={isLocked ? "opacity-50" : ""}>{icon}</span>

          <span
            className={`font-black text-lg ${
              isLocked
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-800 dark:text-white"
            }`}
          >
            {clean}
          </span>

          {isCompleted && !isLocked && <FaCheckCircle className="text-green-500" size={16} />}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isLocked
                  ? "bg-gray-300 dark:bg-gray-600"
                  : "bg-gradient-to-r from-orange-400 to-orange-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <span
            className={`text-sm font-bold ${
              isLocked
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {passedCount}/{totalCount}
          </span>
        </div>
      </div>

      <FaArrowRight
        className={`transition-colors ml-4 text-xl ${
          isLocked
            ? "text-gray-300 dark:text-gray-600"
            : "text-gray-400 dark:text-gray-500 group-hover:text-orange-500"
        }`}
      />
    </motion.button>
  )
}