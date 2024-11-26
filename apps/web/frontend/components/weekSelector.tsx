import { endOfWeek, isThisWeek, nextMonday, previousMonday, startOfWeek } from 'date-fns'
import Image from 'next/image'
import { FaCalendarCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

import { Listbox } from '@progwise/timebook-ui'

import { CalendarSelector } from './calendarSelector'
import { useProjectMembers } from './useProjectMembers'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const weekStartDate = startOfWeek(value)
  const isCurrentWeek = isThisWeek(weekStartDate)
  const { selectedUserId, handleUserChange, myProjectsMembersData } = useProjectMembers()

  const handleWeekSelect = (newDate: Date) => {
    const newWeekStartDate = startOfWeek(newDate)
    onChange(newWeekStartDate)
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="inline-flex flex-col items-center gap-2 p-4">
      <h2 className="text-lg font-bold">
        {dateTimeFormat.formatRange(weekStartDate, endOfWeek(weekStartDate))}
        {isCurrentWeek && '*'}
      </h2>
      <div className="flex gap-2 text-sm">
        <button
          className="btn btn-outline btn-neutral btn-sm"
          aria-label="Previous week"
          onClick={() => handleWeekSelect(previousMonday(weekStartDate))}
        >
          <FaChevronLeft />
        </button>
        <button className="btn btn-sm" onClick={() => handleWeekSelect(new Date())}>
          <FaCalendarCheck />
          Today
        </button>
        <CalendarSelector hideLabel onDateChange={handleWeekSelect} selectLabel />
        <button
          className="btn btn-outline btn-neutral btn-sm"
          aria-label="Next week"
          onClick={() => handleWeekSelect(nextMonday(weekStartDate))}
        >
          <FaChevronRight />
        </button>
      </div>
      {myProjectsMembersData.length > 0 && (
        <Listbox
          value={myProjectsMembersData.find((user) => user.id === selectedUserId) ?? myProjectsMembersData[0]}
          getLabel={(user) => (
            <div className="flex items-center gap-2">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? 'User avatar'}
                  width={26}
                  height={26}
                  className="rounded-full"
                />
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-neutral text-neutral-content">
                  <span className="text-xl">{user?.name?.charAt(0)}</span>
                </div>
              )}
              <span>{user?.name}</span>
            </div>
          )}
          getKey={(user) => user.id}
          onChange={(user) => handleUserChange(user.id)}
          options={myProjectsMembersData}
        />
      )}
    </div>
  )
}
