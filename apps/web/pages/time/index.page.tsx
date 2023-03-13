import { format, startOfWeek, endOfWeek, isThisWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { ProtectedPage } from '../../frontend/components/protectedPage'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { WeekTable } from '../../frontend/components/weekTable/weekTable'
import { graphql } from '../../frontend/generated/gql'

const timeTableQueryDocument = graphql(`
  query timeTable($from: Date!, $to: Date) {
    projects(from: $from, to: $to) {
      ...WeekTableProject
    }
  }
`)

export interface TimePageProps {
  day?: Date
}

const TimePage = (props: TimePageProps) => {
  const router = useRouter()
  const day = props.day ?? new Date()
  const startDate = startOfWeek(day, { weekStartsOn: 1 })
  const endDate = endOfWeek(day, { weekStartsOn: 1 })

  const timeTableContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const [{ data: timeTableData }] = useQuery({
    query: timeTableQueryDocument,
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') },
    context: timeTableContext,
  })

  const handleWeekChange = (newDate: Date) => {
    router.push(isThisWeek(newDate) ? '/time' : `/time/${format(newDate, 'yyyy-MM-dd')}`)
  }

  return (
    <ProtectedPage>
      <h2>Time entries</h2>
      <WeekSelector value={day} onChange={handleWeekChange} />
      {timeTableData?.projects && (
        <WeekTable tableData={timeTableData.projects} startDate={startDate} endDate={endDate} />
      )}
    </ProtectedPage>
  )
}

export default TimePage
