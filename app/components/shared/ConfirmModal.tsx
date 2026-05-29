"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes } from "react-icons/fa"
import { useTheme } from "../../../hooks/useTheme"

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Вы уверены?",
  message = "Весь прогресс текущего урока будет потерян.",
  confirmText = "Да, выйти",
  cancelText = "Отмена",
}: ConfirmModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-md rounded-2xl ${
                isDark
                  ? "bg-gray-800/90 backdrop-blur-xl border-gray-700"
                  : "bg-white/90 backdrop-blur-sm border-gray-200 shadow-2xl"
              } border p-6 text-center`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                aria-label="Закрыть"
              >
                <FaTimes size={18} aria-hidden="true" />
              </button>
              <h3 id="confirm-title" className={`text-xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {title}
              </h3>
              <p id="confirm-message" className={`text-sm mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
                  aria-label={confirmText}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition ${
                    isDark
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  aria-label={cancelText}
                >
                  {cancelText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}