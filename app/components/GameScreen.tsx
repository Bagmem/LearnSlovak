"use client"

import { type Word, type LanguageLevel } from "../../data/words"
import { type WordStats } from "../../lib/game"
import GameUI from "./game/GameUI"
import FlashcardMode from "./game/FlashcardMode"
import ConfirmModal from "./shared/ConfirmModal"

type GameScreenProps = {
  gameMode: "choice" | "write" | "flashcard"
  currentWord: Word | null
  options: string[]
  message: string
  selectedOption: string | null
  isAnswering: boolean
  lives: number
  disabled: boolean
  lessonProgress: number
  wordsLeft: number
  totalWords: number
  remainingCount: number
  xp: number
  streak: number
  sessionCorrect: number
  sessionTotal: number
  speechRate: number
  autoSpeakOnCorrect: boolean
  onFlashcardNext: (known: boolean) => void
  onAnswer: (input: string) => void
  onNext: () => void
  onRestart: () => void
  onBack: () => void
  onSkip: () => void
  onMarkHard: (word: Word) => void
  isExitConfirmOpen: boolean
  onCloseExitConfirm: () => void
  onConfirmExit: () => void
  getWordKey: (word: Word) => string
}

export default function GameScreen({
  gameMode,
  currentWord,
  options,
  message,
  selectedOption,
  isAnswering,
  lives,
  disabled,
  lessonProgress,
  wordsLeft,
  totalWords,
  remainingCount,
  xp,
  streak,
  sessionCorrect,
  sessionTotal,
  speechRate,
  autoSpeakOnCorrect,
  onFlashcardNext,
  onAnswer,
  onNext,
  onRestart,
  onBack,
  onSkip,
  onMarkHard,
  isExitConfirmOpen,
  onCloseExitConfirm,
  onConfirmExit,
  getWordKey,
}: GameScreenProps) {
  if (gameMode === "flashcard") {
    return (
      <>
        <FlashcardMode
          key={currentWord ? getWordKey(currentWord) : undefined}
          word={currentWord}
          onNext={onFlashcardNext}
          onBack={onBack}
          onRestart={onRestart}
          lessonProgress={lessonProgress}
          wordsLeft={wordsLeft}
          totalWords={totalWords}
          remainingCount={remainingCount}
          onSkip={onSkip}
          onMarkHard={onMarkHard}
          sessionCorrect={sessionCorrect}
          sessionTotal={sessionTotal}
        />
        <ConfirmModal
          isOpen={isExitConfirmOpen}
          onClose={onCloseExitConfirm}
          onConfirm={onConfirmExit}
          title="Выйти из урока?"
          message="Весь прогресс текущего урока будет потерян. Вы уверены?"
          confirmText="Да, выйти"
          cancelText="Отмена"
        />
      </>
    )
  }

  return (
    <>
      <GameUI
        xp={xp}
        streak={streak}
        lives={lives}
        word={currentWord}
        options={options}
        message={message}
        selectedOption={selectedOption}
        onAnswer={onAnswer}
        onNext={onNext}
        onRestart={onRestart}
        onBack={onBack}
        onSkip={onSkip}
        onMarkHard={onMarkHard}
        disabled={disabled}
        lessonProgress={lessonProgress}
        gameMode={gameMode}
        wordsLeft={wordsLeft}
        totalWords={totalWords}
        remainingCount={remainingCount}
        speechRate={speechRate}
        autoSpeakOnCorrect={autoSpeakOnCorrect}
        sessionCorrect={sessionCorrect}
        sessionTotal={sessionTotal}
      />
      <ConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={onCloseExitConfirm}
        onConfirm={onConfirmExit}
        title="Выйти из урока?"
        message="Весь прогресс текущего урока будет потерян. Вы уверены?"
        confirmText="Да, выйти"
        cancelText="Отмена"
      />
    </>
  )
}