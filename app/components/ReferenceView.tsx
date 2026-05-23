"use client"

import { useState, useMemo } from "react"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { type WordStats } from "../../lib/game"
import { initAudio } from "../../lib/sounds"

import {
  FaSearch, FaCalendarAlt, FaChartLine, FaSkull, FaQuestionCircle,
  FaFire, FaStar, FaTrophy, FaBook, FaCheckCircle, FaRegSmile, FaGraduationCap,
  FaHeart 
} from "react-icons/fa"
type ReferenceViewProps = {
  progressData: Record<string, number>
  activeDates: string[]
  wordStatsMap: Map<string, WordStats>
}

export default function ReferenceView({ progressData, activeDates, wordStatsMap }: ReferenceViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  // --------------------------------------------------------------
  // 1. Статистика (общая)
  // --------------------------------------------------------------
  const allItems = [...words, ...grammarTasks]
  const categoryTotalCount: Record<string, number> = {}
  allItems.forEach(item => {
    const key = `${item.level}_${item.category}`
    categoryTotalCount[key] = (categoryTotalCount[key] || 0) + 1
  })

  let studiedCategoriesCount = 0
  let totalLearnedWords = 0
  Object.entries(progressData).forEach(([key, passed]) => {
    const total = categoryTotalCount[key] || 1
    if (passed >= total) {
      studiedCategoriesCount++
      totalLearnedWords += total
    } else {
      totalLearnedWords += passed
    }
  })

  let totalCorrect = 0
  let totalWrong = 0
  wordStatsMap.forEach(stat => {
    totalCorrect += stat.correctCount
    totalWrong += stat.wrongCount
  })
  const accuracy = totalCorrect + totalWrong > 0
    ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
    : 0

  // --------------------------------------------------------------
  // 2. Активность за последние 30 дней (календарь)
  // --------------------------------------------------------------
  const today = new Date()
  const last30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(today.getDate() - i)
      return d.toISOString().slice(0, 10)
    }).reverse()
  }, [today])
  const activitySet = new Set(activeDates)
  const activeDaysCount = activeDates.filter(date => last30Days.includes(date)).length

  // --------------------------------------------------------------
  // 3. Прогресс по уровням (A1–C1)
  // --------------------------------------------------------------
  const levelStats = useMemo(() => {
    const levels = ["A1", "A2", "B1", "B2", "C1"] as const
    return levels.map(level => {
      const itemsInLevel = allItems.filter(item => item.level === level)
      const total = itemsInLevel.length
      if (total === 0) return { level, total, learned: 0, percent: 0 }
      const categories = new Set(itemsInLevel.map(i => i.category))
      let learnedWordsCount = 0
      categories.forEach(cat => {
        const totalInCat = itemsInLevel.filter(i => i.category === cat).length
        const passed = progressData[`cat_progress_${level}_${cat}`] || 0
        learnedWordsCount += Math.min(passed, totalInCat)
      })
      const percent = (learnedWordsCount / total) * 100
      return { level, total, learned: learnedWordsCount, percent }
    })
  }, [progressData, allItems])

  // --------------------------------------------------------------
  // 4. Топ-3 сложных слов
  // --------------------------------------------------------------
  const hardWords = useMemo(() => {
    const wordsWithErrors: { word: string; translation: string; wrong: number; correct: number }[] = []
    wordStatsMap.forEach((stat, key) => {
      if (stat.wrongCount > 0 || stat.correctCount > 0) {
        const [slovak, russian] = key.split("|")
        wordsWithErrors.push({
          word: slovak,
          translation: russian,
          wrong: stat.wrongCount,
          correct: stat.correctCount,
        })
      }
    })
    wordsWithErrors.sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
    return wordsWithErrors.slice(0, 3)
  }, [wordStatsMap])

  // --------------------------------------------------------------
  // 5. Алфавит
  // --------------------------------------------------------------
  const alphabet = [
    { letter: "Á / á", sound: "Долгая [а]", example: "káva (кофе)" },
    { letter: "Ä / ä", sound: "Широкая [э] или обычная [э/е]", example: "mäso (мясо)" },
    { letter: "Č / č", sound: "Мягкая [ч], как в русском", example: "čaj (чай)" },
    { letter: "Ď / ď", sound: "Очень мягкая [дь]", example: "ďakujem (спасибо)" },
    { letter: "Dz / dz", sound: "Слитный звук [дз]", example: "odovzdať (передать)" },
    { letter: "Dž / dž", sound: "Слитный звук [дж], как в 'jungle'", example: "džús (сок)" },
    { letter: "Ľ / ľ", sound: "Мягкая [ль]", example: "ľudia (люди)" },
    { letter: "Ĺ / ĺ", sound: "Долгий слогообразующий [л]", example: "dĺžka (длина)" },
    { letter: "Ň / ň", sound: "Мягкая [нь]", example: "neňo (дядя)" },
    { letter: "Ô / ô", sound: "Дифтонг [уо], произносится слитно", example: "stôl (стол)" },
    { letter: "Ŕ / ŕ", sound: "Долгий слогообразующий [р]", example: "vŕba (ива)" },
    { letter: "Š / š", sound: "Мягкая [ш], мягче русской", example: "škola (школа)" },
    { letter: "Ť / ť", sound: "Очень мягкая [ть]", example: "tešiť (радовать)" },
    { letter: "Ž / ž", sound: "Мягкая [ж]", example: "žena (женщина)" },
  ]

  // --------------------------------------------------------------
  // 6. Словарь (фильтрация по поиску)
  // --------------------------------------------------------------
  const filteredEntries = allItems.filter(
    (item) =>
      item.slovak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.russian.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-24 animate-fadeIn">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 text-center">📚 Справочник языка</h2>

      {/* БЛОК 1: Общая статистика (ваш дизайн, но с иконками) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <FaChartLine className="text-blue-500" /> Ваша статистика
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-3xl font-black text-orange-500">{totalLearnedWords}</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500">слов изучено</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-green-500">{accuracy}%</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500">точность</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-500">{studiedCategoriesCount}</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500">тем завершено</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-purple-500">{activeDates.length}</p>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500">дней активности</p>
          </div>
        </div>
      </div>

      {/* БЛОК 2: Активность за 30 дней (календарь) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <FaCalendarAlt className="text-orange-500" /> Активность за последние 30 дней
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Занимались {activeDaysCount} из 30 дней
        </p>
        <div className="flex flex-wrap gap-1">
          {last30Days.map(day => {
            const isActive = activitySet.has(day)
            const dayOfMonth = new Date(day).getDate()
            return (
              <div
                key={day}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
                title={day}
              >
                {dayOfMonth}
              </div>
            )
          })}
        </div>
      </div>

      {/* БЛОК 3: Прогресс по уровням */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <FaGraduationCap className="text-indigo-500" /> Прогресс по уровням
        </h3>
        <div className="space-y-3">
          {levelStats.map(stat => (
            <div key={stat.level}>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-gray-700 dark:text-gray-300">Уровень {stat.level}</span>
                <span className="text-gray-500 dark:text-gray-400">{stat.learned}/{stat.total} слов</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* БЛОК 4: Топ-3 сложных слов */}
      {hardWords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
          <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <FaSkull className="text-red-500" /> Самые сложные слова
          </h3>
          <div className="space-y-2">
            {hardWords.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                <div>
                  <p className="font-bold text-gray-800 dark:text-white">{item.word}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.translation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-500">Ошибок: {item.wrong}</p>
                  <p className="text-xs text-green-500">Правильно: {item.correct}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">💡 Повторите эти слова в режиме «Карточки» или «Письмо».</p>
        </div>
      )}

     {/* БЛОК 5: Часто задаваемые вопросы */}
<div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
  <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
    <FaQuestionCircle className="text-purple-500" /> Часто задаваемые вопросы
  </h3>
  <div className="space-y-3 text-sm">
    <div>
      <p className="font-bold text-gray-800 dark:text-white flex items-center gap-1">
        <FaStar className="text-yellow-500" size={12} /> Как заработать XP?
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Правильные ответы: тест – 10 XP, письмо – 15 XP, карточки – 5 XP. Бонус за завершение урока – 50 XP. Достижения также приносят XP.
      </p>
    </div>
    <div>
      <p className="font-bold text-gray-800 dark:text-white flex items-center gap-1">
        <FaFire className="text-orange-500" size={12} /> Зачем нужна серия (streak)?
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        Серия мотивирует заниматься каждый день. Некоторые достижения требуют высокой серии.
      </p>
    </div>
    <div>
      <p className="font-bold text-gray-800 dark:text-white flex items-center gap-1">
        <FaRegSmile className="text-green-500" size={12} /> Можно ли учить одно слово несколько раз в день?
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        XP за слово начисляется только раз в день (чтобы избежать фарма), но повторять слова для закрепления можно сколько угодно.
      </p>
    </div>
    <div>
      <p className="font-bold text-gray-800 dark:text-white flex items-center gap-1">
        <FaHeart className="text-red-500" size={12} /> Как работают жизни?
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        При начале нового урока или при нажатии «Попробовать снова» жизни сбрасываются до 3. В будущем планируется магазин, где можно будет приобрести дополнительные жизни.
      </p>
    </div>
  </div>
</div>

      {/* БЛОК 6: Алфавит (ваш оригинальный блок) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
        <h3 className="text-lg font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <span>🔤</span> Особые буквы и произношение
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-4">
          В словацком языке значок над буквой (dĺžeň) удлиняет звук, а птичка (mäkčeň) смягчает его.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-bold uppercase text-xs">
                <th className="pb-2">Буква</th>
                <th className="pb-2">Как звучит</th>
                <th className="pb-2">Пример</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 font-bold text-gray-700 dark:text-gray-300">
              {alphabet.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2 text-orange-500 font-black text-base">{item.letter}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400 font-medium">{item.sound}</td>
                  <td className="py-2 text-gray-400 dark:text-gray-500 italic">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* БЛОК 7: Словарь (ваш оригинальный блок) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <FaSearch className="text-orange-500" /> Интерактивный словарь ({allItems.length})
        </h3>
        <input
          type="text"
          placeholder="Поиск слова или правила (на русском или словацком)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-all mb-4"
        />
        <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-800 dark:text-white text-base leading-tight">{item.slovak}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); speakText(item.slovak, "sk-SK"); }}
                      className="text-sm text-gray-400 dark:text-gray-500 hover:text-orange-500 transition-colors"
                      aria-label="Прослушать произношение"
                    >
                      🔊
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-0.5">{item.russian}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-md">
                    {item.level}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 truncate max-w-[120px]">
                    {item.category.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '').trim()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm font-bold text-gray-400 dark:text-gray-500 py-6">Ничего не найдено 😢</p>
          )}
        </div>
      </div>
    </div>
  )
}