"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaVolumeUp, FaVolumeMute, FaMicrophoneAlt, FaTachometerAlt, FaPalette, FaCheck } from "react-icons/fa"
import { Settings } from "../../hooks/useSettings"
import { Theme } from "../../hooks/useTheme"

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onToggleMute: () => void
  onSetSpeechRate: (rate: number) => void
  onSetAutoSpeak: (enabled: boolean) => void
  onSetVolume: (volume: number) => void
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
  onSetVolume,
  theme,
  onToggleTheme,
}: SettingsModalProps) {
  const [localVolume, setLocalVolume] = useState(settings.volume)
  const [localSpeechRate, setLocalSpeechRate] = useState(settings.speechRate)

  // Синхронизация локальных состояний с пропсами
  useEffect(() => {
    setLocalVolume(settings.volume)
  }, [settings.volume])

  useEffect(() => {
    setLocalSpeechRate(settings.speechRate)
  }, [settings.speechRate])

  // Обработчики с плавным обновлением
  const handleVolumeChange = (value: number) => {
    setLocalVolume(value)
    onSetVolume(value)
  }

  const handleRateChange = (value: number) => {
    setLocalSpeechRate(value)
    onSetSpeechRate(value)
  }

  // Блокировка прокрутки фона при открытом модальном окне
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Заголовок с градиентом */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/5 dark:to-amber-500/5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-black flex items-center gap-2 text-gray-800 dark:text-white">
                <span className="text-2xl">⚙️</span>
                Настройки
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Основной контент */}
            <div className="p-6 space-y-6">
              {/* Тёмная тема */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                    <FaPalette className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">Тёмная тема</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Визуальный стиль интерфейса</p>
                  </div>
                </div>
                <button
                  onClick={onToggleTheme}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                    theme === "dark" ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Звуки */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    {settings.isMuted ? <FaVolumeMute className="text-white text-lg" /> : <FaVolumeUp className="text-white text-lg" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">Звуки</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Игровые звуки и уведомления</p>
                  </div>
                </div>
                <button
                  onClick={onToggleMute}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    settings.isMuted
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {settings.isMuted ? "Выключены" : "Включены"}
                </button>
              </div>

              {/* Громкость */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                      <FaVolumeUp className="text-white text-lg" />
                    </div>
                    <p className="font-bold text-gray-800 dark:text-white">Громкость звуков</p>
                  </div>
                  <span className="text-sm font-bold text-orange-500">{Math.round(localVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={localVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>🔇 Тише</span>
                  <span>🔊 Громче</span>
                </div>
              </div>

              {/* Скорость речи */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <FaTachometerAlt className="text-white text-lg" />
                    </div>
                    <p className="font-bold text-gray-800 dark:text-white">Скорость речи</p>
                  </div>
                  <span className="text-sm font-bold text-orange-500">{localSpeechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={localSpeechRate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-400 px-1">
                  <span>🐢 Медленнее</span>
                  <span>⭐ Норма</span>
                  <span>🐇 Быстрее</span>
                </div>
              </div>

              {/* Автоозвучка */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                    <FaMicrophoneAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">Автоозвучка</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">При правильном ответе</p>
                  </div>
                </div>
                <button
                  onClick={() => onSetAutoSpeak(!settings.autoSpeakOnCorrect)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                    settings.autoSpeakOnCorrect ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ${
                      settings.autoSpeakOnCorrect ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Кнопка закрытия */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Готово
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}