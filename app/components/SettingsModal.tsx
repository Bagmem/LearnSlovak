"use client"

import { useEffect } from "react"
import { Settings } from "../../hooks/useSettings"
import { Theme } from "../../hooks/useTheme"

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onToggleMute: () => void
  onSetSpeechRate: (rate: number) => void
  onSetAutoSpeak: (enabled: boolean) => void
  theme: Theme
  onToggleTheme: () => void
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onToggleMute,
  onSetSpeechRate,
  onSetAutoSpeak,
  theme,
  onToggleTheme,
}: SettingsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden animate-slideInScale">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-black text-gray-800 dark:text-white">⚙️ Настройки</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <label className="font-bold text-gray-700 dark:text-gray-300">🌙 Тёмная тема</label>
            <button
              onClick={onToggleTheme}
              className={`px-4 py-2 rounded-xl font-black transition-all ${
                theme === "dark"
                  ? "bg-indigo-100 text-indigo-600 border border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300"
                  : "bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {theme === "dark" ? "Включена" : "Выключена"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-bold text-gray-700 dark:text-gray-300">🔊 Звуки</label>
            <button
              onClick={onToggleMute}
              className={`px-4 py-2 rounded-xl font-black transition-all ${
                settings.isMuted
                  ? "bg-red-100 text-red-600 border border-red-300 dark:bg-red-900 dark:text-red-300"
                  : "bg-green-100 text-green-600 border border-green-300 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {settings.isMuted ? "Выключены" : "Включены"}
            </button>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">🗣️ Скорость речи</label>
              <span className="text-sm font-bold text-orange-500">{settings.speechRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.speechRate}
              onChange={(e) => onSetSpeechRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Медленнее</span>
              <span>Норма</span>
              <span>Быстрее</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-bold text-gray-700 dark:text-gray-300">🔊 Автоозвучка при правильном ответе</label>
            <button
              onClick={() => onSetAutoSpeak(!settings.autoSpeakOnCorrect)}
              className={`px-4 py-2 rounded-xl font-black transition-all ${
                settings.autoSpeakOnCorrect
                  ? "bg-green-100 text-green-600 border border-green-300 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 text-gray-500 border border-gray-300 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {settings.autoSpeakOnCorrect ? "Вкл" : "Выкл"}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  )
}