"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { type WordStats } from "../../lib/game"
import {
  FaSearch, FaCalendarAlt, FaChartLine, FaSkull, FaQuestionCircle,
  FaFire, FaStar, FaTrophy, FaBook, FaCheckCircle, FaRegSmile, FaGraduationCap, FaHeart, FaVolumeUp
} from "react-icons/fa"

type ReferenceViewProps = {
  progressData: Record<string, number>
  activeDates: string[]
  wordStatsMap: Map<string, WordStats>
}

export default function ReferenceView({ progressData, activeDates, wordStatsMap }: ReferenceViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const speakText = (text: string, lang: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const allItems = [...words, ...grammarTasks]
  
  const categoryTotalCount: Record<string, number> = {}
  allItems.forEach(i => {
    const key = `${i.level}_${i.category}`
    categoryTotalCount[key] = (categoryTotalCount[key] || 0) + 1
  })

  let completedCategories = 0
  Object.entries(progressData).forEach(([key, passed]) => {
    const total = categoryTotalCount[key] || 1
    if (passed >= total) completedCategories++
  })

  let totalCorrectAnswers = 0
  let totalWrongAnswers = 0
  wordStatsMap.forEach(stat => {
    totalCorrectAnswers += stat.correctCount
    totalWrongAnswers += stat.wrongCount
  })
  const accuracy = totalCorrectAnswers + totalWrongAnswers
    ? Math.round((totalCorrectAnswers / (totalCorrectAnswers + totalWrongAnswers)) * 100)
    : 0

  const uniqueLearnedWords = Array.from(wordStatsMap.values()).filter(stat => stat.correctCount > 0).length

  const today = new Date()
  const last30Days = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(today.getDate() - i); return d.toISOString().slice(0, 10)
  }).reverse(), [today])
  const activitySet = new Set(activeDates)
  const activeDaysCount = activeDates.filter(date => last30Days.includes(date)).length

  const levelStats = useMemo(() => {
    const levels = ["A1","A2","B1","B2","C1"] as const
    return levels.map(level => {
      const items = allItems.filter(i => i.level === level)
      const total = items.length
      if (!total) return { level, total, learned: 0, percent: 0 }
      const cats = new Set(items.map(i => i.category))
      let learned = 0
      cats.forEach(cat => {
        const totalInCat = items.filter(i => i.category === cat).length
        const passed = progressData[`cat_progress_${level}_${cat}`] || 0
        learned += Math.min(passed, totalInCat)
      })
      return { level, total, learned, percent: (learned / total) * 100 }
    })
  }, [progressData, allItems])

  const hardWords = useMemo(() => {
    const wordsList: { word: string; translation: string; wrong: number; correct: number }[] = []
    wordStatsMap.forEach((stat, key) => {
      if (stat.wrongCount > 0 || stat.correctCount > 0) {
        const [slovak, russian] = key.split("|")
        wordsList.push({ word: slovak, translation: russian, wrong: stat.wrongCount, correct: stat.correctCount })
      }
    })
    wordsList.sort((a,b) => (b.wrong - b.correct) - (a.wrong - a.correct))
    return wordsList.slice(0, 5)
  }, [wordStatsMap])

  const alphabet = [
    { letter: "Á / á", sound: "Долгая [а]", example: "káva" },
    { letter: "Ä / ä", sound: "Широкая [э]", example: "mäso" },
    { letter: "Č / č", sound: "Мягкая [ч]", example: "čaj" },
    { letter: "Ď / ď", sound: "Мягкая [дь]", example: "ďakujem" },
    { letter: "Dz / dz", sound: "Слитный [дз]", example: "odovzdať" },
    { letter: "Dž / dž", sound: "Слитный [дж]", example: "džús" },
    { letter: "Ľ / ľ", sound: "Мягкая [ль]", example: "ľudia" },
    { letter: "Ĺ / ĺ", sound: "Долгий [л]", example: "dĺžka" },
    { letter: "Ň / ň", sound: "Мягкая [нь]", example: "neňo" },
    { letter: "Ô / ô", sound: "Дифтонг [уо]", example: "stôl" },
    { letter: "Ŕ / ŕ", sound: "Долгий [р]", example: "vŕba" },
    { letter: "Š / š", sound: "Мягкая [ш]", example: "škola" },
    { letter: "Ť / ť", sound: "Мягкая [ть]", example: "tešiť" },
    { letter: "Ž / ž", sound: "Мягкая [ж]", example: "žena" },
  ]

  const filteredEntries = allItems.filter(i =>
    i.slovak.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.russian.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
      let start = 0
      const end = value
      if (start === end) return
      const duration = 800
      const step = Math.ceil(end / (duration / 16))
      const timer = setInterval(() => {
        start += step
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, 16)
      return () => clearInterval(timer)
    }, [value])
    return <span>{count}{suffix}</span>
  }

  return (
    <div className="w-full px-4 py-6 pb-24">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center gap-2">
          <span className="text-4xl md:text-5xl">📚</span>
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Справочник
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Статистика, алфавит и словарь</p>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        {[
          { value: uniqueLearnedWords, label: "слов изучено", icon: <FaBook className="text-blue-500 text-3xl" />, bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20", color: "text-blue-600 dark:text-blue-400" },
          { value: completedCategories, label: "тем завершено", icon: <FaCheckCircle className="text-green-500 text-3xl" />, bg: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20", color: "text-green-600 dark:text-green-400" },
          { value: accuracy, suffix: "%", label: "точность", icon: <FaTrophy className="text-yellow-500 text-3xl" />, bg: "from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20", color: "text-yellow-600 dark:text-yellow-400" },
          { value: activeDates.length, label: "дней активности", icon: <FaFire className="text-orange-500 text-3xl" />, bg: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20", color: "text-orange-600 dark:text-orange-400" }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
            className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 text-center`}
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className={`text-4xl font-black ${stat.color}`}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
            </p>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-300 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Активность */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-orange-500" /> Активность за 30 дней
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Занимались {activeDaysCount} из 30 дней</p>
        <div className="flex flex-wrap gap-1 justify-center">
          {last30Days.map((day, idx) => {
            const isActive = activitySet.has(day)
            const dayNum = new Date(day).getDate()
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.01 }}
                whileHover={{ scale: 1.1 }}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
                title={day}
              >
                {dayNum}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Прогресс по уровням */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaGraduationCap className="text-indigo-500" /> Прогресс по уровням
        </h3>
        <div className="space-y-4">
          {levelStats.map(stat => (
            <div key={stat.level}>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-gray-700 dark:text-gray-300">Уровень {stat.level}</span>
                <span className="text-gray-500 dark:text-gray-400">{stat.learned}/{stat.total} слов</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.percent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Сложные слова */}
      {hardWords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-br from-white to-red-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg"
        >
          <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <FaSkull className="text-red-500" /> Самые сложные слова
          </h3>
          <div className="space-y-3">
            {hardWords.map((w, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{w.word}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{w.translation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">Ошибок: {w.wrong}</p>
                  <p className="text-xs text-green-500">Правильно: {w.correct}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">💡 Повторите эти слова в карточках или письме.</p>
        </motion.div>
      )}

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaQuestionCircle className="text-purple-500" /> Часто задаваемые вопросы
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {[
            { icon: <FaStar className="text-yellow-500" />, q: "Как заработать XP?", a: "Тест – 10 XP, письмо – 15 XP, карточки – 5 XP. Бонус за урок – 50 XP." },
            { icon: <FaFire className="text-orange-500" />, q: "Зачем нужна серия?", a: "Серия мотивирует заниматься каждый день." },
            { icon: <FaRegSmile className="text-green-500" />, q: "Можно ли учить слово несколько раз в день?", a: "XP начисляется только раз в день, но повторять можно сколько угодно." },
            { icon: <FaHeart className="text-red-500" />, q: "Как работают жизни?", a: "При старте урока или кнопке «Попробовать снова» жизни сбрасываются до 3." }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/50 dark:bg-gray-700/30">
              <p className="font-bold flex items-center gap-2 text-gray-800 dark:text-white">{item.icon} {item.q}</p>
              <p className="text-gray-600 dark:text-gray-400 pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Алфавит */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3 flex items-center gap-2">🔤 Особые буквы и произношение</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Значок над буквой (dĺžeň) удлиняет звук, птичка (mäkčeň) смягчает.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left text-gray-600 dark:text-gray-400">Буква</th>
                <th className="pb-2 text-left text-gray-600 dark:text-gray-400">Звук</th>
                <th className="pb-2 text-left text-gray-600 dark:text-gray-400">Пример</th>
              </tr>
            </thead>
            <tbody>
              {alphabet.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-2 text-orange-600 dark:text-orange-400 font-black">{item.letter}</td>
                  <td className="py-2 text-gray-700 dark:text-gray-300">{item.sound}</td>
                  <td className="py-2 text-gray-500 dark:text-gray-400 italic">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Словарь */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
      >
        <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaSearch className="text-orange-500" /> Интерактивный словарь ({allItems.length})
        </h3>
        <div className="relative mb-5">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск слова по-словацки или по-русски..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl font-medium focus:ring-2 focus:ring-orange-400 transition outline-none text-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scroll">
          {filteredEntries.length ? (
            filteredEntries.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.005 }}
                whileHover={{ backgroundColor: "rgba(249,115,22,0.08)" }}
                onClick={() => speakText(item.slovak, "sk-SK")}
                className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-black text-gray-800 dark:text-white">{item.slovak}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakText(item.slovak, "sk-SK"); }}
                      className="text-gray-400 hover:text-orange-500 transition"
                      title="Озвучить"
                    >
                      <FaVolumeUp size={14} />
                    </button>
                    <span className="text-[10px] font-black uppercase bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full text-orange-700 dark:text-orange-300">
                      {item.level}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.russian}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Ничего не найдено</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}