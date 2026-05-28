"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FaTimes, FaVolumeUp, FaVolumeMute, FaMicrophoneAlt, 
  FaTachometerAlt, FaPalette, FaCheck 
} from "react-icons/fa"
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
  // Блокировка прокрутки фона
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

  const handleVolumeChange = (value: number) => onSetVolume(value)
  const handleRateChange = (value: number) => onSetSpeechRate(value)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-800"
          >
            {/* Заголовок с градиентом и кнопкой закрытия */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-500/5 dark:to-amber-500/5 border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <h2 className="text-xl font-black bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                  Настройки
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400"
                aria-label="Закрыть"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Внешний вид */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                      <FaPalette className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">Тёмная тема</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Интерфейс в тёмных тонах</p>
                    </div>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                      theme === "dark" ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Звук и уведомления */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                      {settings.isMuted ? <FaVolumeMute className="text-white text-lg" /> : <FaVolumeUp className="text-white text-lg" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">Звуковые эффекты</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Клик, правильный/неправильный ответ</p>
                    </div>
                  </div>
                  <button
                    onClick={onToggleMute}
                    className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                      settings.isMuted
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {settings.isMuted ? "Выкл" : "Вкл"}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Громкость</span>
                    <span className="text-sm font-bold text-orange-500">{Math.round(settings.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={settings.volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-amber-500 [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>🔇 Тише</span>
                    <span>🔊 Громче</span>
                  </div>
                </div>
              </div>

              {/* Голос и озвучка */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                      <FaMicrophoneAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">Автоозвучка</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Произносить слово после правильного ответа</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSetAutoSpeak(!settings.autoSpeakOnCorrect)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                      settings.autoSpeakOnCorrect ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                        settings.autoSpeakOnCorrect ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Скорость речи</span>
                    <span className="text-sm font-bold text-orange-500">{settings.speechRate.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={settings.speechRate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-amber-500 [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>🐢 Медленнее</span>
                    <span>⚡ Норма</span>
                    <span>🐇 Быстрее</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Нижняя кнопка */}
            <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-800">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                Применить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 