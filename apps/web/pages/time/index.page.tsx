import { getWeek, getYear, parse, addDays, format } from 'date-fns'
import { useMemo, useState } from 'react'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { WeekPageTable, WorkHoursTableRow } from '../../frontend/components/weekPageTable'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { useMyProjectsQuery, useWorkHoursQuery } from '../../frontend/generated/graphql'

const today = new Date()
const NUMBER_OF_DAYS = 7

const TimePage = () => {
  const [week, setWeek] = useState({ year: getYear(today), week: getWeek(today) })
  const startDate = parse(week.week.toString(), 'I', new Date(week.year, 1, 1))
  const endDate = addDays(startDate, NUMBER_OF_DAYS - 1)
  const taskContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task'] }), [])
  const [{ data: taskData, fetching: taskDataFetching }] = useMyProjectsQuery({
    context: taskContext,
    variables: { from: format(startDate, 'yyyy-MM-dd') },
  })
  const workHourContext = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const [{ data: workHourData, fetching: workHoursFetching }] = useWorkHoursQuery({
    context: workHourContext,
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') },
  })
  const handleWeekChange = (year: number, week: number) => {
    setWeek({ year, week })
  }

  const tableData: WorkHoursTableRow[] =
    taskData?.projects.flatMap((project) =>
      project.tasks.map((task) => ({
        project,
        task,
        durations: Array.from({ length: NUMBER_OF_DAYS }, () => 0).map((_n, index) => {
          const theDate = addDays(startDate, index)
          return (
            workHourData?.workHours
              .filter((workHour) => workHour.task.id === task.id && workHour.date === format(theDate, 'yyyy-MM-dd'))
              .map((workHour) => workHour.duration ?? 0)
              .reduce((previous, current) => previous + current, 0) ?? 0
          )
        }),
      })),
    ) ?? []

  return (
    <ProtectedPage>
      <h2>Time entries</h2>
      <WeekSelector onChange={handleWeekChange} />
      {!workHoursFetching && !taskDataFetching && (
        <WeekPageTable tableData={tableData} numberOfDays={NUMBER_OF_DAYS} startDate={startDate} />
      )}
    </ProtectedPage>
  )
}

export default TimePage
