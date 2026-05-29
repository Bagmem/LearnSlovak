"use client"

import { motion } from "framer-motion"
import { FaSearch, FaVolumeUp } from "react-icons/fa"

type ReferenceDictionaryProps = {
  allItems: any[]
  levelFilter: string
  setLevelFilter: (level: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredEntries: any[]
  speakText: (text: string, lang: string) => void
}

export default function ReferenceDictionary({
  allItems,
  levelFilter,
  setLevelFilter,
  searchQuery,
  setSearchQuery,
  filteredEntries,
  speakText,
}: ReferenceDictionaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-lg"
    >
      <h3 className="font-black text-xl text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FaSearch className="text-orange-500" /> Интерактивный словарь ({allItems.length})
      </h3>
      <div className="flex flex-wrap gap-2 mb-5">
        {["all", "A1", "A2", "B1", "B2", "C1"].map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
              levelFilter === level
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {level === "all" ? "Все уровни" : level}
          </button>
        ))}
      </div>
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
              className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-black text-gray-800 dark:text-white">{item.slovak}</p>
                  <button onClick={(e) => { e.stopPropagation(); speakText(item.slovak, "sk-SK"); }} className="text-gray-400 hover:text-orange-500 transition" title="Озвучить"><FaVolumeUp size={14} /></button>
                  <span className="text-[10px] font-black uppercase bg-orange-100 dark:bg-orange-900/50 px-2 py-0.5 rounded-full text-orange-700 dark:text-orange-300">{item.level}</span>
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
  )
}