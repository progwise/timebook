import { format, startOfWeek, endOfWeek, isThisWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { PageHeading } from '../../frontend/components/PageHeading'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { WeekTable } from '../../frontend/components/weekTable/weekTable'
import { graphql } from '../../frontend/generated/gql'

const weekTableQueryDocument = graphql(`
  query weekTable($from: Date!, $to: Date) {
    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {
      ...WeekTableProject
    }
  }
`)

export interface WeekPageProps {
  day?: Date
}

const WeekPage = (props: WeekPageProps) => {
  const router = useRouter()
  const day = props.day ?? new Date()
  const startDate = startOfWeek(day, { weekStartsOn: 1 })
  const endDate = endOfWeek(day, { weekStartsOn: 1 })

  const weekTableContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const [{ data: weekTableData }] = useQuery({
    query: weekTableQueryDocument,
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') },
    context: weekTableContext,
  })

  const handleWeekChange = (newDate: Date) => {
    router.push(isThisWeek(newDate) ? '/week' : `/week/${format(newDate, 'yyyy-MM-dd')}`)
  }

  return (
    <ProtectedPage>
      <PageHeading>Week enteries</PageHeading>
      <WeekSelector value={day} onChange={handleWeekChange} />
      {weekTableData?.projects && (
        <WeekTable tableData={weekTableData.projects} startDate={startDate} endDate={endDate} />
      )}
    </ProtectedPage>
  )
}

export default WeekPage
