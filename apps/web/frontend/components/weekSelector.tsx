import React, { useState } from 'react'

const arrayOfYears = () => {
  const max = new Date().getFullYear()
  const min = max - 2
  const years = []

  for (let year = max; year >= min; year--) {
    years.push(year)
  }
  return years
}

export const WeekSelector = (props: { onChange: (year: number, week: number) => void }): JSX.Element => {
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear())
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.floor(((now.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7)
    return weekNumber
  })

  const weekNumbers = [...Array.from({ length: 54 })].map((_, index) => 1 + index)

  const years = arrayOfYears()

  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newWeek = Number.parseInt(event.target.value)
    setSelectedWeek(newWeek)
    props.onChange(selectedYear, newWeek)
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number.parseInt(event.target.value)
    setSelectedYear(newYear)
    props.onChange(newYear, selectedWeek)
  }

  return (
    <label className="mt-6 flex flex-row space-x-4">
      <span className="space-x-10">
        {selectedWeek}/{selectedYear}
      </span>
      <div>
        <select onChange={handleWeekChange}>
          {weekNumbers.map((w: number) => {
            return (
              <option selected={w === selectedWeek} value={w} key={w}>
                Week {w}
              </option>
            )
          })}
        </select>

        <select onChange={handleYearChange}>
          {years.map((y) => {
            return (
              <option selected={y === selectedYear} value={y} key={y}>
                {y}
              </option>
            )
          })}
        </select>
      </div>
    </label>
  )
}
