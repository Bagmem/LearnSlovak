"use client"

import { useState, useEffect, useCallback } from "react"
import { words, type Word, type LanguageLevel } from "../data/words"
import { grammarTasks } from "../data/grammar"
import { texts, type SlovakText } from "../data/texts"
import { checkAnswer, generateWrongOptions, selectNextWord, updateWordStats, type WordStats, createEmptyWordStats } from "../lib/game"
import { saveProgress, loadProgress } from "../lib/storage"
import { playCorrectSound, playWrongSound, playLessonStartSound, playVictorySound, playClickSound, initAudio, setMuted } from "../lib/sounds"
import GameUI from "./components/GameUI"
import StartMenu, { type GameMode } from "./components/StartMenu"
import VictoryScreen from "./components/VictoryScreen"
import ReferenceView from "./components/ReferenceView"
import FlashcardMode from "./components/FlashcardMode"
import TextsMenu from "./components/TextsMenu"
import TextViewer from "./components/TextViewer"
import { useSettings } from "../hooks/useSettings"
import { useTheme } from "../hooks/useTheme"

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

const getLocalDateString = (date = new Date()): string => {
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
  const { settings, toggleMute, setSpeechRate, setAutoSpeak } = useSettings()
  const { theme, toggleTheme } = useTheme()
  
  useEffect(() => {
    setMuted(settings.isMuted)
  }, [settings.isMuted])

  const [globalTab, setGlobalTab] = useState<"study" | "reference" | "texts">("study")
  
  const [screen, setScreen] = useState<"menu" | "game" | "victory">("menu")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel | null>(null)
  const [currentDataSource, setCurrentDataSource] = useState<"vocab" | "grammar">("vocab")
  const [gameMode, setGameMode] = useState<GameMode>("choice")

  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [lessonWords, setLessonWords] = useState<Word[]>([])
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [remainingWordsCount, setRemainingWordsCount] = useState(0)
  
  const [xp, setXp] = useState<number>(0)
  const [streak, setStreak] = useState<number>(0)
  const [lives, setLives] = useState<number>(3)
  const [message, setMessage] = useState<string>("")
  const [options, setOptions] = useState<string[]>([])
  const [isAnswering, setIsAnswering] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const [totalLessonWords, setTotalLessonWords] = useState<number>(0)
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0)
  const [totalClicksCount, setTotalClicksCount] = useState<number>(0)

  const [progressData, setProgressData] = useState<Record<string, number>>({})
  const [activeDates, setActiveDates] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  
  const [wordStatsMap, setWordStatsMap] = useState<Map<string, WordStats>>(new Map())

  const [selectedText, setSelectedText] = useState<SlovakText | null>(null)

  useEffect(() => {
    initAudio()
  }, [])

  useEffect(() => {
    const savedStats = localStorage.getItem("slovak_word_stats")
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats)
        const map = new Map<string, WordStats>(Object.entries(parsed))
        setWordStatsMap(map)
      } catch (e) {
        console.warn("Failed to load word stats", e)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const obj: Record<string, WordStats> = {}
      wordStatsMap.forEach((value, key) => {
        obj[key] = value
      })
      localStorage.setItem("slovak_word_stats", JSON.stringify(obj))
    }
  }, [wordStatsMap, isLoaded])

  const updateCategoryProgress = useCallback((completedCount: number) => {
    if (selectedCategory && selectedLevel && currentDataSource) {
      const storageKey = `cat_progress_${selectedLevel}_${selectedCategory}`
      const currentSaved = progressData[storageKey] || 0
      if (completedCount > currentSaved) {
        saveProgress(storageKey, completedCount)
        setProgressData(prev => ({ ...prev, [storageKey]: completedCount }))
      }
    }
  }, [selectedCategory, selectedLevel, currentDataSource, progressData])

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
    if (!currentWord || !selectedCategory || !selectedLevel || gameMode === "flashcard") {
      setOptions([])
      return
    }
    const poolSource = currentDataSource === "vocab" ? words : grammarTasks
    const samePoolWords = poolSource.filter(
      (w) => w.category === selectedCategory && w.level === selectedLevel
    )
    const pool = samePoolWords.length >= 3 ? samePoolWords : poolSource
    const wrongOptions = generateWrongOptions(currentWord, pool, 2)
    setOptions(shuffleArray([...wrongOptions, currentWord.slovak]))
  }, [currentWord, selectedCategory, selectedLevel, currentDataSource, gameMode])

  const handleSelectCategory = useCallback((category: string, level: LanguageLevel, dataSource: "vocab" | "grammar") => {
    const poolSource = dataSource === "vocab" ? words : grammarTasks
    const filteredWords = poolSource.filter((w) => w.category === category && w.level === level)
    setLessonWords(filteredWords)
    setTotalLessonWords(filteredWords.length)
    setCompletedWords(new Set())
    setRemainingWordsCount(filteredWords.length)
    setCurrentDataSource(dataSource)
    setSelectedCategory(category)
    setSelectedLevel(level)
    setCorrectAnswersCount(0)
    setTotalClicksCount(0)
    setLives(3)
    setMessage("")
    setSelectedOption(null)
    setIsAnswering(false)
    
    const firstWord = selectNextWord(filteredWords, wordStatsMap)
    setCurrentWord(firstWord)
    setScreen("game")
    playLessonStartSound()
  }, [wordStatsMap])

  const checkAnswerHandler = useCallback((userInput: string) => {
    if (isAnswering || !currentWord || lives <= 0) return
    
    initAudio()
    
    setIsAnswering(true)
    setSelectedOption(userInput)
    setTotalClicksCount(v => v + 1)

    const isCorrect = checkAnswer(currentWord, userInput)
    
    const wordKey = `${currentWord.slovak}|${currentWord.russian}`
    const oldStats = wordStatsMap.get(wordKey) || createEmptyWordStats(wordKey)
    const newStats = updateWordStats(oldStats, isCorrect)
    newStats.id = wordKey
    const newMap = new Map(wordStatsMap)
    newMap.set(wordKey, newStats)
    setWordStatsMap(newMap)

    if (isCorrect) {
      playCorrectSound()
      setXp(v => v + (gameMode === "write" ? 15 : 10))
      setCorrectAnswersCount(v => v + 1)
      setMessage("Правильно!")
      
      if (!completedWords.has(wordKey)) {
        const newCompleted = new Set(completedWords)
        newCompleted.add(wordKey)
        setCompletedWords(newCompleted)
        const newRemaining = totalLessonWords - newCompleted.size
        setRemainingWordsCount(newRemaining)
        updateCategoryProgress(newCompleted.size)
      }
    } else {
      playWrongSound()
      setLives(v => v - 1)
      setMessage(`Ошибка! Правильно: ${currentWord.slovak}`)
    }
  }, [isAnswering, currentWord, lives, wordStatsMap, gameMode, completedWords, totalLessonWords, updateCategoryProgress])

  const handleFlashcardRating = useCallback((known: boolean) => {
    if (isAnswering || !currentWord) return
    
    initAudio()
    setIsAnswering(true)
    setTotalClicksCount(v => v + 1)

    const wordKey = `${currentWord.slovak}|${currentWord.russian}`
    const oldStats = wordStatsMap.get(wordKey) || createEmptyWordStats(wordKey)
    const newStats = updateWordStats(oldStats, known)
    newStats.id = wordKey
    const newMap = new Map(wordStatsMap)
    newMap.set(wordKey, newStats)
    setWordStatsMap(newMap)

    if (known) {
      playCorrectSound()
      setXp(v => v + 5)
      setCorrectAnswersCount(v => v + 1)
      
      if (!completedWords.has(wordKey)) {
        const newCompleted = new Set(completedWords)
        newCompleted.add(wordKey)
        setCompletedWords(newCompleted)
        const newRemaining = totalLessonWords - newCompleted.size
        setRemainingWordsCount(newRemaining)
        updateCategoryProgress(newCompleted.size)
      }
    } else {
      playWrongSound()
    }

    const notCompletedWords = lessonWords.filter(w => {
      const key = `${w.slovak}|${w.russian}`
      return !completedWords.has(key)
    })
    if (notCompletedWords.length === 0) {
      playVictorySound()
      setScreen("victory")
      return
    }
    const nextWord = selectNextWord(notCompletedWords, wordStatsMap)
    setCurrentWord(nextWord)
    setIsAnswering(false)
  }, [isAnswering, currentWord, wordStatsMap, completedWords, totalLessonWords, lessonWords, updateCategoryProgress])

  const handleNextWord = useCallback(() => {
    const isCorrect = message === "Правильно!"
    
    if (lives <= 0) return
    
    if (isCorrect) {
      if (remainingWordsCount === 0) {
        playVictorySound()
        setXp(v => v + 50)
        const todayStr = getLocalDateString()
        let updatedDates = [...activeDates]
        if (!activeDates.includes(todayStr)) {
          updatedDates.push(todayStr)
          setActiveDates(updatedDates)
          localStorage.setItem("slovak_active_dates", JSON.stringify(updatedDates))
        }
        setStreak(calculateStreak(updatedDates))
        setScreen("victory")
        return
      }
      
      const notCompletedWords = lessonWords.filter(w => {
        const key = `${w.slovak}|${w.russian}`
        return !completedWords.has(key)
      })
      if (notCompletedWords.length === 0) {
        setScreen("victory")
        return
      }
      const nextWord = selectNextWord(notCompletedWords, wordStatsMap)
      setCurrentWord(nextWord)
    } else {
      setMessage("")
      setIsAnswering(false)
      setSelectedOption(null)
      return
    }
    
    setMessage("")
    setIsAnswering(false)
    setSelectedOption(null)
  }, [message, lives, remainingWordsCount, activeDates, lessonWords, completedWords, wordStatsMap])

  const handleRestart = useCallback(() => {
    playClickSound()
    if (selectedCategory && selectedLevel && currentDataSource) {
      handleSelectCategory(selectedCategory, selectedLevel, currentDataSource)
    } else {
      setScreen("menu")
    }
  }, [selectedCategory, selectedLevel, currentDataSource, handleSelectCategory])

  const handleBack = useCallback(() => {
    playClickSound()
    if (screen === "game") {
      if (confirm("Вы уверены, что хотите выйти? Прогресс текущего урока будет потерян.")) {
        setScreen("menu")
      }
    } else {
      setScreen("menu")
    }
  }, [screen])

  if (screen === "game") {
    const lessonProgressPercent = totalLessonWords > 0 ? ((totalLessonWords - remainingWordsCount) / totalLessonWords) * 100 : 0
    
    if (gameMode === "flashcard") {
      return (
        <FlashcardMode
          word={currentWord}
          onNext={handleFlashcardRating}
          onBack={handleBack}
          onRestart={handleRestart}
          lessonProgress={lessonProgressPercent}
          wordsLeft={remainingWordsCount}
          totalWords={totalLessonWords}
        />
      )
    }
    
    return (
      <GameUI
        xp={xp}
        streak={streak}
        lives={lives}
        word={currentWord}
        options={options}
        message={message}
        selectedOption={selectedOption}
        onAnswer={checkAnswerHandler}
        onNext={handleNextWord}
        onRestart={handleRestart}
        onBack={handleBack}
        disabled={isAnswering || lives <= 0}
        lessonProgress={lessonProgressPercent}
        gameMode={gameMode}
        wordsLeft={remainingWordsCount}
        totalWords={totalLessonWords}
        speechRate={settings.speechRate}
        autoSpeakOnCorrect={settings.autoSpeakOnCorrect}
      />
    )
  }

  if (screen === "victory") {
    const accuracy = Math.round((correctAnswersCount / totalClicksCount) * 100) || 0
    return <VictoryScreen category={selectedCategory || ""} xpEarned={50} accuracy={accuracy} onBack={() => setScreen("menu")} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-200">
      {globalTab === "study" && (
        <StartMenu
          onSelectCategory={handleSelectCategory}
          xp={xp}
          progressData={progressData}
          streak={streak}
          activeDates={activeDates}
          gameMode={gameMode}
          setGameMode={setGameMode}
          settings={settings}
          onToggleMute={toggleMute}
          onSetSpeechRate={setSpeechRate}
          onSetAutoSpeak={setAutoSpeak}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {globalTab === "reference" && (
        <ReferenceView
          progressData={progressData}
          activeDates={activeDates}
          wordStatsMap={wordStatsMap}
        />
      )}
      {globalTab === "texts" && (
        selectedText ? (
          <TextViewer text={selectedText} onBack={() => setSelectedText(null)} />
        ) : (
          <TextsMenu onSelectText={setSelectedText} />
        )
      )}

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 flex justify-around items-center px-6 z-50 shadow-md">
        <button
          onClick={() => setGlobalTab("study")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-all ${
            globalTab === "study" ? "text-orange-500 scale-105" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <span className="text-xl">🎯</span>
          <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Изучение</span>
        </button>
        
        <button
          onClick={() => setGlobalTab("reference")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-all ${
            globalTab === "reference" ? "text-orange-500 scale-105" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <span className="text-xl">📚</span>
          <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Справочник</span>
        </button>

        <button
          onClick={() => setGlobalTab("texts")}
          className={`flex flex-col items-center justify-center w-20 h-full transition-all ${
            globalTab === "texts" ? "text-orange-500 scale-105" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <span className="text-xl">📖</span>
          <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">Тексты</span>
        </button>
      </div>
    </div>
  )
}