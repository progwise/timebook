import { endOfWeek, format, getWeek, getYear, isThisWeek, startOfWeek, nextMonday, previousMonday } from 'date-fns'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { BsCalendarCheck } from 'react-icons/bs'

import { CalendarSelector } from './calendarSelector'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const weekStartDate = startOfWeek(value)
  const selectedCalendarWeek = getWeek(weekStartDate)
  const isCurrentWeek = isThisWeek(weekStartDate)

  const handleWeekSelect = (newDate: Date) => {
    const monday = startOfWeek(newDate)
    onChange(monday)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-5">
        <BiLeftArrow
          aria-label="Previous week"
          className="h-12 w-12 cursor-pointer fill-blue-400 drop-shadow-lg hover:fill-blue-600"
          onClick={() => handleWeekSelect(previousMonday(weekStartDate))}
        />
        <div className="flex w-40 flex-col items-center">
          <span className="font-bold">
            Week {selectedCalendarWeek}/{getYear(weekStartDate)}
          </span>
          <span className="font-medium">
            {format(weekStartDate, 'dd.MM')} - {format(endOfWeek(weekStartDate), 'dd.MM.yyyy')}
            {isCurrentWeek && '*'}
          </span>
        </div>
        <BiRightArrow
          aria-label="Next week"
          className="h-12 w-12 cursor-pointer fill-blue-400 drop-shadow-lg hover:fill-blue-600 "
          onClick={() => handleWeekSelect(nextMonday(weekStartDate))}
        />
      </div>
      <div className="flex gap-5 text-sm text-gray-400">
        <div className="flex cursor-pointer items-center gap-1" onClick={() => handleWeekSelect(new Date())}>
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
