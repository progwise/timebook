import { endOfWeek, format, isThisWeek, parseISO, startOfWeek } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { Listbox } from '@progwise/timebook-ui'

import { ProtectedPage } from '../../frontend/components/protectedPage'
import { useProjectMembers } from '../../frontend/components/useProjectMembers'
import { UserLabel } from '../../frontend/components/userLabel'
import { WeekGrid } from '../../frontend/components/weekGrid/weekGrid'
import { WeekSelector } from '../../frontend/components/weekSelector'
import { graphql } from '../../frontend/generated/gql'

const weekGridQueryDocument = graphql(`
  query Projects($from: Date!, $to: Date, $projectMemberUserId: ID, $userIds: [ID!]) {
    projects(
      from: $from
      to: $to
      projectMemberUserId: $projectMemberUserId
      userIds: $userIds
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
  const currentUserId = selectedUserId ?? 'all'

  const weekGridContext = useMemo(() => ({ additionalTypenames: ['Project', 'Task', 'WorkHour'] }), [])
  const projectMemberUserId = currentUserId === 'all' ? undefined : currentUserId
  const userIds =
    selectedUserId === 'all'
      ? myProjectsMembersData.map((user) => user.id)
      : // eslint-disable-next-line unicorn/no-nested-ternary
        selectedUserId
        ? [selectedUserId]
        : []
  const [{ data: weekGridData, fetching }] = useQuery({
    query: weekGridQueryDocument,
    variables: {
      from: format(startDate, 'yyyy-MM-dd'),
      to: format(endDate, 'yyyy-MM-dd'),
      //This variable queries projects with tasks that the member has booked hours.
      projectMemberUserId,
      //This variable queries the workHours field for the given user in the cells.
      userIds,
    },
    context: weekGridContext,
  })

  const isDataOutdated = !!weekGridData && fetching

  const handleWeekChange = (newDate: Date) => {
    const path = `/week${isThisWeek(newDate) ? '' : `/${format(newDate, 'yyyy-MM-dd')}`}${
      // eslint-disable-next-line unicorn/no-nested-ternary
      projectMemberUserId ? `?userId=${projectMemberUserId}` : currentUserId === 'all' ? '?userId=all' : ''
    }`
    router.push(path)
  }

  return (
    <ProtectedPage>
      <div className="mb-4 flex items-end justify-between">
        {myProjectsMembersData.length > 0 && (
          <Listbox
            value={myProjectsMembersData.find((user) => user.id === selectedUserId) ?? { id: 'all', name: 'All Users' }}
            getLabel={(user) => <UserLabel name={user.name ?? user.id} image={user.image ?? undefined} />}
            getKey={(user) => user.id}
            onChange={(user) => handleUserChange(user.id)}
            options={[{ id: 'all', name: 'All Users' }, ...myProjectsMembersData]}
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
          currentUserId={currentUserId}
          showAllUsers={currentUserId === 'all'}
        />
      )}
    </ProtectedPage>
  )
}

export default WeekPage
