"use client"
import { useState, useEffect } from "react"

export default function CircularProgress({
  percent,
  label,
  color = "#f97316",
  size = 100,
  icon,
}: {
  percent: number
  label: string
  color?: string
  size?: number
  icon?: React.ReactNode
}) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const [animatedPercent, setAnimatedPercent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percent), 100)
    return () => clearTimeout(timer)
  }, [percent])

  const offset = circumference - (animatedPercent / 100) * circumference

  return (
    <div className="flex flex-col items-center overflow-visible">
      <div className="relative overflow-visible" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full overflow-visible">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="6" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className="text-2xl mb-1">{icon}</div>}
          <div className="text-lg font-black text-gray-800 dark:text-white">{Math.round(animatedPercent)}%</div>
        </div>
      </div>
      <span className="text-xs font-semibold mt-2 text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  )
}