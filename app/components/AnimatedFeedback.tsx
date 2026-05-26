"use client"

import { motion, AnimatePresence } from "framer-motion"

type AnimatedFeedbackProps = {
  isCorrect: boolean | null
  duration?: number
  onComplete?: () => void
}

export default function AnimatedFeedback({ isCorrect, duration = 800, onComplete }: AnimatedFeedbackProps) {
  if (isCorrect === null) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 0 }}
        animate={{ opacity: 1, scale: 1.5, y: -50 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: duration / 1000 }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
      >
        <div className={`text-8xl font-black drop-shadow-2xl ${isCorrect ? "text-green-500" : "text-red-500"}`}>
          {isCorrect ? "✓" : "✗"}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}