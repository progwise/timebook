import { format } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'urql'

import { graphql, useFragment } from '../../generated/gql'
import { ReportUserFragment as ReportUserFragmentType } from '../../generated/gql/graphql'
import { ComboBox } from '../combobox/combobox'

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

const formatDuration = (durationInMinutes: number) => {
  const hours = Math.floor(durationInMinutes / 60).toString()
  const minutes = (durationInMinutes % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const ReportUserSelect = ({ projectId, selectedUserId, onUserChange, from, to }: ReportUserSelectProps) => {
  const context = useMemo(() => ({ __additionalTypnames: ['User'] }), [])
  const [{ data }] = useQuery({
    query: ReportUsersQueryDocument,
    variables: { projectId, from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') },
    context,
  })

  const allUsers = useFragment(ReportUserFragment, data?.project.members) ?? []
  const allDurations = allUsers.reduce((previous, current) => previous + current.durationWorkedOnProject, 0)
  const selectedUser = allUsers.find((user) => user.id === selectedUserId)

  // After receiving new data, check that the selected user is still in the user list
  useEffect(() => {
    const isSelectedUserInList = allUsers.some((user) => user.id === selectedUserId)

    if (!isSelectedUserInList) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      onUserChange(undefined)
    }
  }, [data])

  if (!data) {
    // eslint-disable-next-line unicorn/no-null
    return null
  }

  return (
    <ComboBox<ReportUserFragmentType>
      key={JSON.stringify(data)}
      value={selectedUser}
      displayValue={(user) => `${user.name ?? user.id} (${formatDuration(user.durationWorkedOnProject)})`}
      noOptionLabel={`All Users (${formatDuration(allDurations)})`}
      onChange={(newUserId) => onUserChange(newUserId ?? undefined)}
      options={allUsers}
      label="user"
    />
  )
}
