"use client"

import { motion } from "framer-motion"
import { FaArrowRight, FaCheckCircle, FaComments, FaUtensils, FaShoppingCart, FaHome, FaBus, FaBriefcase, FaHeartbeat, FaEnvelope, FaUsers, FaFutbol, FaCloudSun, FaSmile } from "react-icons/fa"

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

const getIcon = (name: string) => categoryIconMap[name] || <FaComments className="text-gray-400" size={20} />
const cleanName = (name: string) => name.replace(/^[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')

export default function CategoryCard({ name, passedCount, totalCount, isCompleted, isLocked = false, onSelect }: CategoryCardProps) {
  const percent = (passedCount / totalCount) * 100
  const clean = cleanName(name)
  const icon = getIcon(name)

  const topBarGradient = isCompleted
    ? "from-green-500 to-emerald-600"
    : isLocked
    ? "from-gray-400 to-gray-500"
    : "from-orange-500 to-amber-500"

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.01, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.99 } : {}}
      onClick={onSelect}
      disabled={isLocked}
      className="relative w-full overflow-hidden rounded-xl text-left transition-all duration-200 shadow-sm hover:shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${topBarGradient}`} />
      {/* Лёгкая текстура */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-black text-base text-gray-800 dark:text-white">{clean}</span>
          </div>
          {isCompleted && <FaCheckCircle className="text-green-500 text-lg" />}
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
            <span>Прогресс</span>
            <span>{passedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-gradient-to-r from-orange-500 to-amber-500"}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          {!isLocked && (
            <FaArrowRight className="text-gray-400 dark:text-gray-500 group-hover:text-orange-500 transition-colors text-sm" />
          )}
          {isLocked && <span className="text-xs text-gray-500 dark:text-gray-400">🔒 Закрыто</span>}
        </div>
      </div>
    </motion.button>
  )
}