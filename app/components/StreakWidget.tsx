"use client"


type StreakProps = {
  streak: number
  activeDates: string[]
}

export default function StreakWidget({ streak, activeDates }: StreakProps) {
  const daysLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
  const current = new Date()
  const currentDay = current.getDay()
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay
  const monday = new Date(current)
  monday.setDate(current.getDate() + distanceToMonday)

  const todayStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`

  const weekDays = daysLabels.map((label, index) => {
    const dayDate = new Date(monday)
    dayDate.setDate(monday.getDate() + index)
    const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, "0")}-${String(dayDate.getDate()).padStart(2, "0")}`
    return {
      dayName: label,
      dateStr,
      isToday: dateStr === todayStr,
    }
  })

  return (
    <div className="w-full max-w-md bg-white p-5 rounded-2xl border-2 border-b-6 border-gray-200 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🔥</span>
          <div>
            <h3 className="text-lg font-black text-gray-800 leading-tight">Ударный режим</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Занимайся каждый день</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-orange-500">{streak}</span>
          <span className="text-sm font-bold text-gray-500">
            {" "}{streak === 1 ? "день" : streak > 1 && streak < 5 ? "дня" : "дней"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => {
          const isCompleted = activeDates.includes(day.dateStr)
          
          let circleStyles = "bg-gray-100 text-gray-300 border-gray-200 text-xs"
          if (isCompleted) {
            circleStyles = "bg-orange-500 text-white border-orange-600 shadow-sm shadow-orange-200"
          } else if (day.isToday) {
            circleStyles = "bg-white text-orange-500 border-orange-400 border-2"
          }

          return (
            <div key={day.dateStr} className="flex flex-col items-center gap-1.5">
              <span className={`text-xs font-black ${day.isToday ? "text-orange-500" : "text-gray-400"}`}>
                {day.dayName}
              </span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black border-b-4 transition-all duration-300 ${circleStyles}`}>
                {isCompleted ? "🔥" : "•"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}