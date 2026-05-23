"use client"

import { useState } from "react"
import { words } from "../../data/words"
import { grammarTasks } from "../../data/grammar"

export default function ReferenceView() {
  const [searchQuery, setSearchQuery] = useState("")

  // Специфические буквы словацкого алфавита
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

  // Объединяем всю лексику и грамматику для поиска
  const allEntries = [...words, ...grammarTasks]

  const filteredEntries = allEntries.filter(
    (item) =>
      item.slovak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.russian.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 pb-24 animate-fadeIn">
      <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">📚 Справочник языка</h2>

      {/* РАЗДЕЛ 1: Алфавит и фонетика */}
      <div className="bg-white p-5 rounded-2xl border-2 border-b-6 border-gray-200 mb-8 shadow-sm">
        <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
          <span>🔤</span> Особые буквы и произношение
        </h3>
        <p className="text-sm text-gray-500 font-bold mb-4">
          В словацком языке значок над буквой (dĺžeň) удлиняет звук, а птичка (mäkčeň) смягчает его.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-gray-400 font-bold uppercase text-xs">
                <th className="pb-2">Буква</th>
                <th className="pb-2">Как звучит</th>
                <th className="pb-2">Пример</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
              {alphabet.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 text-orange-500 font-black text-base">{item.letter}</td>
                  <td className="py-2 text-gray-600 font-medium">{item.sound}</td>
                  <td className="py-2 text-gray-400 italic">{item.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* РАЗДЕЛ 2: Поисковый словарь */}
      <div className="bg-white p-5 rounded-2xl border-2 border-b-6 border-gray-200 shadow-sm">
        <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
          <span>🔍</span> Интерактивный словарь ({allEntries.length})
        </h3>
        
        <input
          type="text"
          placeholder="Поиск слова или правила (на русском или словацком)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all mb-4"
        />

        <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="font-black text-gray-800 text-base leading-tight">{item.slovak}</p>
                  <p className="text-sm font-bold text-gray-500 mt-0.5">{item.russian}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md">
                    {item.level}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 truncate max-w-[120px]">
                    {item.category.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '').trim()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm font-bold text-gray-400 py-6">Ничего не найдено 😢</p>
          )}
        </div>
      </div>
    </div>
  )
}