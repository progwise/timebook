import { endOfWeek, format, isThisWeek, startOfWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { ProtectedPage } from '../../frontend/components/protectedPage'
import { WeekGrid } from '../../frontend/components/weekGrid/weekGrid'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { graphql } from '../../frontend/generated/gql'

const weekGridQueryDocument = graphql(`
  query weekGrid($from: Date!, $to: Date) {
    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {
      ...WeekGridProject
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

  const weekGridContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const [{ data: weekGridData }] = useQuery({
    query: weekGridQueryDocument,
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') },
    context: weekGridContext,
  })

  const handleWeekChange = (newDate: Date) => {
    router.push(isThisWeek(newDate) ? '/week' : `/week/${format(newDate, 'yyyy-MM-dd')}`)
  }

  return (
    <ProtectedPage>
      <div className="flex justify-center">
        <WeekSelector value={day} onChange={handleWeekChange} />
      </div>
      {weekGridData?.projects && <WeekGrid tableData={weekGridData.projects} startDate={startDate} endDate={endDate} />}
    </ProtectedPage>
  )
}

export default WeekPage
