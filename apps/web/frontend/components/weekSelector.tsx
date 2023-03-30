import {
  eachWeekOfInterval,
  endOfWeek,
  endOfYear,
  format,
  getWeek,
  getYear,
  isSameYear,
  isThisWeek,
  setWeek,
  setYear,
  startOfWeek,
  startOfYear,
} from 'date-fns'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const selectedDay = startOfWeek(value, { weekStartsOn: 1 })
  const selectedYear = getYear(selectedDay)
  const selectedWeek = getWeek(selectedDay, { weekStartsOn: 1, firstWeekContainsDate: 7 })

  const startOfSelectedYear = startOfYear(selectedDay)
  const endOfSelectedYear = endOfYear(selectedDay)

  const weeksOfSelectedYear = eachWeekOfInterval(
    { start: startOfSelectedYear, end: endOfSelectedYear },
    { weekStartsOn: 1 },
  ).filter((startOfWeekDate) => isSameYear(startOfWeekDate, selectedDay))

  const thisYear = getYear(new Date())
  const years = [thisYear, thisYear - 1, thisYear - 2]

  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newWeek = Number.parseInt(event.target.value)
    const newDay = setWeek(selectedDay, newWeek, { weekStartsOn: 1, firstWeekContainsDate: 7 })
    onChange(newDay)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number.parseInt(event.target.value)
    const newDay = setYear(selectedDay, newYear)
    onChange(newDay)
  }

  return (
    <div>
      <select
        className="dark:bg-slate-800 dark:text-white"
        aria-label="week"
        onChange={handleWeekChange}
        value={selectedWeek}
      >
        {weeksOfSelectedYear.map((startOfWeekDate) => {
          const weekNumber = getWeek(startOfWeekDate, { firstWeekContainsDate: 7 })
          const monday = startOfWeekDate
          const sunday = endOfWeek(startOfWeekDate, { weekStartsOn: 1 })
          const isCurrentWeek = isThisWeek(startOfWeekDate, { weekStartsOn: 1 })

          return (
            <option value={weekNumber} key={weekNumber}>
              Week {weekNumber} ({format(monday, 'yyyy-MM-dd')} - {format(sunday, 'yyyy-MM-dd')}) {isCurrentWeek && '*'}
            </option>
          )
        })}
      </select>

      <select
        className="dark:bg-slate-800 dark:text-white"
        aria-label="year"
        onChange={handleYearChange}
        value={selectedYear}
      >
        {years.map((year) => (
          <option value={year} key={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}
