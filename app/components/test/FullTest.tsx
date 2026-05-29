"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowLeft } from "react-icons/fa"
import { LanguageLevel } from "../../../data/words"
import { getTextSection, getTranslationWords, getVerbQuestions, getMatchPairs, getTrueFalseQuestions } from "../../../lib/testData"
import { playClickSound, playVictorySound } from "../../../lib/sounds"
import confetti from "canvas-confetti"
import ConfirmModal from "../shared/ConfirmModal"
import SectionText from "./SectionText"
import SectionTranslation from "./SectionTranslation"
import SectionVerb from "./SectionVerb"
import SectionMatch from "./SectionMatch"
import SectionTrueFalse from "./SectionTrueFalse"
import TestResults from "./TestResults"

type FullTestProps = {
  level: LanguageLevel
  onComplete: (score: number, total: number, xp: number) => void
  onBack: () => void
}

export default function FullTest({ level, onComplete, onBack }: FullTestProps) {
  const [section, setSection] = useState(0)
  const [sectionScores, setSectionScores] = useState<{ score: number; max: number }[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)

  const testData = useMemo(() => {
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
    if (totalScore / totalMax >= 0.9) {
      playVictorySound()
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } })
    }
    onComplete(totalScore, totalMax, xpEarned)
  }

  const handleBackWithConfirm = () => {
    playClickSound()
    setIsExitConfirmOpen(true)
  }

  if (!testData || !testData.textSection) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (showResults) {
    const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0)
    const totalMax = sectionScores.reduce((sum, s) => sum + s.max, 0)
    const xpEarned = totalScore * 5
    const isPassed = (totalScore / totalMax) >= 0.9

    const sectionNames = [
      "Текст и вопросы",
      "Перевод слов",
      "Формы глаголов",
      "Сопоставление пар",
      "Правда / Ложь",
    ]

    const sectionResults = sectionScores.map((s, idx) => ({
      title: sectionNames[idx],
      score: s.score,
      maxScore: s.max,
      percentage: Math.round((s.score / s.max) * 100),
    }))

    return (
      <TestResults
        level={level}
        totalScore={totalScore}
        totalMax={totalMax}
        xpEarned={xpEarned}
        sectionResults={sectionResults}
        isPassed={isPassed}
        onFinish={handleFinish}
      />
    )
  }

  const currentSection = section
  const sectionsCount = 5
  const progressPercent = (currentSection / sectionsCount) * 100

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackWithConfirm}
            className="text-gray-400 hover:text-gray-600 transition flex items-center gap-1"
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