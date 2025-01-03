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
  query weekGrid($from: Date!, $to: Date, $projectMemberUserId: ID) {
    projects(
      from: $from
      to: $to
      projectMemberUserId: $projectMemberUserId
      includeProjectsWhereUserBookedWorkHours: true
    ) {
      ...WeekGridProject
      members {
        id
        name
        image
      }
      tasks {
        ...WeekGridTaskRowGroup
      }
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

  const projectMembers =
    weekGridData?.projects?.flatMap((project) =>
      project.members.map((member) => ({
        ...member,
        name: member.name ?? 'Unknown',
        image: member.image ?? undefined,
      })),
    ) ?? []

  return (
    <ProtectedPage>
      <div className="mb-4 flex items-end justify-between">
        {myProjectsMembersData.length > 0 && (
          <Listbox
            value={myProjectsMembersData.find((user) => user.id === selectedUserId) ?? myProjectsMembersData[0]}
            getLabel={(user) => <UserLabel name={user.name ?? user.id} image={user.image ?? undefined} />}
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
          projectMembers={projectMembers}
        />
      )}
    </ProtectedPage>
  )
}

export default WeekPage
