"use client"

import { useState } from "react"

type GrammarHintProps = {
  hintText: string
}

export default function GrammarHint({ hintText }: GrammarHintProps) {
  const [isOpen, setIsOpen] = useState(false)

  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, index) => {
      const formattedLine = line.split("**").map((part, i) => {
        return i % 2 === 1 ? <strong key={i} className="font-black text-gray-900">{part}</strong> : part
      })
      
      return (
        <p key={index} className="text-sm text-gray-600 leading-relaxed my-1">
          {formattedLine}
        </p>
      )
    })
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-xl border-2 border-b-4 flex items-center justify-center transition-all active:scale-95 ${
          isOpen
            ? "bg-yellow-100 border-yellow-400 text-yellow-600 shadow-inner"
            : "bg-white border-gray-200 text-gray-400 hover:border-yellow-400 hover:text-yellow-500 shadow-sm"
        }`}
      >
        <span className={`text-xl transition-transform ${isOpen ? "scale-110 rotate-12" : ""}`}>💡</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-3 w-72 bg-yellow-50 border-2 border-b-6 border-yellow-200 rounded-2xl p-4 shadow-xl z-50 animate-fadeIn text-left">
            <div className="flex items-center gap-2 border-b border-yellow-200 pb-2 mb-2">
              <span className="text-lg">🧠</span>
              <h5 className="font-black text-xs uppercase tracking-wider text-yellow-700">Грамматическая справка</h5>
            </div>
            
            <div className="space-y-1 bg-white p-3 rounded-xl border border-yellow-100 max-h-48 overflow-y-auto">
              {renderFormattedText(hintText)}
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-white font-black text-xs rounded-lg border-b-2 border-yellow-600 transition-all active:scale-[0.98]"
            >
              Понятно!
            </button>
          </div>
        </>
      )}
    </div>
  )
}