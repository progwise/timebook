import { endOfWeek, format, isThisWeek, parseISO, startOfWeek } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { Listbox } from '@progwise/timebook-ui'

import { ProtectedPage } from '../../frontend/components/protectedPage'
import { useProjectMembers } from '../../frontend/components/useProjectMembers'
import { WeekGrid } from '../../frontend/components/weekGrid/weekGrid'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { graphql } from '../../frontend/generated/gql'

const weekGridQueryDocument = graphql(`
  query weekGrid($from: Date!, $to: Date, $projectMemberUserId: ID) {
    projects(
      from: $from
      to: $to
      projectMemberUserId: $projectMemberUserId
      includeProjectsWhereUserBookedWorkHours: true
    ) {
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
  const { selectedUserId, handleUserChange, myProjectsMembersData } = useProjectMembers()

  const weekGridContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const projectMemberUserId = router.query.userId?.toString()
  const [{ data: weekGridData, fetching }] = useQuery({
    query: weekGridQueryDocument,
    variables: { from: format(startDate, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd'), projectMemberUserId },
    context: weekGridContext,
  })

  const isDataOutdated = !!weekGridData && fetching

  const handleWeekChange = (newDate: Date) => {
    const path = `/week${isThisWeek(newDate) ? '' : `/${format(newDate, 'yyyy-MM-dd')}`}${projectMemberUserId ? `?userId=${projectMemberUserId}` : ''}`
    router.push(path)
  }

  return (
    <ProtectedPage>
      <div className="mb-4 flex items-end justify-between">
        {myProjectsMembersData.length > 0 && (
          <Listbox
            value={myProjectsMembersData.find((user) => user.id === selectedUserId) ?? myProjectsMembersData[0]}
            getLabel={(user) => (
              <div className="flex items-center gap-2">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? 'User avatar'}
                    width={24}
                    height={24}
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
        <div className="flex grow justify-center">
          <WeekSelector value={day} onChange={handleWeekChange} />
        </div>
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
