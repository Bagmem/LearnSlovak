"use client"

import { useState, useEffect, useRef } from "react"
import { type Word } from "../../data/words"
import { type GameMode } from "./StartMenu"
import GrammarHint from "./GrammarHint"
import { playClickSound } from "../../lib/sounds"
import { useAnimation } from "../../hooks/useAnimation"
import AnimatedFeedback from "./AnimatedFeedback"

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
  const [feedback, setFeedback] = useState<boolean | null>(null)
  const { animation, trigger } = useAnimation(300)

  const speakSlovak = (text: string) => {
    if (!text) return
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "sk-SK"
      utterance.rate = speechRate
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.warn("Web Speech API не поддерживается", e)
    }
  }

  useEffect(() => {
    if (message === "Правильно!" && word && !hasAutoSpokenRef.current && autoSpeakOnCorrect) {
      speakSlovak(word.slovak)
      hasAutoSpokenRef.current = true
    }
    if (message === "") {
      hasAutoSpokenRef.current = false
    }
  }, [message, word, autoSpeakOnCorrect, speechRate])

  useEffect(() => {
    setFeedback(null)
  }, [word])

  if (!word) return null

  const isAnswered = message !== ""
  const isCorrect = message === "Правильно!"

  useEffect(() => {
    if (isAnswered && !isCorrect) {
      trigger("shake")
      setFeedback(false)
    } else if (isAnswered && isCorrect) {
      setFeedback(true)
    }
  }, [isAnswered, isCorrect, trigger])

  useEffect(() => {
    if (gameMode === "write" && !isAnswered && inputRef.current) {
      inputRef.current.focus()
    }
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

  const handleSubmitWrite = (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-between pb-8 animate-fadeIn">
      <div className="w-full max-w-xl mx-auto px-4 pt-6 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 font-black text-2xl p-1 active:scale-95 transition-transform"
        >
          ✕
        </button>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 p-0.5">
            <div
              className="bg-green-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${lessonProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {totalWords - wordsLeft}/{totalWords}
          </span>
        </div>

        {word.hint ? (
          isCorrect ? (
            <GrammarHint hintText={word.hint} />
          ) : (
            <div className="w-10 h-10" />
          )
        ) : (
          <button
            onClick={() => speakSlovak(word.slovak)}
            disabled={!isCorrect}
            className={`w-10 h-10 flex items-center justify-center text-xl rounded-full transition-colors ${
              isCorrect
                ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                : "bg-gray-50 text-gray-300 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Прослушать произношение (доступно после правильного ответа)"
          >
            🔊
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-red-500 text-lg">❤️</span>
          <span className="font-black text-gray-700 dark:text-gray-200 text-sm">{lives}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto px-4 my-8">
        <span className="text-4xl mb-4 animate-bounce">🎓</span>
        <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Как переводится:</h2>
        
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl border-2 border-b-6 border-gray-200 dark:border-gray-700 shadow-sm w-full justify-center animate-slideInScale">
          <p className="text-2xl font-black text-gray-800 dark:text-white text-center leading-tight">
            {word.russian}
          </p>
          <button
            onClick={() => speakSlovak(word.slovak)}
            disabled={!isCorrect}
            className={`text-xl transition-transform ${
              isCorrect
                ? "hover:scale-110 cursor-pointer opacity-100"
                : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Прослушать произношение (доступно после правильного ответа)"
          >
            🔊
          </button>
        </div>

        <div className={`w-full mt-8 ${animation === "shake" ? "animate-shake" : ""}`}>
          {gameMode === "choice" ? (
            <div className="space-y-3">
              {options.map((option, idx) => {
                const isCurrentSelected = selectedOption === option
                let btnStyle = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:translate-y-1"

                if (isAnswered) {
                  if (option === word.slovak) {
                    btnStyle = "border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 font-black"
                  } else if (isCurrentSelected) {
                    btnStyle = "border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 line-through"
                  } else {
                    btnStyle = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 opacity-60"
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={disabled || isAnswered}
                    onClick={() => onAnswer(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 border-b-5 font-bold transition-all relative flex items-center justify-between group ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {!isAnswered && (
                      <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-600 w-5 h-5 flex items-center justify-center rounded-md group-hover:border-orange-300 group-hover:text-orange-500">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmitWrite} className="w-full space-y-4">
              <input
                ref={inputRef}
                type="text"
                disabled={isAnswered || lives <= 0}
                placeholder="Введите перевод на словацком..."
                value={writeInput}
                onChange={(e) => setWriteInput(e.target.value)}
                className={`w-full px-4 py-4 bg-white dark:bg-gray-800 border-2 border-b-6 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-all text-center text-lg ${
                  animation === "shake" ? "border-red-500" : ""
                }`}
              />
              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!writeInput.trim() || disabled}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:border-gray-300 dark:disabled:border-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 text-white font-black rounded-xl border-b-4 border-orange-700 transition-all transform active:scale-[0.99]"
                >
                  Проверить ответ (Enter)
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="w-full border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 px-4 shadow-inner">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          {lives <= 0 ? (
            <div className="text-center space-y-3 py-2">
              <p className="text-red-500 font-black text-lg">Закончились жизни 😢</p>
              <button
                onClick={() => {
                  setWriteInput("")
                  onRestart()
                }}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl border-b-4 border-red-700 transition-all active:scale-95"
              >
                Попробовать снова
              </button>
            </div>
          ) : isAnswered ? (
            <div className="space-y-3">
              <div className={`p-3 rounded-xl font-bold text-center border text-sm ${
                isCorrect 
                  ? "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300" 
                  : "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
              }`}>
                {message} {!isCorrect && `Правильный ответ: ${word.slovak}`}
              </div>
              <button
                onClick={handleNextClick}
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl border-b-4 border-green-700 transition-all transform active:scale-[0.99]"
              >
                {wordsLeft === 0 && isCorrect ? "Завершить урок 🎉" : "Продолжить (Enter) →"}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 py-2">
              Используй мышь или клавиатуру для быстрого ответа
            </p>
          )}
        </div>
      </div>

      <AnimatedFeedback isCorrect={feedback} duration={800} onComplete={() => setFeedback(null)} />
    </div>
  )
}