"use client"

import { useState, useMemo } from "react"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { type WordStats } from "../../lib/game"
import { initAudio } from "../../lib/sounds"
import {
  FaSearch, FaCalendarAlt, FaChartLine, FaSkull, FaQuestionCircle,
  FaFire, FaStar, FaTrophy, FaBook, FaCheckCircle, FaRegSmile, FaGraduationCap, FaHeart
} from "react-icons/fa"

type ReferenceViewProps = {
  progressData: Record<string, number>
  activeDates: string[]
  wordStatsMap: Map<string, WordStats>
}

export default function ReferenceView({ progressData, activeDates, wordStatsMap }: ReferenceViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
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

  let studiedCategories = 0, totalLearnedWords = 0
  Object.entries(progressData).forEach(([key, passed]) => {
    const total = categoryTotalCount[key] || 1
    if (passed >= total) studiedCategories++
    totalLearnedWords += Math.min(passed, total)
  })

  let totalCorrect = 0, totalWrong = 0
  wordStatsMap.forEach(stat => { totalCorrect += stat.correctCount; totalWrong += stat.wrongCount })
  const accuracy = totalCorrect + totalWrong ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0

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
    return wordsList.slice(0, 3)
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

  return (
    <div className="w-full px-4 py-6 pb-24 animate-fadeIn">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 text-center">📚 Справочник языка</h2>

      {/* Статистика */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FaChartLine className="text-blue-500" /> Ваша статистика</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-700/30">
            <p className="text-3xl font-black text-orange-500">{totalLearnedWords}</p>
            <p className="text-xs font-bold text-gray-400">слов изучено</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-700/30">
            <p className="text-3xl font-black text-green-500">{accuracy}%</p>
            <p className="text-xs font-bold text-gray-400">точность</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-700/30">
            <p className="text-3xl font-black text-blue-500">{studiedCategories}</p>
            <p className="text-xs font-bold text-gray-400">тем завершено</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white dark:bg-gray-700/30">
            <p className="text-3xl font-black text-purple-500">{activeDates.length}</p>
            <p className="text-xs font-bold text-gray-400">дней активности</p>
          </div>
        </div>
      </div>

      {/* Активность 30 дней */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-2 flex items-center gap-2"><FaCalendarAlt className="text-orange-500" /> Активность за 30 дней</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Занимались {activeDaysCount} из 30 дней</p>
        <div className="flex flex-wrap gap-1">
          {last30Days.map(day => {
            const isActive = activitySet.has(day)
            const dayNum = new Date(day).getDate()
            return (
              <div key={day} className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                isActive ? "bg-green-500 text-white shadow-sm" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`} title={day}>{dayNum}</div>
            )
          })}
        </div>
      </div>

      {/* Прогресс по уровням */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FaGraduationCap className="text-indigo-500" /> Прогресс по уровням</h3>
        <div className="space-y-3">
          {levelStats.map(stat => (
            <div key={stat.level}>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span>Уровень {stat.level}</span>
                <span>{stat.learned}/{stat.total} слов</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all" style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Сложные слова */}
      {hardWords.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
          <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FaSkull className="text-red-500" /> Самые сложные слова</h3>
          <div className="space-y-2">
            {hardWords.map((w,i) => (
              <div key={i} className="flex justify-between border-b pb-2 last:border-0">
                <div><p className="font-bold">{w.word}</p><p className="text-xs text-gray-500">{w.translation}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-red-500">Ошибок: {w.wrong}</p><p className="text-xs text-green-500">Правильно: {w.correct}</p></div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">💡 Повторите эти слова в карточках или письме.</p>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm">
        <h3 className="font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FaQuestionCircle className="text-purple-500" /> Часто задаваемые вопросы</h3>
        <div className="space-y-3 text-sm">
          <div><p className="font-bold flex items-center gap-1"><FaStar className="text-yellow-500" size={12} /> Как заработать XP?</p><p className="text-gray-600 dark:text-gray-400">Тест – 10 XP, письмо – 15 XP, карточки – 5 XP. Бонус за урок – 50 XP.</p></div>
          <div><p className="font-bold flex items-center gap-1"><FaFire className="text-orange-500" size={12} /> Зачем нужна серия?</p><p className="text-gray-600 dark:text-gray-400">Серия мотивирует заниматься каждый день.</p></div>
          <div><p className="font-bold flex items-center gap-1"><FaRegSmile className="text-green-500" size={12} /> Можно ли учить слово несколько раз в день?</p><p className="text-gray-600 dark:text-gray-400">XP начисляется только раз в день, но повторять можно сколько угодно.</p></div>
          <div><p className="font-bold flex items-center gap-1"><FaHeart className="text-red-500" size={12} /> Как работают жизни?</p><p className="text-gray-600 dark:text-gray-400">При старте урока или кнопке «Попробовать снова» жизни сбрасываются до 3.</p></div>
        </div>
      </div>

      {/* Алфавит */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
        <h3 className="text-lg font-black flex items-center gap-2 mb-3">🔤 Особые буквы и произношение</h3>
        <p className="text-sm text-gray-500 mb-4">Значок над буквой (dĺžeň) удлиняет звук, птичка (mäkčeň) смягчает.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="border-b text-gray-400 text-xs"><th className="pb-2">Буква</th><th className="pb-2">Звук</th><th className="pb-2">Пример</th></tr></thead>
            <tbody className="divide-y">
              {alphabet.map((item,idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2 text-orange-500 font-black">{item.letter}</td>
                  <td className="py-2 text-gray-600">{item.sound}</td>
                  <td className="py-2 text-gray-400 italic">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Словарь */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-black mb-3 flex items-center gap-2"><FaSearch className="text-orange-500" /> Интерактивный словарь ({allItems.length})</h3>
        <input type="text" placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl font-bold mb-4 focus:border-orange-400 transition" />
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredEntries.length ? filteredEntries.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border">
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="font-black">{item.slovak}</p><button onClick={() => speakText(item.slovak, "sk-SK")} className="text-gray-400 hover:text-orange-500">🔊</button></div>
                <p className="text-sm font-bold text-gray-500">{item.russian}</p>
              </div>
              <div className="text-right"><span className="text-[10px] font-black uppercase bg-orange-100 dark:bg-orange-900 px-2 py-0.5 rounded-md">{item.level}</span></div>
            </div>
          )) : <p className="text-center py-6">Ничего не найдено</p>}
        </div>
      </div>
    </div>
  )
}