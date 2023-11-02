import { endOfWeek, isThisWeek, startOfWeek, nextMonday, previousMonday } from 'date-fns'
import { BiCalendarCheck, BiSolidChevronLeft, BiSolidChevronRight } from 'react-icons/bi'

import { CalendarSelector } from './calendarSelector'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const weekStartDate = startOfWeek(value)
  const isCurrentWeek = isThisWeek(weekStartDate)

  const handleWeekSelect = (newDate: Date) => {
    const monday = startOfWeek(newDate)
    onChange(monday)
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="rounded-box inline-flex flex-col items-center border border-base-content bg-base-200 p-4 text-base-content">
      <div className="pb-2 text-lg font-bold">
        {dateTimeFormat.formatRange(weekStartDate, endOfWeek(weekStartDate))}
        {isCurrentWeek && '*'}
      </div>
      <div className="flex gap-2 text-sm">
        <button
          className="btn btn-neutral btn-outline btn-sm"
          aria-label="Previous week"
          onClick={() => handleWeekSelect(previousMonday(weekStartDate))}
        >
          <BiSolidChevronLeft className="" />
        </button>

        <button className="btn btn-sm" onClick={() => handleWeekSelect(new Date())}>
          <BiCalendarCheck className="" />
          today
        </button>

        <CalendarSelector hideLabel onDateChange={handleWeekSelect} selectLabel />
        <button
          className="btn btn-neutral btn-outline btn-sm"
          aria-label="Next week"
          onClick={() => handleWeekSelect(nextMonday(weekStartDate))}
        >
          <BiSolidChevronRight className="" />
        </button>
      </div>
    </div>
  )
}
