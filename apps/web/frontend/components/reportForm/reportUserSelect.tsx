import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'urql'

import { ListboxWithUnselect } from '@progwise/timebook-ui'

import { graphql, useFragment } from '../../generated/gql'
import { UserLabel } from './userLabel'

const ReportUserFragment = graphql(`
  fragment ReportUser on User {
    id
    name
    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)
  }
`)

const ReportUsersQueryDocument = graphql(`
  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {
    project(projectId: $projectId) {
      id
      members(includePastMembers: true) {
        ...ReportUser
      }
    }
  }
`)

interface ReportUserSelectProps {
  projectId: string
  selectedUserId?: string
  onUserChange: (userId: string | undefined) => void
  from: Date
  to: Date
}

export const ReportUserSelect = ({ projectId, selectedUserId, onUserChange, from, to }: ReportUserSelectProps) => {
  const context = useMemo(() => ({ additionalTypenames: ['User'] }), [])
  const [{ data, fetching }] = useQuery({
    query: ReportUsersQueryDocument,
    variables: { projectId, from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') },
    context,
  })

  const allUsers = useFragment(ReportUserFragment, data?.project.members) ?? []
  const allDurations = allUsers.reduce((previous, current) => previous + current.durationWorkedOnProject, 0)
  const selectedUser = allUsers.find((user) => user.id === selectedUserId)

  // After receiving new data, check that the selected user is still in the user list
  useEffect(() => {
    if (fetching) {
      return
    }
    const isSelectedUserInList = allUsers.some((user) => user.id === selectedUserId)

    if (!isSelectedUserInList) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      onUserChange(undefined)
    }
  }, [data, fetching])

  if (!data) {
    // eslint-disable-next-line unicorn/no-null
    return null
  }

  return (
    <ListboxWithUnselect
      getKey={(user) => user?.id}
      value={selectedUser}
      getLabel={(user) => <UserLabel name={user.name ?? user.id} duration={user.durationWorkedOnProject} />}
      noOptionLabel={<UserLabel name="All Users" duration={allDurations} />}
      onChange={(user) => onUserChange(user?.id)}
      options={allUsers}
    />
  )
}
