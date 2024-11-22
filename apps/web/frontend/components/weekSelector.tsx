import { endOfWeek, isThisWeek, nextMonday, previousMonday, startOfWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaCalendarCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useQuery } from 'urql'

import { graphql } from '../generated/gql'
import { CalendarSelector } from './calendarSelector'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

const UsersForProjectAdminQueryDocument = graphql(`
  query UsersForProjectAdminQuery {
    usersForProjectAdminQueryField {
      id
      name
      image
    }
  }
`)

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const weekStartDate = startOfWeek(value)
  const isCurrentWeek = isThisWeek(weekStartDate)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const router = useRouter()

  const handleWeekSelect = (newDate: Date) => {
    const monday = startOfWeek(newDate)
    onChange(monday)
  }

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, userId: userId },
    })
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const [{ data, fetching }] = useQuery({
    query: UsersForProjectAdminQueryDocument,
  })

  return (
    <div className="inline-flex flex-col items-center gap-2 p-4">
      <h2 className="text-lg font-bold">
        {dateTimeFormat.formatRange(weekStartDate, endOfWeek(weekStartDate))}
        {isCurrentWeek && '*'}
      </h2>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex">
          <button
            className="btn btn-outline btn-neutral btn-sm"
            aria-label="Previous week"
            onClick={() => handleWeekSelect(previousMonday(weekStartDate))}
          >
            <FaChevronLeft />
          </button>
          <button className="btn btn-sm" onClick={() => handleWeekSelect(new Date())}>
            <FaCalendarCheck />
            today
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
        {data && data.usersForProjectAdminQueryField.length > 0 && (
          <label className="form-control flex w-full max-w-xs">
            <div className="label">
              <span className="label-text">Select User</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedUserId}
              onChange={(event) => handleUserChange(event.target.value)}
              disabled={fetching}
            >
              {data?.usersForProjectAdminQueryField.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  )
}
