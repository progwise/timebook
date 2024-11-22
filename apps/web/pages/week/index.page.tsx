import { endOfWeek, format, isThisWeek, parseISO, startOfWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { ProtectedPage } from '../../frontend/components/protectedPage'
import { WeekGrid } from '../../frontend/components/weekGrid/weekGrid'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { graphql } from '../../frontend/generated/gql'

const weekGridQueryDocument = graphql(`
  query weekGrid($from: Date!, $to: Date, $forUserId: ID) {
    projects(from: $from, to: $to, forUserId: $forUserId, includeProjectsWhereUserBookedWorkHours: true) {
      ...WeekGridProject
    }
  }
`)

const WeekPage = () => {
  const router = useRouter()
  const dayString = router.query.day?.toString()
  const day = dayString ? parseISO(dayString) : new Date()
  const startDate = startOfWeek(day, { weekStartsOn: 1 })
  const endDate = endOfWeek(day, { weekStartsOn: 1 })

  const weekGridContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const forUserId = router.query.userId?.toString()
  const [{ data: weekGridData, fetching }] = useQuery({
    query: weekGridQueryDocument,
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd'), forUserId },
    context: weekGridContext,
  })

  const isDataOutdated = !!weekGridData && fetching

  const handleWeekChange = (newDate: Date) => {
    const path = `/week${isThisWeek(newDate) ? '' : `/${format(newDate, 'yyyy-MM-dd')}`}${forUserId ? `?userId=${forUserId}` : ''}`
    router.push(path)
  }

  return (
    <ProtectedPage>
      <div className="flex justify-center">
        <WeekSelector value={day} onChange={handleWeekChange} />
      </div>
      {!weekGridData && fetching && <div className="loading loading-spinner" />}
      {weekGridData?.projects && (
        <WeekGrid
          tableData={weekGridData.projects}
          startDate={startDate}
          endDate={endDate}
          isDataOutdated={isDataOutdated}
        />
      )}
    </ProtectedPage>
  )
}

export default WeekPage
