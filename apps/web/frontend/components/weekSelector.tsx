import { endOfWeek, format, getWeek, getYear, isThisWeek, startOfWeek, nextMonday, previousMonday } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { useState } from 'react'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { BsCalendarCheck } from 'react-icons/bs'

import { CalendarSelector } from './calendarSelector'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const [selectedWeek, setSelectedWeek] = useState({
    startDate: startOfWeek(value, { locale: enGB }),
    endDate: endOfWeek(value, { locale: enGB }),
    year: getYear(value),
    key: 'selection',
  })
  const selectedCalendarWeek = getWeek(selectedWeek.startDate, { locale: enGB })
  const isCurrentWeek = isThisWeek(selectedWeek.startDate, { weekStartsOn: 1 })

  const getDaysOfWeek = (date: Date) => {
    const monday = startOfWeek(date, { locale: enGB })
    const sunday = endOfWeek(date, { locale: enGB })
    const year = getYear(date)
    setSelectedWeek({ startDate: monday, endDate: sunday, year, key: 'selection' })
    onChange(monday)
  }

  const handleWeekSelect = (newDate: Date) => {
    getDaysOfWeek(newDate ?? value)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-5">
        <BiLeftArrow
          className="h-12 w-12 cursor-pointer fill-cyan-400 drop-shadow-lg hover:fill-cyan-600"
          onClick={() => getDaysOfWeek(previousMonday(selectedWeek.startDate))}
        />
        <div className="flex w-40 flex-col items-center">
          <span className="font-bold">
            Week {selectedCalendarWeek}/{selectedWeek.year}
          </span>
          <span className="font-medium">
            {format(selectedWeek.startDate, 'dd.MM')} - {format(selectedWeek.endDate, 'dd.MM.yyyy')}
            {isCurrentWeek && '*'}
          </span>
        </div>
        <BiRightArrow
          className="h-12 w-12 cursor-pointer fill-cyan-400 drop-shadow-lg hover:fill-cyan-600 "
          onClick={() => getDaysOfWeek(nextMonday(selectedWeek.startDate))}
        />
      </div>
      <div className="flex gap-5 text-sm text-gray-400">
        <div className="flex cursor-pointer items-center gap-1" onClick={() => getDaysOfWeek(new Date())}>
          <BsCalendarCheck className="h-4 w-4" />
          today
        </div>
        <div className="flex cursor-pointer items-center gap-1">
          <CalendarSelector hideLabel onSelectedDateChange={handleWeekSelect} />
          select
        </div>
      </div>
    </div>
  )
}
