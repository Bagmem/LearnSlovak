import {
  FaFire,
  FaStar,
  FaTrophy,
  FaBook,
  FaIdCard,
  FaBullseye,
  FaCrown,
  FaGlobe,
  FaRocket,
  FaBrain,
  FaCalendarAlt,
  FaChartLine,
  FaGraduationCap,
  FaPenFancy,
  FaQuestionCircle,
  FaSun,
  FaMedal,
  FaAward,
} from "react-icons/fa"

export const getIconForAchievement = (id: string, size: number = 20) => {
  // Специфичные условия (важен порядок: сначала самые конкретные)
  
  // Письмо (write)
  if (id.includes("write")) return <FaPenFancy className="text-indigo-500" size={size} />
  
  // Тест (choice / quiz)
  if (id.includes("choice") && id.includes("50")) return <FaMedal className="text-cyan-500" size={size} />
  if (id.includes("choice") && id.includes("200")) return <FaAward className="text-yellow-600" size={size} />
  if (id.includes("choice")) return <FaQuestionCircle className="text-teal-500" size={size} />
  
  // Идеальный день (perfect day)
  if (id.includes("perfect") || id.includes("ideal") || id.includes("flawless")) return <FaSun className="text-amber-400" size={size} />
  
  // Легенда (legend)
  if (id.includes("legend")) return <FaCrown className="text-yellow-600" size={size} />
  
  // Серия (streak)
  if (id.includes("streak")) return <FaFire className="text-orange-500" size={size} />
  
  // Опыт (xp)
  if (id.includes("xp")) return <FaStar className="text-yellow-500" size={size} />
  
  // Пройденная категория (category)
  if (id.includes("category")) return <FaTrophy className="text-green-500" size={size} />
  
  // Выученные слова (words)
  if (id.includes("words")) return <FaBook className="text-blue-500" size={size} />
  
  // Карточки (flashcard)
  if (id.includes("flashcard")) return <FaIdCard className="text-purple-500" size={size} />
  
  // Точность (accuracy)
  if (id.includes("accuracy")) return <FaBullseye className="text-teal-500" size={size} />
  
  // Мастер (master)
  if (id.includes("master")) return <FaCrown className="text-amber-500" size={size} />
  
  // Глобальное (global)
  if (id.includes("global")) return <FaGlobe className="text-indigo-500" size={size} />
  
  // Скорость (speed)
  if (id.includes("speed")) return <FaRocket className="text-red-500" size={size} />
  
  // Интеллект (brain)
  if (id.includes("brain")) return <FaBrain className="text-emerald-500" size={size} />
  
  // Ежедневное (daily)
  if (id.includes("daily")) return <FaCalendarAlt className="text-sky-500" size={size} />
  
  // Прогресс (progress)
  if (id.includes("progress")) return <FaChartLine className="text-lime-500" size={size} />
  
  // По умолчанию
  return <FaGraduationCap className="text-gray-500" size={size} />
}