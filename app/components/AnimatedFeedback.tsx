"use client"


type AnimatedFeedbackProps = {
  isCorrect: boolean | null
  duration?: number
  onComplete?: () => void
}

export default function AnimatedFeedback({ isCorrect, duration = 800, onComplete }: AnimatedFeedbackProps) {
  if (isCorrect === null) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 animate-fadeOutUp"
      style={{ animationDuration: `${duration}ms` }}
      onAnimationEnd={onComplete}
    >
      <div className={`text-8xl font-black drop-shadow-2xl ${isCorrect ? "text-green-500" : "text-red-500"} animate-bounce`}>
        {isCorrect ? "✓" : "✗"}
      </div>
    </div>
  )
}