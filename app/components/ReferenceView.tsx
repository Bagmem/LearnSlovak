"use client"

import { useState, useEffect } from "react"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"
import { type WordStats } from "../../lib/game"
import { initAudio } from "../../lib/sounds"

type ReferenceViewProps = {
  progressData: Record<string, number>
  activeDates: string[]
  wordStatsMap: Map<string, WordStats>
}

export default function ReferenceView({ progressData, activeDates, wordStatsMap }: ReferenceViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    initAudio()
  }, [])

  const speakText = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

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
  const accuracy = totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0

  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() - i)
    return d.toISOString().slice(0, 10)
  }).reverse()
  const activityMap = new Map<string, boolean>()
  activeDates.forEach(date => activityMap.set(date, true))

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

  const filteredEntries = allItems.filter(
    (item) =>
      item.slovak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.russian.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-24 animate-fadeIn">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 text-center">📚 Справочник языка</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
        <h3 className="font-black text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
          <span>📊</span> Ваша статистика
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
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">Активность за последние 7 дней:</p>
          <div className="flex justify-between gap-1">
            {last7Days.map(day => {
              const isActive = activityMap.has(day)
              const dayOfWeek = new Date(day).toLocaleDateString("ru-RU", { weekday: "short" })
              return (
                <div key={day} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    isActive ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}>
                    {isActive ? "✓" : "○"}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1">{dayOfWeek}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

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

      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-black text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <span>🔍</span> Интерактивный словарь ({allItems.length})
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