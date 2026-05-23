"use client"

type CategoryCardProps = {
  name: string
  passedCount: number
  totalCount: number
  isCompleted: boolean
  onSelect: () => void
}

export default function CategoryCard({
  name,
  passedCount,
  totalCount,
  isCompleted,
  onSelect,
}: CategoryCardProps) {
  const progressPercent = (passedCount / totalCount) * 100

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all transform active:scale-[0.98] ${
        isCompleted
          ? "border-green-400 dark:border-green-600 bg-green-50/30 dark:bg-green-900/30 hover:bg-green-50 dark:hover:bg-green-900"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50/30 dark:hover:bg-orange-900/30"
      }`}
    >
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-black text-gray-800 dark:text-white">{name}</span>
          {isCompleted && (
            <span className="text-xs font-black text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded-full">
              ✓
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
            {passedCount}/{totalCount}
          </span>
        </div>
      </div>
      <span className="text-gray-300 dark:text-gray-600 text-xl font-black ml-3">→</span>
    </button>
  )
}