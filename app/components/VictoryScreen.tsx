"use client"

type VictoryProps = {
  category: string
  xpEarned: number
  accuracy: number
  onBack: () => void
}

export default function VictoryScreen({ category, xpEarned, accuracy, onBack }: VictoryProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="text-7xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-3xl font-black text-green-600 mb-1">Урок завершен!</h1>
      <p className="text-gray-500 font-bold mb-8">Тема: {category}</p>

      <div className="w-full max-w-sm bg-white border-2 border-b-6 border-gray-200 rounded-2xl p-6 flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Награда</span>
          <span className="text-xl font-black text-amber-500">+{xpEarned} XP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Точность</span>
          <span className="text-xl font-black text-green-500">{accuracy}%</span>
        </div>
      </div>

      <button
        onClick={onBack}
        className="w-full max-w-sm bg-green-500 hover:bg-green-400 text-white py-4 rounded-xl font-black text-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-[4px] transition-all"
      >
        ПРОДОЛЖИТЬ
      </button>
    </div>
  )
}