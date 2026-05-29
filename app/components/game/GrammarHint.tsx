"use client"

type GrammarHintProps = {
  hintText: string
}

export default function GrammarHint({ hintText }: GrammarHintProps) {
  return (
    <div className="relative group">
      <div className="w-10 h-10 flex items-center justify-center text-xl bg-gray-100 dark:bg-gray-700 rounded-full cursor-help hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        💡
      </div>
      <div className="absolute right-0 top-12 w-64 p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {hintText}
        </p>
      </div>
    </div>
  )
}