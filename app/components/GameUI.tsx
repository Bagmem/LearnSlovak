"use client"

import { useState, useEffect, useRef } from "react"
import { type Word } from "../../data/words"
import { type GameMode } from "./StartMenu"
import GrammarHint from "./GrammarHint"

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
}: GameUIProps) {
  const [writeInput, setWriteInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null) // Ссылка на инпут для автофокуса

  if (!word) return null

  const isAnswered = message !== ""
  const isCorrect = message === "Правильно!"

  // 🪄 Улучшение 1: Автоматический фокус на поле ввода при смене слова
  useEffect(() => {
    if (gameMode === "write" && !isAnswered && inputRef.current) {
      inputRef.current.focus()
    }
  }, [word, isAnswered, gameMode])

  // ⌨️ Улучшение 2: Горячие клавиши (1, 2, 3 и Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || lives <= 0) return

      // Если ответ уже дан, кнопка Enter переводит на следующее слово
      if (isAnswered && e.key === "Enter") {
        e.preventDefault()
        setWriteInput("")
        onNext()
        return
      }

      // Если мы в режиме ТЕСТА и ответ ЕЩЕ НЕ ДАН
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-8 animate-fadeIn">
      
      {/* ВЕРХНЯЯ ПАНЕЛЬ С УПРАВЛЕНИЕМ */}
      <div className="w-full max-w-xl mx-auto px-4 pt-6 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 font-black text-2xl p-1 active:scale-95 transition-transform"
        >
          ✕
        </button>

        {/* Прогресс-бар */}
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden border border-gray-300 p-0.5">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${lessonProgress}%` }}
          />
        </div>

        {/* Интеграция изолированной подсказки */}
        {(word as any).hint ? (
          <GrammarHint hintText={(word as any).hint} />
        ) : (
          <div className="w-10 h-10" />
        )}

        {/* Сердечки жизней */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border-2 border-gray-200 shadow-sm">
          <span className="text-red-500 text-lg">❤️</span>
          <span className="font-black text-gray-700 text-sm">{lives}</span>
        </div>
      </div>

      {/* ЦЕНТРАЛЬНЫЙ БЛОК ЗАДАНИЯ */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto px-4 my-8">
        <span className="text-4xl mb-4 animate-bounce">🎓</span>
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Как переводится:</h2>
        <p className="text-2xl font-black text-gray-800 text-center leading-tight bg-white px-6 py-4 rounded-2xl border-2 border-b-6 border-gray-200 shadow-sm w-full">
          {word.russian}
        </p>

        <div className="w-full mt-8">
          {/* РЕЖИМ 1: ТЕСТ (ВЫБОР ВАРИАНТА) */}
          {gameMode === "choice" ? (
            <div className="space-y-3">
              {options.map((option, idx) => {
                const isCurrentSelected = selectedOption === option
                let btnStyle = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:translate-y-1"

                if (isAnswered) {
                  if (option === word.slovak) {
                    btnStyle = "border-green-500 bg-green-50 text-green-700 font-black"
                  } else if (isCurrentSelected) {
                    btnStyle = "border-red-500 bg-red-50 text-red-700 line-through"
                  } else {
                    btnStyle = "border-gray-200 bg-white text-gray-400 opacity-60"
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
                    {/* Визуальная мини-подсказка горячей клавиши */}
                    {!isAnswered && (
                      <span className="text-[10px] font-black bg-gray-100 text-gray-400 border border-gray-200 w-5 h-5 flex items-center justify-center rounded-md group-hover:border-orange-300 group-hover:text-orange-500">
                        {idx + 1}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            /* РЕЖИМ 2: ПИСЬМО (РУЧНОЙ ВВОД) */
            <form onSubmit={handleSubmitWrite} className="w-full space-y-4">
              <input
                ref={inputRef} // Подключаем реф для автофокуса
                type="text"
                disabled={isAnswered || lives <= 0}
                placeholder="Введите перевод на словацком..."
                value={writeInput}
                onChange={(e) => setWriteInput(e.target.value)}
                className="w-full px-4 py-4 bg-white border-2 border-b-6 border-gray-200 rounded-xl font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-all text-center text-lg"
              />
              {!isAnswered && (
                <button
                  type="submit"
                  disabled={!writeInput.trim() || disabled}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 text-white font-black rounded-xl border-b-4 border-orange-700 transition-all transform active:scale-[0.99]"
                >
                  Проверить ответ (Enter)
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      {/* НИЖНЯЯ ПАНЕЛЬ С РЕЗУЛЬТАТАМИ И КНОПКОЙ ДАЛЕЕ */}
      <div className="w-full border-t-2 border-gray-200 bg-white py-4 px-4 shadow-inner">
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
                isCorrect ? "bg-green-100 border-green-200 text-green-700" : "bg-red-100 border-red-200 text-red-700"
              }`}>
                {message} {!isCorrect && `Правильный ответ: ${word.slovak}`}
              </div>
              <button
                onClick={() => {
                  setWriteInput("")
                  onNext()
                }}
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl border-b-4 border-green-700 transition-all transform active:scale-[0.99]"
              >
                {lessonProgress >= 100 && isCorrect ? "Завершить урок 🎉" : "Продолжить (Enter) →"}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs font-bold text-gray-400 py-2">
              Используй мышь или клавиатуру для быстрого ответа
            </p>
          )}
        </div>
      </div>

    </div>
  )
}