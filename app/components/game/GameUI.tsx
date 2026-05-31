"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Word } from "../../../data/words"
import { type GameMode } from "./StartMenu"
import { playClickSound } from "../../../lib/sounds"
import { FaVolumeUp, FaLightbulb, FaStepForward, FaSkull, FaCheck, FaTimes, FaHeart, FaCrosshairs } from "react-icons/fa"
import { useTheme } from "../../../hooks/useTheme"

type GameUIProps = {
  xp: number
  streak: number
  lives: number
  word: Word | null
  options: string[]
  message: string
  selectedOption: string | null
  onAnswer: (input: string) => void
  onNext: () => void
  onRestart: () => void
  onBack: () => void
  onSkip?: () => void
  onMarkHard?: (word: Word) => void
  disabled: boolean
  lessonProgress: number
  gameMode: GameMode
  wordsLeft: number
  totalWords: number
  remainingCount: number
  speechRate: number
  autoSpeakOnCorrect: boolean
  sessionCorrect: number
  sessionTotal: number
}

export default function GameUI({
  lives,
  word,
  options,
  message,
  selectedOption,
  onAnswer,
  onNext,
  onRestart,
  onBack,
  onSkip,
  onMarkHard,
  disabled,
  lessonProgress,
  gameMode,
  wordsLeft,
  totalWords,
  remainingCount,
  speechRate,
  autoSpeakOnCorrect,
  sessionCorrect,
  sessionTotal,
}: GameUIProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [writeInput, setWriteInput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasAutoSpokenRef = useRef(false)

  const speakSlovak = useCallback((text: string) => {
    if (!text) return
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "sk-SK"
      utterance.rate = speechRate
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.warn(e)
    }
  }, [speechRate])

  useEffect(() => {
    if (message === "Правильно!" && word && !hasAutoSpokenRef.current && autoSpeakOnCorrect) {
      speakSlovak(word.slovak)
      hasAutoSpokenRef.current = true
    }
    if (message === "") hasAutoSpokenRef.current = false
  }, [message, word, autoSpeakOnCorrect, speakSlovak])

  const isAnswered = message !== ""
  const isCorrect = message === "Правильно!"

  useEffect(() => {
    if (gameMode === "write" && !isAnswered && inputRef.current) inputRef.current.focus()
  }, [word, isAnswered, gameMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || lives <= 0) return
      if (e.key === "s" && onSkip && remainingCount > 1 && !isAnswered) {
        e.preventDefault()
        onSkip()
        return
      }
      if (e.key === "h" && onMarkHard && word && !isAnswered) {
        e.preventDefault()
        onMarkHard(word)
        return
      }
      if (isAnswered && e.key === "Enter") {
        e.preventDefault()
        setWriteInput("")
        onNext()
        return
      }
      if (gameMode === "choice" && !isAnswered && !disabled && lives > 0) {
        if (e.key === "1" && options[0]) onAnswer(options[0])
        if (e.key === "2" && options[1]) onAnswer(options[1])
        if (e.key === "3" && options[2]) onAnswer(options[2])
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [disabled, isAnswered, gameMode, options, onAnswer, onNext, lives, onSkip, onMarkHard, word, remainingCount])

  if (!word) return null

  const handleSubmitWrite = (e: FormEvent) => {
    e.preventDefault()
    if (!writeInput.trim() || disabled) return
    onAnswer(writeInput)
  }

  const handleNextClick = () => {
    playClickSound()
    setWriteInput("")
    onNext()
  }

  const handleSkip = () => {
    if (!onSkip) return
    if (remainingCount <= 1) return
    playClickSound()
    setWriteInput("")
    onSkip()
  }

  const handleMarkHard = () => {
    if (!onMarkHard || !word) return
    playClickSound()
    onMarkHard(word)
  }

  const sessionAccuracy = sessionTotal ? Math.round((sessionCorrect / sessionTotal) * 100) : 0

  const bgMain = isDark ? "bg-gradient-to-br from-gray-900/90 to-gray-800/90" : "bg-gradient-to-br from-gray-100 to-gray-200"
  const cardBg = isDark ? "bg-white/10 backdrop-blur-xl border-white/20" : "bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-white/70" : "text-gray-700"
  const textMuted = isDark ? "text-white/50" : "text-gray-500"
  const progressBg = isDark ? "bg-white/20" : "bg-gray-300"
  const livesBg = isDark ? "bg-white/10 border-white/20" : "bg-gray-200 border-gray-300"
  const answerBg = isDark ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
  const answerSelectedCorrect = isDark ? "border-green-500 bg-green-500/20 text-green-200" : "border-green-500 bg-green-100 text-green-800"
  const answerSelectedWrong = isDark ? "border-red-500 bg-red-500/20 text-red-200" : "border-red-500 bg-red-100 text-red-800"
  const answerDisabled = isDark ? "border-white/10 bg-white/5 text-white/50" : "border-gray-200 bg-gray-100 text-gray-400"
  const buttonSkip = isDark ? "bg-white/10 border-white/20 text-white/80 hover:bg-white/20" : "bg-gray-200 border-gray-300 text-gray-800 hover:bg-gray-300"
  const buttonHard = isDark ? "bg-white/10 border-white/20 text-white/80 hover:bg-red-500/30" : "bg-gray-200 border-gray-300 text-gray-800 hover:bg-red-200"

  return (
    <div className={`min-h-screen ${bgMain} flex flex-col items-center py-8 px-4 transition-colors duration-300`}>
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`${textSecondary} hover:${isDark ? "text-white" : "text-gray-900"} text-2xl`}
            aria-label="Выйти из урока"
          >
            ✕
          </motion.button>
          <div className="flex-1" role="region" aria-label="Прогресс урока">
            <div className={`flex justify-between text-xs font-bold ${textSecondary} mb-1`}>
              <span>Прогресс урока</span>
              <span>{totalWords - wordsLeft}/{totalWords}</span>
            </div>
            <div className={`w-full ${progressBg} rounded-full h-2 overflow-hidden`}>
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lessonProgress}%` }}
                transition={{ duration: 0.3 }}
                aria-label={`Прогресс: ${Math.round(lessonProgress)}%`}
              />
            </div>
          </div>
          <div className={`flex gap-1 ${livesBg} backdrop-blur-sm px-3 py-1 rounded-full border`} aria-label="Жизни">
            {[1, 2, 3].map((_, idx) => (
              <motion.span
                key={idx}
                animate={{ scale: idx < lives ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
                className={`text-xl transition ${idx < lives ? "text-red-500" : "text-gray-400"}`}
                aria-hidden="true"
              >
                <FaHeart />
              </motion.span>
            ))}
          </div>
        </div>

        <div className={`relative rounded-2xl ${cardBg} shadow-2xl overflow-hidden border transition-colors`}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" aria-hidden="true" />
          <div className={`flex justify-between items-center px-6 pt-4 text-sm font-bold ${textSecondary}`}>
            <span><FaCrosshairs className="inline mr-1" /> Точность сессии: {sessionAccuracy}%</span>
            <span>✓ {sessionCorrect}/{sessionTotal}</span>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center">
              <h2 className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2`}>Как переводится:</h2>
              <div className={`${isDark ? "bg-white/5" : "bg-gray-100"} rounded-xl p-5 backdrop-blur-sm border ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <p className={`text-2xl md:text-3xl font-bold ${textPrimary}`}>{word.russian}</p>
              </div>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {gameMode === "choice" ? (
                options.map((opt, idx) => {
                  let btnClass = `w-full text-left p-4 rounded-xl border backdrop-blur-sm font-medium transition-all duration-200 hover:shadow-lg ${answerBg}`
                  if (isAnswered) {
                    if (opt === word.slovak) {
                      btnClass = `w-full text-left p-4 rounded-xl border font-medium transition-all duration-200 ${answerSelectedCorrect}`
                    } else if (selectedOption === opt) {
                      btnClass = `w-full text-left p-4 rounded-xl border font-medium transition-all duration-200 ${answerSelectedWrong} line-through`
                    } else {
                      btnClass = `w-full text-left p-4 rounded-xl border font-medium transition-all duration-200 ${answerDisabled}`
                    }
                  }
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={disabled || isAnswered}
                      onClick={() => onAnswer(opt)}
                      className={btnClass}
                      aria-label={`Вариант ${idx + 1}: ${opt}`}
                    >
                      <span>{opt}</span>
                      {!isAnswered && (
                        <span className={`float-right text-xs font-bold ${textMuted} ${isDark ? "bg-white/10" : "bg-gray-200"} px-2 py-0.5 rounded-full`}>
                          {idx + 1}
                        </span>
                      )}
                    </motion.button>
                  )
                })
              ) : (
                <form onSubmit={handleSubmitWrite} className="space-y-4">
                  <label htmlFor="writeInput" className="sr-only">Введите перевод</label>
                  <input
                    id="writeInput"
                    ref={inputRef}
                    type="text"
                    disabled={isAnswered || lives <= 0}
                    value={writeInput}
                    onChange={(e) => setWriteInput(e.target.value)}
                    className={`w-full p-4 rounded-xl border ${isDark ? "bg-white/10 border-white/20 focus:ring-orange-400/50 text-white placeholder-white/50" : "bg-gray-50 border-gray-300 focus:ring-orange-400 text-gray-900 placeholder-gray-400"} focus:border-orange-400 focus:ring-2 outline-none transition`}
                    placeholder="Введите перевод..."
                  />
                  {!isAnswered && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!writeInput.trim() || disabled}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md"
                      aria-label="Проверить ответ"
                    >
                      Проверить (Enter)
                    </motion.button>
                  )}
                </form>
              )}
            </div>

            {!isAnswered && onSkip && remainingCount > 1 && (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSkip}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${buttonSkip}`}
                  aria-label="Пропустить слово (S)"
                >
                  <FaStepForward aria-hidden="true" /> Пропустить (S)
                </motion.button>
                {onMarkHard && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkHard}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${buttonHard}`}
                    aria-label="Отметить слово как сложное (H)"
                  >
                    <FaSkull aria-hidden="true" /> Сложное (H)
                  </motion.button>
                )}
              </div>
            )}

            <div className={`border-t ${isDark ? "border-white/20" : "border-gray-200"} pt-5 space-y-4 min-h-[110px]`}>
              {lives <= 0 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setWriteInput(""); onRestart(); }}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-md"
                  aria-label="Попробовать снова"
                >
                  Попробовать снова
                </motion.button>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    {isAnswered && (
                      <motion.div
                        key="message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-sm ${
                          isCorrect
                            ? isDark ? "bg-green-500/20 text-green-200 border border-green-500/30" : "bg-green-100 text-green-800 border border-green-300"
                            : isDark ? "bg-red-500/20 text-red-200 border border-red-500/30" : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                        role="status"
                        aria-live="polite"
                      >
                        {isCorrect ? <FaCheck className="text-lg" aria-hidden="true" /> : <FaTimes className="text-lg" aria-hidden="true" />}
                        <span>{message}</span>
                        {!isCorrect && <span className="text-sm ml-1">Правильно: {word.slovak}</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isAnswered && word && (
                    <div className="flex gap-2 justify-center mt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => speakSlovak(word.slovak)}
                        className={`${textSecondary} hover:${isDark ? "text-white" : "text-gray-900"} p-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                        aria-label="Озвучить слово"
                      >
                        <FaVolumeUp aria-hidden="true" />
                        <span className="sr-only">Озвучить слово</span>
                      </motion.button>
                      {word.hint && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowHint(!showHint)}
                          className={`${textSecondary} hover:text-yellow-600 p-2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}
                          aria-label="Показать подсказку"
                        >
                          <FaLightbulb aria-hidden="true" />
                          <span className="sr-only">Показать подсказку</span>
                        </motion.button>
                      )}
                    </div>
                  )}
                  {showHint && word?.hint && (
                    <div className={`mt-2 text-sm rounded-lg p-2 text-center ${isDark ? "text-yellow-300 bg-yellow-900/30 border-yellow-500/30" : "text-yellow-800 bg-yellow-100 border-yellow-300"} border`}>
                      💡 {word.hint}
                    </div>
                  )}

                  {isAnswered && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNextClick}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-md"
                      aria-label={remainingCount === 0 && isCorrect ? "Завершить урок" : "Продолжить"}
                    >
                      {remainingCount === 0 && isCorrect ? "Завершить урок" : "Продолжить (Enter) →"}
                    </motion.button>
                  )}
                  {!isAnswered && (
                    <p className={`text-center text-xs ${textMuted} pt-2`}>
                      Используй мышь или клавиатуру (1,2,3, Enter, S – пропуск, H – сложное)
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}