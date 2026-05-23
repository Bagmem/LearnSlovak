"use client"

import { useState, useEffect } from "react"
import { words, type Word, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { checkAnswer } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import GameUI from "./components/GameUI"
import StartMenu, { type GameMode } from "./components/StartMenu"
import VictoryScreen from "./components/VictoryScreen"
import ReferenceView from "./components/ReferenceView"

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const calculateStreak = (dates: string[]): number => {
  if (!dates || dates.length === 0) return 0
  const uniqueDates = new Set(dates)
  const todayStr = getLocalDateString(new Date())
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = getLocalDateString(yesterday)
  
  let startDateStr = ""
  if (uniqueDates.has(todayStr)) {
    startDateStr = todayStr
  } else if (uniqueDates.has(yesterdayStr)) {
    startDateStr = yesterdayStr
  } else {
    return 0
  }
  
  let streakCount = 0
  const checkDate = new Date(startDateStr)
  while (true) {
    const checkStr = getLocalDateString(checkDate)
    if (uniqueDates.has(checkStr)) {
      streakCount++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }
  return streakCount
}

export default function Home() {
  // Глобальные табы приложения: 'study' (Обучение) или 'reference' (Справочник)
  const [globalTab, setGlobalTab] = useState<"study" | "reference">("study")
  
  const [screen, setScreen] = useState<"menu" | "game" | "victory">("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null)
  const [currentDataSource, setCurrentDataSource] = useState<"vocab" | "grammar">("vocab")
  const [gameMode, setGameMode] = useState<GameMode>("choice")

  const [queue, setQueue] = useState<Word[]>([])
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [message, setMessage] = useState("")
  const [options, setOptions] = useState<string[]>([])
  const [isAnswering, setIsAnswering] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const [totalLessonWords, setTotalLessonWords] = useState(0)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [totalClicksCount, setTotalClicksCount] = useState(0)

  const [progressData, setProgressData] = useState<Record<string, number>>({})
  const [activeDates, setActiveDates] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const word = queue[0] ?? null

  const cleanText = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
      .replace(/\s+/g, " ")
  }

  useEffect(() => {
    const savedXp = loadProgress("xp")
    const savedLives = loadProgress("lives")
    if (savedXp !== null) setXp(savedXp)
    if (savedLives !== null) setLives(savedLives)

    const savedDatesStr = typeof window !== "undefined" ? localStorage.getItem("slovak_active_dates") : null
    const dates: string[] = savedDatesStr ? JSON.parse(savedDatesStr) : []
    setActiveDates(dates)
    setStreak(calculateStreak(dates))

    const initialProgress: Record<string, number> = {}
    const allPools = [...words, ...grammarTasks]
    allPools.forEach((w) => {
      if (w.level && w.category) {
        const storageKey = `cat_progress_${w.level}_${w.category}`
        if (!initialProgress[storageKey]) {
          const savedCount = loadProgress(storageKey)
          initialProgress[storageKey] = savedCount !== null ? savedCount : 0
        }
      }
    })
    setProgressData(initialProgress)
    setIsLoaded(true)
  }, [])

  useEffect(() => { if (isLoaded) saveProgress("xp", xp) }, [xp, isLoaded])
  useEffect(() => { if (isLoaded) saveProgress("lives", lives) }, [lives, isLoaded])

  useEffect(() => {
    if (!word || !selectedCategory || !selectedLevel) {
      setOptions([])
      return
    }
    const poolSource = currentDataSource === "vocab" ? words : grammarTasks
    const samePoolWords = poolSource.filter(
      (w) => w.category === selectedCategory && w.level === selectedLevel
    )
    const pool = samePoolWords.length >= 3 ? samePoolWords : poolSource
    const wrongOptions = pool.filter((w) => w.slovak !== word.slovak).map((w) => w.slovak)
    setOptions(shuffleArray([...shuffleArray(wrongOptions).slice(0, 2), word.slovak]))
  }, [word, selectedCategory, selectedLevel, currentDataSource])

  const handleSelectCategory = (category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => {
    const poolSource = dataSource === "vocab" ? words : grammarTasks
    const filteredWords = poolSource.filter((w) => w.category === category && w.level === level)
    
    setCurrentDataSource(dataSource)
    setSelectedCategory(category)
    setSelectedLevel(level)
    setQueue(shuffleArray(filteredWords))
    setTotalLessonWords(filteredWords.length)
    setCorrectAnswersCount(0)
    setTotalClicksCount(0)
    setLives(3)
    setMessage("")
    setSelectedOption(null)
    setIsAnswering(false)
    setScreen("game")
  }

  const checkAnswerHandler = (userInput: string) => {
    if (isAnswering || !word || lives <= 0) return
    setIsAnswering(true)
    setSelectedOption(userInput)
    setTotalClicksCount((v) => v + 1)

    if (gameMode === "choice") {
      if (checkAnswer(word, userInput)) {
        setXp((v) => v + 10)
        setCorrectAnswersCount((v) => v + 1)
        setMessage("Правильно!")
      } else {
        setLives((v) => v - 1)
        setMessage("Неправильно!")
      }
    } else {
      const clearUser = cleanText(userInput)
      const clearCorrect = cleanText(word.slovak)
      if (clearUser === clearCorrect) {
        setXp((v) => v + 15)
        setCorrectAnswersCount((v) => v + 1)
        setMessage("Правильно!")
      } else {
        setLives((v) => v - 1)
        setMessage(`Ошибка! Правильно: ${word.slovak}`)
      }
    }
  }

  const handleNextWord = () => {
    const isCorrect = message === "Правильно!"
    if (isCorrect) {
      if (queue.length === 1) {
        setXp((v) => v + 50)
        const todayStr = getLocalDateString()
        let updatedDates = [...activeDates]
        if (!activeDates.includes(todayStr)) {
          updatedDates.push(todayStr)
          setActiveDates(updatedDates)
          localStorage.setItem("slovak_active_dates", JSON.stringify(updatedDates))
        }
        setStreak(calculateStreak(updatedDates))

        if (selectedCategory && selectedLevel) {
          const storageKey = `cat_progress_${selectedLevel}_${selectedCategory}`
          saveProgress(storageKey, totalLessonWords)
          setProgressData((prev) => ({ ...prev, [storageKey]: totalLessonWords }))
        }
        setScreen("victory")
        return
      }
      setQueue((prev) => prev.slice(1))
    } else {
      setQueue((prev) => [...prev.slice(1), prev[0]])
    }
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
  }

  // Рендеринг игрового процесса (занимает весь экран, скрывает меню навигации)
  if (screen === "game") {
    const lessonProgressPercent = totalLessonWords > 0 ? ((totalLessonWords - queue.length) / totalLessonWords) * 100 : 0
    return (
      <GameUI
        xp={xp} streak={streak} lives={lives} word={word} options={options} message={message}
        selectedOption={selectedOption} onAnswer={checkAnswerHandler} onNext={handleNextWord}
        onRestart={() => handleSelectCategory(selectedCategory!, selectedLevel!, currentDataSource)}
        onBack={() => setScreen("menu")} disabled={isAnswering || lives <= 0}
        lessonProgress={lessonProgressPercent} gameMode={gameMode}
      />
    )
  }

  if (screen === "victory") {
    const accuracy = Math.round((correctAnswersCount / totalClicksCount) * 100) || 0
    return <VictoryScreen category={selectedCategory || ""} xpEarned={50} accuracy={accuracy} onBack={() => setScreen("menu")} />
  }

  // Главный экран с нижним таб-баром навигации
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Контент активного глобального таба */}
      {globalTab === "study" ? (
        <StartMenu
          onSelectCategory={handleSelectCategory}
          xp={xp} progressData={progressData} streak={streak} activeDates={activeDates}
          gameMode={gameMode} setGameMode={setGameMode}
        />
      ) : (
        <ReferenceView />
      )}

      {/* 📱 НИЖНИЙ ТАБ-БАР НАВИГАЦИИ */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-gray-200 flex justify-around items-center px-6 z-50 shadow-md">
        <button
          onClick={() => setGlobalTab("study")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-all ${
            globalTab === "study" ? "text-orange-500 scale-105" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span className="text-xl">🎯</span>
          <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Изучение</span>
        </button>
        
        <button
          onClick={() => setGlobalTab("reference")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-all ${
            globalTab === "reference" ? "text-orange-500 scale-105" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span className="text-xl">📚</span>
          <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Справочник</span>
        </button>
      </div>

    </div>
  )
}