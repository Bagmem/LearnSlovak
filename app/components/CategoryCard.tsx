"use client"

import { FaArrowRight, FaCheckCircle, FaComments, FaUtensils, FaShoppingCart, FaHome, FaBus, FaBriefcase, FaHeartbeat, FaEnvelope, FaUsers, FaFutbol, FaCloudSun, FaSmile } from "react-icons/fa"

type CategoryCardProps = {
  name: string
  passedCount: number
  totalCount: number
  isCompleted: boolean
  onSelect: () => void
}

const categoryIconMap: Record<string, React.ReactNode> = {
  "💬 Разговорные фразы": <FaComments className="text-blue-500" size={18} />,
  "🍎 Еда и рестораны": <FaUtensils className="text-green-500" size={18} />,
  "🛒 Покупки и деньги": <FaShoppingCart className="text-indigo-500" size={18} />,
  "🏠 Жилье и аренда": <FaHome className="text-teal-500" size={18} />,
  "✈️ Город и транспорт": <FaBus className="text-cyan-500" size={18} />,
  "💼 Работа и учеба": <FaBriefcase className="text-purple-500" size={18} />,
  "🏥 Здоровье и медицина": <FaHeartbeat className="text-red-500" size={18} />,
  "📦 Почта, банк и документы": <FaEnvelope className="text-gray-500" size={18} />,
  "🏠 Семья и отношения": <FaUsers className="text-pink-500" size={18} />,
  "⚽ Хобби и спорт": <FaFutbol className="text-orange-500" size={18} />,
  "🌦 Погода и природа": <FaCloudSun className="text-yellow-500" size={18} />,
  "😊 Эмоции и чувства": <FaSmile className="text-amber-500" size={18} />,
}

const getCategoryIcon = (categoryName: string) => {
  return categoryIconMap[categoryName] || <FaComments className="text-gray-400" size={18} />
}

const cleanCategoryName = (name: string) => {
  return name.replace(/^[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '')
}

export default function CategoryCard({
  name,
  passedCount,
  totalCount,
  isCompleted,
  onSelect,
}: CategoryCardProps) {
  const progressPercent = (passedCount / totalCount) * 100
  const cleanName = cleanCategoryName(name)
  const icon = getCategoryIcon(name)

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all transform active:scale-[0.98] card-hover ${
        isCompleted
          ? "border-green-400 dark:border-green-600 bg-gradient-to-r from-green-50 to-white dark:from-green-900/30 dark:to-gray-800"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md"
      }`}
    >
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-black text-gray-800 dark:text-white">{cleanName}</span>
          {isCompleted && <FaCheckCircle className="text-green-500" size={14} />}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
            {passedCount}/{totalCount}
          </span>
        </div>
      </div>
      <FaArrowRight className="text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors ml-3" />
    </button>
  )
}