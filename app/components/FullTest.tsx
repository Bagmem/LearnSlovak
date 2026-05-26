"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowLeft } from "react-icons/fa"
import { LanguageLevel } from "../../data/words"
import { getTextSection, getTranslationWords, getVerbQuestions, getMatchPairs, getTrueFalseQuestions } from "../../lib/testData"
import { playClickSound, playCorrectSound, playWrongSound, playVictorySound } from "../../lib/sounds"
import confetti from "canvas-confetti"

type FullTestProps = {
  level: LanguageLevel
  onComplete: (score: number, total: number, xp: number) => void
  onBack: () => void
}

export default function FullTest({ level, onComplete, onBack }: FullTestProps) {
  const [section, setSection] = useState(0)
  const [sectionScores, setSectionScores] = useState<{ score: number; max: number }[]>([])
  const [testData, setTestData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const textSection = getTextSection(level)
    const translationWords = getTranslationWords(level)
    const verbQuestions = getVerbQuestions(level, 6)
    const matchPairsRaw = getMatchPairs(level, 6)
    let matchPairsData: { left: string[]; right: string[]; pairs: { slovak: string; russian: string }[] } = {
      left: [],
      right: [],
      pairs: [],
    }
    if (matchPairsRaw && typeof matchPairsRaw === 'object' && 'pairs' in matchPairsRaw) {
      matchPairsData = matchPairsRaw as typeof matchPairsData
    } else if (Array.isArray(matchPairsRaw)) {
      const pairs = matchPairsRaw as { slovak: string; russian: string }[]
      matchPairsData = {
        left: pairs.map(p => p.slovak),
        right: pairs.map(p => p.russian),
        pairs,
      }
    }
   const tfStatements = getTrueFalseQuestions(level, 6)
    setTestData({ textSection, translationWords, verbQuestions, matchPairs: matchPairsData, tfStatements })
    setLoading(false)
  }, [level])

  const handleSectionComplete = (score: number, maxScore: number) => {
    const newScores = [...sectionScores]
    newScores[section] = { score, max: maxScore }
    setSectionScores(newScores)
    if (section < 4) {
      setSection(section + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleFinish = () => {
    const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0)
    const totalMax = sectionScores.reduce((sum, s) => sum + s.max, 0)
    const xpEarned = totalScore * 5
    if (totalScore === totalMax) {
      playVictorySound()
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } })
    }
    onComplete(totalScore, totalMax, xpEarned)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (showResults) {
    const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0)
    const totalMax = sectionScores.reduce((sum, s) => sum + s.max, 0)
    const totalPercentage = Math.round((totalScore / totalMax) * 100)
    const xpEarned = totalScore * 5

    const sectionNames = [
      "Текст и вопросы",
      "Перевод слов",
      "Формы глаголов",
      "Сопоставление пар",
      "Правда / Ложь",
    ]

    const results = sectionScores.map((s, idx) => ({
      title: sectionNames[idx],
      score: s.score,
      maxScore: s.max,
      percentage: Math.round((s.score / s.max) * 100),
    }))

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="text-5xl mb-3"
            >
              📊
            </motion.div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Результаты теста
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Уровень {level}</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle className="text-gray-200 dark:text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                <motion.circle
                  className="text-orange-500"
                  strokeWidth="8"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * totalPercentage) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-gray-800 dark:text-white">{totalPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {results.map((res, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-white">{res.title}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${res.percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <span className="font-black text-gray-800 dark:text-white">{res.score}</span>
                  <span className="text-gray-500">/{res.maxScore}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700 dark:text-gray-300">Всего баллов</span>
              <span className="text-2xl font-black text-orange-500">{totalScore}/{totalMax}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700 dark:text-gray-300">Награда</span>
              <span className="text-xl font-black text-green-500">+{xpEarned} XP</span>
            </div>
          </div>

          {totalScore !== totalMax && (
            <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl text-center">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠️ Для получения отметки о прохождении уровня необходимо ответить правильно на <strong>все вопросы</strong>.
              </p>
            </div>
          )}

          <button
            onClick={() => {
              playClickSound()
              handleFinish()
            }}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ЗАВЕРШИТЬ
          </button>
        </div>
      </motion.div>
    )
  }

  const currentSection = section
  const sectionsCount = 5
  const progressPercent = (currentSection / sectionsCount) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            playClickSound()
            onBack()
          }}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <FaArrowLeft className="inline mr-1" /> Назад к уровням
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {currentSection === 0 && "1. Текст и вопросы"}
            {currentSection === 1 && "2. Перевод слов"}
            {currentSection === 2 && "3. Формы глаголов"}
            {currentSection === 3 && "4. Сопоставление пар"}
            {currentSection === 4 && "5. Правда / Ложь"}
          </h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentSection === 0 && testData.textSection && (
            <SectionText text={testData.textSection.text} questions={testData.textSection.questions} onComplete={handleSectionComplete} />
          )}
          {currentSection === 1 && (
            <SectionTranslation words={testData.translationWords} onComplete={handleSectionComplete} />
          )}
          {currentSection === 2 && (
            <SectionVerb questions={testData.verbQuestions} onComplete={handleSectionComplete} />
          )}
          {currentSection === 3 && testData.matchPairs && (
            <SectionMatch matchData={testData.matchPairs} onComplete={handleSectionComplete} />
          )}
          {currentSection === 4 && (
            <SectionTrueFalse statements={testData.tfStatements} onComplete={handleSectionComplete} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ========== Секция 1 ==========
function SectionText({ text, questions, onComplete }: { text: any; questions: any[]; onComplete: (score: number, maxScore: number) => void }) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const allAnswered = answers.every(a => a !== -1)

  const handleSubmit = () => {
    let correct = 0
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) correct++
    })
    onComplete(correct, questions.length)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{text.content}</p>
      </div>
      {questions.map((q, idx) => (
        <div key={idx} className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{q.text}</p>
          <div className="space-y-2">
            {q.options.map((opt: string, optIdx: number) => (
              <button
                key={optIdx}
                onClick={() => {
                  const newAnswers = [...answers]
                  newAnswers[idx] = optIdx
                  setAnswers(newAnswers)
                }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                  answers[idx] === optIdx
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          allAnswered
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
        }`}
      >
        Далее →
      </button>
    </div>
  )
}

// ========== Секция 2 ==========
function SectionTranslation({ words, onComplete }: { words: { slovak: string; russian: string }[]; onComplete: (score: number, maxScore: number) => void }) {
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(words.length).fill(""))
  const allFilled = userAnswers.every(a => a.trim() !== "")

  const handleSubmit = () => {
    let correct = 0
    userAnswers.forEach((ans, idx) => {
      if (ans.toLowerCase().trim() === words[idx].russian.toLowerCase().trim()) correct++
    })
    onComplete(correct, words.length)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200/50 dark:border-gray-700/50">
      {words.map((w, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
          <span className="font-bold text-lg text-gray-800 dark:text-white w-32">{w.slovak}</span>
          <input
            type="text"
            value={userAnswers[idx]}
            onChange={e => {
              const newAnswers = [...userAnswers]
              newAnswers[idx] = e.target.value
              setUserAnswers(newAnswers)
            }}
            placeholder="Введите перевод"
            className="flex-1 p-2 border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!allFilled}
        className={`w-full py-3 rounded-xl font-bold transition-all mt-4 ${
          allFilled
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
        }`}
      >
        Далее →
      </button>
    </div>
  )
}

// ========== Секция 3 ==========
function SectionVerb({ questions, onComplete }: { questions: any[]; onComplete: (score: number, maxScore: number) => void }) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const allAnswered = answers.every(a => a !== -1)

  const handleSubmit = () => {
    let correct = 0
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) correct++
    })
    onComplete(correct, questions.length)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      {questions.map((q, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{q.sentence}</p>
          <div className="flex flex-wrap gap-3">
            {q.options.map((opt: string, optIdx: number) => (
              <button
                key={optIdx}
                onClick={() => {
                  const newAnswers = [...answers]
                  newAnswers[idx] = optIdx
                  setAnswers(newAnswers)
                }}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  answers[idx] === optIdx
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-orange-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className={`w-full py-3 rounded-xl font-bold transition-all ${
          allAnswered
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
        }`}
      >
        Далее →
      </button>
    </div>
  )
}
// ========== Секция 4 (сопоставление пар) – без отображения результата, просто переход ==========
function SectionMatch({ matchData, onComplete }: { matchData: { left: string[]; right: string[]; pairs: { slovak: string; russian: string }[] }; onComplete: (score: number, maxScore: number) => void }) {
  const { left, right, pairs } = matchData
  const [connections, setConnections] = useState<Map<number, number>>(new Map())
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)

  const allConnected = left.length === connections.size

  const handleLeftClick = (idx: number) => {
    if (connections.has(idx)) {
      const newConn = new Map(connections)
      newConn.delete(idx)
      setConnections(newConn)
      if (selectedLeft === idx) setSelectedLeft(null)
    } else {
      setSelectedLeft(idx)
    }
  }

  const handleRightClick = (idx: number) => {
    if (selectedLeft !== null) {
      const newConn = new Map(connections)
      // Если это правое уже соединено с другим левым, удаляем ту связь
      let existingLeft: number | undefined
      for (let [l, r] of newConn.entries()) {
        if (r === idx) {
          existingLeft = l
          break
        }
      }
      if (existingLeft !== undefined) {
        newConn.delete(existingLeft)
      }
      newConn.set(selectedLeft, idx)
      setConnections(newConn)
      setSelectedLeft(null)
    } else {
      // Если ничего не выбрано, но кликнули на правое – пробуем разорвать его связь
      let leftToRemove: number | undefined
      for (let [l, r] of connections.entries()) {
        if (r === idx) {
          leftToRemove = l
          break
        }
      }
      if (leftToRemove !== undefined) {
        const newConn = new Map(connections)
        newConn.delete(leftToRemove)
        setConnections(newConn)
      }
    }
  }

  const handleNext = () => {
    if (!allConnected) return
    let correct = 0
    for (let [l, r] of connections.entries()) {
      const slovak = left[l]
      const expected = pairs.find(p => p.slovak === slovak)?.russian
      if (expected === right[r]) correct++
    }
    onComplete(correct, pairs.length)
  }

  // Простая подсветка: выбранное левое слово – оранжевое, соединённые слова – оранжевые
  const getLeftStyle = (idx: number) => {
    if (connections.has(idx)) return "bg-orange-100 dark:bg-orange-900 border-orange-400 shadow-md"
    if (selectedLeft === idx) return "bg-orange-100 dark:bg-orange-900 border-2 border-orange-500 shadow-md"
    return "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
  }

  const getRightStyle = (idx: number) => {
    let isConnected = false
    for (let r of connections.values()) if (r === idx) { isConnected = true; break }
    if (isConnected) return "bg-orange-100 dark:bg-orange-900 border-orange-400 shadow-md"
    return "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">🇸🇰 Словацкий</h3>
          {left.map((word, idx) => (
            <div key={idx} onClick={() => handleLeftClick(idx)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${getLeftStyle(idx)}`}>
              {word}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">🇷🇺 Русский</h3>
          {right.map((word, idx) => (
            <div key={idx} onClick={() => handleRightClick(idx)} className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${getRightStyle(idx)}`}>
              {word}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleNext}
          disabled={!allConnected}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            allConnected
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          }`}
        >
          Далее →
        </button>
        <button
          onClick={() => { setConnections(new Map()); setSelectedLeft(null); }}
          className="px-4 py-3 rounded-xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Сбросить все
        </button>
      </div>
    </div>
  )
}

// ========== Секция 5 ==========
function SectionTrueFalse({ statements, onComplete }: { statements: { statement: string; isTrue: boolean }[]; onComplete: (score: number, maxScore: number) => void }) {
  const [answers, setAnswers] = useState<boolean[]>(new Array(statements.length).fill(false))
  const allAnswered = answers.every(a => a !== undefined && a !== null)

  const handleSubmit = () => {
    let correct = 0
    answers.forEach((ans, idx) => {
      if (ans === statements[idx].isTrue) correct++
    })
    onComplete(correct, statements.length)
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200/50 dark:border-gray-700/50">
      {statements.map((stmt, idx) => (
        <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
          <p className="font-bold mb-3 text-gray-800 dark:text-white">{stmt.statement}</p>
          <div className="flex gap-4">
            <button
              onClick={() => { const newA = [...answers]; newA[idx] = true; setAnswers(newA); }}
              className={`px-6 py-2 rounded-full font-bold transition-all ${answers[idx] === true ? "bg-green-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
            >
              Верно
            </button>
            <button
              onClick={() => { const newA = [...answers]; newA[idx] = false; setAnswers(newA); }}
              className={`px-6 py-2 rounded-full font-bold transition-all ${answers[idx] === false ? "bg-red-500 text-white shadow-md" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
            >
              Неверно
            </button>
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={!allAnswered} className={`w-full py-3 rounded-xl font-bold transition-all ${allAnswered ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:scale-[1.01]" : "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"}`}>
        Завершить тест
      </button>
    </div>
  )
}