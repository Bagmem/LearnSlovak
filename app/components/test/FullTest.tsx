"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowLeft, FaArrowRight, FaBookOpen, FaPencilAlt, FaLanguage, FaExchangeAlt, FaQuestionCircle } from "react-icons/fa"
import { LanguageLevel } from "../../../data/words"
import { getTextSection, getTranslationWords, getVerbQuestions, getMatchPairs, getTrueFalseQuestions } from "../../../lib/testData"
import { playClickSound, playVictorySound } from "../../../lib/sounds"
import confetti from "canvas-confetti"
import ConfirmModal from "../shared/ConfirmModal"
import SectionText from "./SectionText"
import SectionTranslation from "./SectionTranslation"
import type { TranslationWord } from "./SectionTranslation"
import SectionVerb from "./SectionVerb"
import type { VerbQuestion } from "./SectionVerb"
import SectionMatch from "./SectionMatch"
import SectionTrueFalse from "./SectionTrueFalse"
import TestResults from "./TestResults"

type FullTestProps = {
  level: LanguageLevel
  onComplete: (score: number, total: number, xp: number) => void
  onBack: () => void
}

const sectionInfos = [
  { title: "Текст и вопросы", icon: FaBookOpen, description: "Прочитайте текст и ответьте на вопросы." },
  { title: "Перевод слов", icon: FaPencilAlt, description: "Переведите слова с русского на словацкий." },
  { title: "Формы глаголов", icon: FaLanguage, description: "Вставьте правильную форму глагола." },
  { title: "Сопоставление пар", icon: FaExchangeAlt, description: "Соедините словацкие слова с их переводами." },
  { title: "Правда / Ложь", icon: FaQuestionCircle, description: "Оцените истинность утверждений о языке." },
]

function getBaseTestData(level: LanguageLevel) {
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
  return { textSection, translationWords, verbQuestions, matchPairs: matchPairsData, tfStatements }
}

export default function FullTest({ level, onComplete, onBack }: FullTestProps) {
  const [testData, setTestData] = useState(() => getBaseTestData(level))
  const [section, setSection] = useState(0)
  const [sectionScores, setSectionScores] = useState<{ score: number; max: number }[]>([])
  const [sectionAnswers, setSectionAnswers] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [retryMistakes, setRetryMistakes] = useState<any[] | null>(null)

  // При смене уровня генерируем новые данные
  useEffect(() => {
    setTestData(getBaseTestData(level))
    setRetryMistakes(null)
    setSection(0)
    setSectionScores([])
    setSectionAnswers([])
    setShowResults(false)
    setShowIntro(true)
  }, [level])

  function sectionHasData(sec: number): boolean {
    if (!testData) return false
    switch (sec) {
      case 0: return !!testData.textSection?.questions?.length
      case 1: return testData.translationWords.length > 0
      case 2: return testData.verbQuestions.length > 0
      case 3: return testData.matchPairs?.pairs?.length > 0
      case 4: return testData.tfStatements.length > 0
      default: return false
    }
  }

  const handleSectionComplete = (score: number, maxScore: number, answers: any) => {
    const newScores = [...sectionScores]
    newScores[section] = { score, max: maxScore }
    setSectionScores(newScores)
    setSectionAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[section] = answers
      return newAnswers
    })

    let nextSection = section + 1
    while (nextSection < 5) {
      if (sectionHasData(nextSection)) break
      nextSection++
    }
    if (nextSection < 5) {
      setSection(nextSection)
      setShowIntro(true)
    } else {
      setShowResults(true)
    }
  }

  const handleFinish = () => {
    const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0)
    const totalMax = sectionScores.reduce((sum, s) => sum + s.max, 0)
    const xpEarned = totalScore * 5
    if (totalMax > 0 && totalScore / totalMax >= 0.9) {
      playVictorySound()
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } })
    }
    onComplete(totalScore, totalMax, xpEarned)
  }

  const handleBack = () => {
    playClickSound()
    if (section === 0) {
      setIsExitConfirmOpen(true)
    } else {
      setSection(section - 1)
      setShowIntro(true)
      setSectionScores(prev => prev.slice(0, -1))
      setSectionAnswers(prev => prev.slice(0, -1))
    }
  }

  const handleStartSection = () => {
    setShowIntro(false)
  }

  if (!testData || !testData.textSection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Нет данных для теста этого уровня</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition"
        >
          Назад к уровням
        </button>
      </div>
    )
  }

  if (showResults) {
    const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0)
    const totalMax = sectionScores.reduce((sum, s) => sum + s.max, 0)
    const xpEarned = totalScore * 5
    const isPassed = totalMax > 0 && (totalScore / totalMax) >= 0.9

    const sectionNames = sectionInfos.map(s => s.title)
    const sectionResults = sectionScores.map((s, idx) => ({
      title: sectionNames[idx],
      score: s.score,
      maxScore: s.max,
      percentage: s.max ? Math.round((s.score / s.max) * 100) : 0,
    }))

    const mistakes: { section: string; question: string; yourAnswer: string; correctAnswer: string; explanation?: string }[] = []

    if (sectionAnswers[0]) {
      const answers = sectionAnswers[0] as number[]
      testData.textSection.questions.forEach((q: any, idx: number) => {
        if (answers[idx] !== q.correct) {
          mistakes.push({
            section: "Текст и вопросы",
            question: q.text,
            yourAnswer: q.options[answers[idx]],
            correctAnswer: q.options[q.correct],
          })
        }
      })
    }

    if (sectionAnswers[1]) {
      const userAnswers = sectionAnswers[1] as string[]
      testData.translationWords.forEach((w: any, idx: number) => {
        const input = userAnswers[idx].toLowerCase().trim()
        const tw = w as TranslationWord
        const correctAnswers = [tw.russian, ...(tw.accepted || [])].map(s => s.toLowerCase().trim())
        if (!correctAnswers.includes(input)) {
          mistakes.push({
            section: "Перевод слов",
            question: tw.slovak,
            yourAnswer: userAnswers[idx],
            correctAnswer: tw.russian,
          })
        }
      })
    }

    if (sectionAnswers[2]) {
      const answers = sectionAnswers[2] as (number | string)[]
      testData.verbQuestions.forEach((q: any, idx: number) => {
        const vq = q as VerbQuestion
        const userAns = answers[idx]
        const correctIdx = vq.correct
        const userAnsStr = typeof userAns === 'string' ? userAns : vq.options[userAns as number]
        const correctAnsStr = vq.options[correctIdx]
        const isCorrect = typeof userAns === 'string'
          ? userAnsStr.toLowerCase().trim() === correctAnsStr.toLowerCase().trim()
          : userAns === correctIdx
        if (!isCorrect) {
          mistakes.push({
            section: "Формы глаголов",
            question: vq.sentence,
            yourAnswer: userAnsStr,
            correctAnswer: correctAnsStr,
            explanation: vq.explanation,
          })
        }
      })
    }

    if (sectionAnswers[3]) {
      const connections = sectionAnswers[3] as Map<number, number>
      const left = testData.matchPairs.left
      const right = testData.matchPairs.right
      const pairs = testData.matchPairs.pairs
      left.forEach((slovak: string, idx: number) => {
        const correctRussian = pairs.find(p => p.slovak === slovak)?.russian
        const userRussian = connections.has(idx) ? right[connections.get(idx)!] : "—"
        if (userRussian !== correctRussian) {
          mistakes.push({
            section: "Сопоставление пар",
            question: slovak,
            yourAnswer: userRussian,
            correctAnswer: correctRussian || "",
          })
        }
      })
    }

    if (sectionAnswers[4]) {
      const answers = sectionAnswers[4] as boolean[]
      testData.tfStatements.forEach((s: any, idx: number) => {
        if (answers[idx] !== s.isTrue) {
          mistakes.push({
            section: "Правда / Ложь",
            question: s.statement,
            yourAnswer: answers[idx] ? "Верно" : "Неверно",
            correctAnswer: s.isTrue ? "Верно" : "Неверно",
          })
        }
      })
    }

    return (
      <TestResults
        level={level}
        totalScore={totalScore}
        totalMax={totalMax}
        xpEarned={xpEarned}
        sectionResults={sectionResults}
        isPassed={isPassed}
        mistakes={mistakes}
        onFinish={handleFinish}
        onRetryMistakes={(mistakes) => {
          const base = getBaseTestData(level)
          const filtered = {
            textSection: base.textSection ? {
              ...base.textSection,
              questions: base.textSection.questions.filter((q: any) =>
                mistakes.some(m => m.section === "Текст и вопросы" && m.question === q.text)
              ),
            } : null,
            translationWords: base.translationWords.filter((w: any) =>
              mistakes.some(m => m.section === "Перевод слов" && m.question === w.slovak)
            ),
            verbQuestions: base.verbQuestions.filter((v: any) =>
              mistakes.some(m => m.section === "Формы глаголов" && m.question === v.sentence)
            ),
            matchPairs: {
              ...base.matchPairs,
              pairs: base.matchPairs.pairs.filter((p: any) =>
                mistakes.some(m => m.section === "Сопоставление пар" && m.question === p.slovak)
              ),
            },
            tfStatements: base.tfStatements.filter((s: any) =>
              mistakes.some(m => m.section === "Правда / Ложь" && m.question === s.statement)
            ),
          }
          setTestData(filtered)
          setRetryMistakes(mistakes)
          setSection(0)
          setSectionScores([])
          setSectionAnswers([])
          setShowResults(false)
          setShowIntro(true)
        }}
      />
    )
  }

  const currentSection = section
  const sectionsCount = 5
  const progressPercent = (currentSection / sectionsCount) * 100
  const currentInfo = sectionInfos[currentSection]

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition flex items-center gap-1"
            aria-label={section === 0 ? "Выйти из теста" : "Назад к предыдущей секции"}
          >
            <FaArrowLeft className="inline mr-1" />
            {section === 0 ? "К уровням" : "Назад"}
          </button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              {currentInfo && <currentInfo.icon className="text-orange-500" />}
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentInfo?.title}
              </h2>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Секция {currentSection + 1} из {sectionsCount}
            </p>
          </div>
        </div>

        {showIntro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/90 to-amber-50/50 dark:from-gray-800/90 dark:to-amber-900/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md text-center"
          >
            <currentInfo.icon className="text-4xl text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">{currentInfo.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{currentInfo.description}</p>
            <button
              onClick={handleStartSection}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 mx-auto"
            >
              <FaArrowRight /> Начать
            </button>
          </motion.div>
        )}

        {!showIntro && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentSection === 0 && testData.textSection && (
                <SectionText
                  text={testData.textSection.text}
                  questions={testData.textSection.questions}
                  onComplete={handleSectionComplete}
                />
              )}
              {currentSection === 1 && (
                <SectionTranslation
                  words={testData.translationWords}
                  onComplete={handleSectionComplete}
                />
              )}
              {currentSection === 2 && (
                <SectionVerb
                  questions={testData.verbQuestions}
                  onComplete={handleSectionComplete}
                  level={level}
                />
              )}
              {currentSection === 3 && testData.matchPairs && (
                <SectionMatch
                  matchData={testData.matchPairs}
                  onComplete={handleSectionComplete}
                />
              )}
              {currentSection === 4 && (
                <SectionTrueFalse
                  statements={testData.tfStatements}
                  onComplete={handleSectionComplete}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <ConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={() => {
          setIsExitConfirmOpen(false)
          onBack()
        }}
        title="Выйти из теста?"
        message="Весь прогресс текущего теста будет потерян. Вы уверены?"
        confirmText="Да, выйти"
        cancelText="Отмена"
      />
    </>
  )
}