"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { type Word } from "../../data/words"
import { type GameMode } from "./StartMenu"
import { playClickSound } from "../../lib/sounds"
import { useAnimation } from "../../hooks/useAnimation"
import AnimatedFeedback from "./AnimatedFeedback"
import { FaCheck, FaTimes } from "react-icons/fa"

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
  disabled: boolean
  lessonProgress: number
  gameMode: GameMode
  wordsLeft: number
  totalWords: number
  speechRate: number
  autoSpeakOnCorrect: boolean
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
  disabled,
  lessonProgress,
  gameMode,
  wordsLeft,
  totalWords,
  speechRate,
  autoSpeakOnCorrect,
}: GameUIProps) {
  const [writeInput, setWriteInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const hasAutoSpokenRef = useRef(false)
  const { animation, trigger } = useAnimation(300)
  const prevLivesRef = useRef(lives)

  useEffect(() => {
    prevLivesRef.current = lives
  }, [lives])

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
    if (isAnswered && !isCorrect) trigger("shake")
  }, [isAnswered, isCorrect, trigger])

  useEffect(() => {
    if (gameMode === "write" && !isAnswered && inputRef.current) inputRef.current.focus()
  }, [word, isAnswered, gameMode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || lives <= 0) return
      if (isAnswered && e.key === "Enter") {
        e.preventDefault()
        setWriteInput("")
        onNext()
        return
      }
      if (gameMode === "choice" && !isAnswered) {
        if (e.key === "1" && options[0]) onAnswer(options[0])
        if (e.key === "2" && options[1]) onAnswer(options[1])
        if (e.key === "3" && options[2]) onAnswer(options[2])
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [disabled, isAnswered, gameMode, options, onAnswer, onNext, lives])

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-8 px-4"
    >
      <div className="w-full max-w-2xl">
        {/* Верхняя панель с прогрессом и жизнями */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ✕
          </motion.button>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              <span>Прогресс урока</span>
              <span>{totalWords - wordsLeft}/{totalWords}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lessonProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="flex gap-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
            {[1,2,3].map((_, idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 1 }}
                animate={{ scale: idx < lives ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
                className={`text-xl transition ${idx < lives ? "text-red-500" : "text-gray-300 opacity-50"}`}
              >
                ❤️
              </motion.span>
            ))}
          </div>
        </div>

        {/* Карточка вопроса с градиентной рамкой */}
        <div className="relative rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
          <div className="p-6 md:p-8 space-y-6">
            {/* Текст вопроса */}
            <div className="text-center">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Как переводится:</h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 shadow-inner">
                <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{word.russian}</p>
              </div>
            </div>

            {/* Блок вариантов ответа */}
            <motion.div
              className={`space-y-3 min-h-[200px] ${animation === "shake" ? "animate-shake" : ""}`}
              animate={animation === "shake" ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.2 }}
            >
              {gameMode === "choice" ? (
                options.map((opt, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-200 hover:shadow-md"
                  if (isAnswered) {
                    if (opt === word.slovak) {
                      btnClass += " border-green-500 bg-green-50 dark:bg-green-900/50 text-green-700 shadow-md"
                    } else if (selectedOption === opt) {
                      btnClass += " border-red-500 bg-red-50 dark:bg-red-900/50 text-red-700 line-through"
                    } else {
                      btnClass += " border-gray-200 dark:border-gray-700 opacity-50"
                    }
                  } else {
                    btnClass += " border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/30 dark:hover:bg-orange-900/20"
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
                    >
                      <span className="text-gray-800 dark:text-gray-200">{opt}</span>
                      {!isAnswered && (
                        <span className="float-right text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {idx+1}
                        </span>
                      )}
                    </motion.button>
                  )
                })
              ) : (
                <form onSubmit={handleSubmitWrite} className="space-y-4">
                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    ref={inputRef}
                    type="text"
                    disabled={isAnswered || lives <= 0}
                    value={writeInput}
                    onChange={e => setWriteInput(e.target.value)}
                    className="w-full p-4 border-2 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Введите перевод..."
                  />
                  {!isAnswered && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!writeInput.trim() || disabled}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition"
                    >
                      Проверить (Enter)
                    </motion.button>
                  )}
                </form>
              )}
            </motion.div>

            {/* Нижняя панель результата и действий */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4 min-h-[110px]">
              {lives <= 0 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setWriteInput(""); onRestart(); }}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold shadow-md"
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
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {isCorrect ? <FaCheck className="text-lg" /> : <FaTimes className="text-lg" />}
                        <span>{message}</span>
                        {!isCorrect && <span className="text-sm ml-1">Правильно: {word.slovak}</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isAnswered && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNextClick}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-md"
                    >
                      {wordsLeft === 0 && isCorrect ? "Завершить урок 🎉" : "Продолжить (Enter) →"}
                    </motion.button>
                  )}
                  {!isAnswered && (
                    <p className="text-center text-xs text-gray-400 pt-2">
                      Используй мышь или клавиатуру (1,2,3, Enter)
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <AnimatedFeedback isCorrect={isAnswered ? isCorrect : null} duration={800} />
    </motion.div>
  )
}