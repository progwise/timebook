import { getWeek, getYear, parse, addDays, format } from 'date-fns'
import { useMemo, useState } from 'react'

import { ProtectedPage } from '../../frontend/components/protectedPage'
import { WeekTable } from '../../frontend/components/weekTable/weekTable'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { useTimeTableQuery } from '../../frontend/generated/graphql'

const today = new Date()
const NUMBER_OF_DAYS = 7

const TimePage = () => {
  const [week, setWeek] = useState({ year: getYear(today), week: getWeek(today) })
  const startDate = parse(week.week.toString(), 'I', new Date(week.year, 1, 1))
  const endDate = addDays(startDate, NUMBER_OF_DAYS - 1)

  const timeTableContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const [{ data: timeTableData }] = useTimeTableQuery({
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') },
    context: timeTableContext,
  })

  const handleWeekChange = (year: number, week: number) => {
    setWeek({ year, week })
  }

  return (
    <ProtectedPage>
      <h2>Time entries</h2>
      <WeekSelector onChange={handleWeekChange} />
      {timeTableData?.projects && (
        <WeekTable tableData={timeTableData.projects} startDate={startDate} endDate={endDate} />
      )}
    </ProtectedPage>
  )
}

export default TimePage
