import React, { ReactChild, ReactChildren, useEffect, useState } from 'react'
import { getFormattedWorkHours, HourInput } from '../frontend/components/hourInput'
import { CalendarSelector } from '../frontend/components/calendarSelector'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { ProjectFragment, useProjectsQuery } from '../frontend/generated/graphql'
import { BookWorkHourModal } from '../frontend/components/bookWorkHourModal'
import { Button } from '../frontend/components/button/button'
import { BiPlus } from 'react-icons/bi'

export interface IProjectTimeEntry {
  project: ProjectFragment
  times: Array<{ date: Date; workHours: number }>
}

const getDateForWeekday = (baseDate: Date, weekdayNumber: number) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + weekdayNumber - baseDate.getDay())

const Time = (): JSX.Element => {
  const ColumnHeader = (props: { children: ReactChildren | ReactChild; className?: string }) => {
    return <th className={`text-center ${props.className}`}>{props.children}</th>
  }

  const [selectedDate, setSelectedDate] = useState(new Date())

  const [timeData, setTimeData] = useState([] as Array<IProjectTimeEntry>)

  const [{ data }] = useProjectsQuery()

  const [isBookWorkHourModalOpen, setIsBookWorkHourModalOpen] = useState(false)

  const getNewDayEntry = (weekday: number) => ({
    date: getDateForWeekday(selectedDate, weekday),
    workHours: 0,
  })

  const datesOfTheWeek = [1, 2, 3, 4, 5, 6, 7].map((weekday) => getDateForWeekday(selectedDate, weekday))

  useEffect(() => {
    const newData =
      data?.projects.map((p) => ({
        project: p,
        times: [1, 2, 3, 4, 5, 6, 7].map((weekday) => getNewDayEntry(weekday)),
      })) ?? []
    setTimeData(newData)
  }, [data?.projects, selectedDate])

  const getTitleForWeekday = (date: Date) => {
    switch (date.getDay()) {
      case 1:
        return 'M'
      case 2:
        return 'T'
      case 3:
        return 'W'
      case 4:
        return 'Th'
      case 5:
        return 'F'
      case 6:
        return 'S'
      case 0:
        return 'Su'
    }
    return '?'
  }

  const handleSelectedDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
  }
  const getWeekdayDurationSum = (weekday: number): number => {
    let result = 0
    for (const projectData of timeData) {
      const timesForWeekday = projectData.times
        .filter((t) => t.date.getDay() === weekday)
        .map((entry) => entry.workHours)
      if (timesForWeekday.length > 0) {
        result = result + timesForWeekday.reduce((a, b) => a + b)
      }
    }
    return result
  }

  const setWorkHours = (project: ProjectFragment, date: Date, workHours: number) => {
    const projectEntry = timeData.find((entry) => entry.project.id === project.id)
    if (!projectEntry) {
      throw new Error(`project entry not found for ${project.id}`)
    }
    const dateEntry = projectEntry.times.find((t) => t.date.toLocaleDateString() === date.toLocaleDateString())
    if (!dateEntry) {
      projectEntry.times.push({ date, workHours })
    } else {
      dateEntry.workHours = workHours
    }
    setTimeData(timeData.map((x) => x))
  }

  return (
    <ProtectedPage>
      <div className="flex flex-col items-end">
        <Button variant="primary" onClick={() => setIsBookWorkHourModalOpen(true)}>
          <BiPlus className="flex items-end text-3xl" />
        </Button>
      </div>
      <article>
        <h2>Your timetable</h2>
        <div>
          <CalendarSelector onSelectedDateChange={handleSelectedDateChange} />
        </div>
        <table id="timeTable" className="w-full table-auto">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th colSpan={3} className="text-left">
                {getDateForWeekday(selectedDate, 1).toLocaleDateString()}
              </th>
              <th />
              <th colSpan={3} className="text-right">
                {getDateForWeekday(selectedDate, 7).toLocaleDateString()}
              </th>
            </tr>
            <tr>
              <ColumnHeader>&nbsp;</ColumnHeader>
              {datesOfTheWeek.map((day, index) =>
                day.toLocaleDateString() === new Date().toLocaleDateString() ? (
                  <ColumnHeader key={index} className="text-green-600">
                    {getTitleForWeekday(day)}
                  </ColumnHeader>
                ) : (
                  <ColumnHeader key={index}>{getTitleForWeekday(day)}</ColumnHeader>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {timeData.map((timeEntry) => (
              <tr key={timeEntry.project.id}>
                <td>{timeEntry.project.title}</td>
                {timeEntry.times.map(({ date, workHours }, index) => (
                  <td className="pl-2 pr-2 min-w-min" key={index}>
                    <HourInput
                      onChange={(newWorkHours) => setWorkHours(timeEntry.project, date, newWorkHours)}
                      workHours={workHours}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              {Array.from({ length: 7 }).map((_, index) => (
                <td className="text-center" key={index}>
                  {getFormattedWorkHours(getWeekdayDurationSum((index + 1) % 7))}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </article>
      <BookWorkHourModal
        selectedDate={selectedDate}
        open={isBookWorkHourModalOpen}
        onClose={() => setIsBookWorkHourModalOpen(false)}
      />
    </ProtectedPage>
  )
}

export default Time
