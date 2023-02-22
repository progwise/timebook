import { add, endOfWeek, format, getISOWeek, getYear, startOfWeek } from 'date-fns'
import React, { useState } from 'react'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

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
  const [selectedDate, setSelectedDate] = useState(new Date())
  const selectedWeek = getISOWeek(selectedDate)
  const selectedYear = getYear(selectedDate)
  const startDate = startOfWeek(selectedDate)
  const endDate = endOfWeek(selectedDate)

  const handleNextWeek = () => {
    setSelectedDate((oldDate) => {
      const newDate = add(oldDate, { weeks: 1 })
      props.onChange(getYear(newDate), getISOWeek(newDate))
      return newDate
    })
  }
  const handlePreviousWeek = () => {
    setSelectedDate((oldDate) => {
      const newDate = add(oldDate, { weeks: -1 })
      props.onChange(getYear(newDate), getISOWeek(newDate))
      return newDate
    })
  }
  return (
    <div className="mt-6 flex flex-row justify-center space-x-4">
      <div className="flex items-center  gap-3">
        <BiLeftArrow onClick={handlePreviousWeek} />
        <div>
          <div className=" font-bold">
            Week {selectedWeek}/{selectedYear}
          </div>
          <div>
            {format(startDate, 'dd.MM.')} - {format(endDate, 'dd.MM.yyyy')}
          </div>
        </div>
        <BiRightArrow className="hover:text-violet-600" onClick={handleNextWeek} />
      </div>
    </div>
  )
}
