import { getWeek, getYear, startOfWeek, endOfWeek, parse, addDays } from 'date-fns'
import { useState } from 'react'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { WeekPageTable, WorkHoursTableRow } from '../frontend/components/weekPageTable'
import { WeekSelector } from '../frontend/components/weekSelector'
import { useMyProjectsQuery } from '../frontend/generated/graphql'

const today = new Date()
const NUMBER_OF_DAYS = 7

const TimePage = () => {
  const [week, setWeek] = useState({ year: getYear(today), week: getWeek(today) })
  const [{ data: taskData }, refetch] = useMyProjectsQuery()
  const handleWeekChange = (year: number, week: number) => {
    console.log('handleWeekChange', year, week)
    setWeek({ year, week })
  }

  const startDate = parse(week.week.toString(), 'I', new Date(week.year, 1, 1))

  const tableData: WorkHoursTableRow[] =
    taskData?.projects.flatMap((project) =>
      project.tasks.map((task) => ({
        project,
        task,
        durations: Array.from({ length: NUMBER_OF_DAYS }, () => 20),
      })),
    ) ?? []

  return (
    <ProtectedPage>
      <h2>Time entries</h2>
      <WeekSelector onChange={handleWeekChange} />
      <WeekPageTable tableData={tableData} numberOfDays={NUMBER_OF_DAYS} startDate={startDate} />
      <pre>{JSON.stringify(taskData, undefined, 2)}</pre>
    </ProtectedPage>
  )
}

export default TimePage
