"use client"

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react"
import { type Word } from "../../data/words"
import { type GameMode } from "./StartMenu"
import GrammarHint from "./GrammarHint"
import { playClickSound } from "../../lib/sounds"
import { useAnimation } from "../../hooks/useAnimation"
import AnimatedFeedback from "./AnimatedFeedback"
import { FaVolumeUp, FaCheck, FaTimes } from "react-icons/fa"

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
  const [heartBlockPulse, setHeartBlockPulse] = useState(false)
  const prevLivesRef = useRef(lives)

  useEffect(() => {
    if (lives < prevLivesRef.current) {
      setHeartBlockPulse(true)
      setTimeout(() => setHeartBlockPulse(false), 350)
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        {/* Верхняя панель */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">
            ✕
          </button>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300" style={{ width: `${lessonProgress}%` }} />
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{totalWords - wordsLeft}/{totalWords}</span>
          </div>
          {word.hint ? (
            isCorrect ? <GrammarHint hintText={word.hint} /> : <div className="w-10 h-10" />
          ) : (
            <button
              onClick={() => speakSlovak(word.slovak)}
              disabled={!isCorrect}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${
                isCorrect ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600" : "bg-gray-50 text-gray-300 dark:bg-gray-800"
              }`}
            >
              <FaVolumeUp />
            </button>
          )}
          <div className={`flex gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-xl border transition ${heartBlockPulse ? "animate-pulse" : ""}`}>
            {[1,2,3].map((_, idx) => (
              <span key={idx} className={`text-xl transition ${idx < lives ? "text-red-500 scale-100" : "text-gray-300 scale-75 opacity-50"}`}>❤️</span>
            ))}
          </div>
        </div>

        {/* Вопрос */}
        <div className="text-center space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase">Как переводится:</h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-inner">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{word.russian}</p>
          </div>
        </div>

        {/* Варианты ответа */}
        <div className={`space-y-3 ${animation === "shake" ? "animate-shake" : ""}`}>
          {gameMode === "choice" ? (
            options.map((opt, idx) => {
              let btnClass = "w-full text-left p-3 rounded-xl border-2 font-bold transition hover:shadow-md"
              if (isAnswered) {
                if (opt === word.slovak) btnClass += " border-green-500 bg-green-50 dark:bg-green-900 text-green-700"
                else if (selectedOption === opt) btnClass += " border-red-500 bg-red-50 dark:bg-red-900 text-red-700 line-through"
                else btnClass += " border-gray-200 dark:border-gray-700 opacity-50"
              } else {
                btnClass += " border-gray-200 dark:border-gray-700 hover:border-orange-300"
              }
              return (
                <button key={idx} disabled={disabled || isAnswered} onClick={() => onAnswer(opt)} className={btnClass}>
                  <span>{opt}</span>
                  {!isAnswered && <span className="float-right text-xs text-gray-400">{idx+1}</span>}
                </button>
              )
            })
          ) : (
            <form onSubmit={handleSubmitWrite} className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                disabled={isAnswered || lives <= 0}
                value={writeInput}
                onChange={e => setWriteInput(e.target.value)}
                className="w-full p-3 border-2 rounded-xl focus:border-orange-400 transition"
                placeholder="Введите перевод..."
              />
              {!isAnswered && (
                <button type="submit" disabled={!writeInput.trim() || disabled} className="w-full py-3 gradient-orange">
                  Проверить (Enter)
                </button>
              )}
            </form>
          )}
        </div>

        {/* Нижняя панель результата */}
        <div className="border-t pt-4 space-y-3">
          {lives <= 0 ? (
            <button onClick={() => { setWriteInput(""); onRestart(); }} className="w-full py-3 gradient-red">
              Попробовать снова
            </button>
          ) : isAnswered ? (
            <>
              <div className={`p-3 rounded-xl text-center font-bold flex items-center justify-center gap-2 ${
                isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isCorrect ? <FaCheck /> : <FaTimes />} {message}
                {!isCorrect && ` Правильный ответ: ${word.slovak}`}
              </div>
              <button onClick={handleNextClick} className="w-full py-3 gradient-green">
                {wordsLeft === 0 && isCorrect ? "Завершить урок 🎉" : "Продолжить (Enter) →"}
              </button>
            </>
          ) : (
            <p className="text-center text-xs text-gray-400">Используй мышь или клавиатуру (1,2,3, Enter)</p>
          )}
        </div>
      </div>
      <AnimatedFeedback isCorrect={isAnswered ? isCorrect : null} duration={800} />
    </div>
  )
}