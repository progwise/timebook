import { useSession } from 'next-auth/react'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { useProjectMembers } from '../useProjectMembers'
import { WeekGridTaskRowAllUsers } from './weekGridTaskRowAllUsers'
import { WeekGridTaskRowSingleUser } from './weekGridTaskRowSingleUser'

const WeekGridTaskRowFragment = graphql(`
  fragment WeekGridTaskRow on Task {
    ...WeekGridTaskRowSingleUser
    ...WeekGridTaskRowAllUsers
    project {
      id
      canModify
    }
  }
`)

interface WeekGridTaskRowProps {
  task: FragmentType<typeof WeekGridTaskRowFragment>
  isDataOutdated?: boolean
  userIds: string[]
}

export const WeekGridTaskRow = ({ task: taskFragment, isDataOutdated = false, userIds }: WeekGridTaskRowProps) => {
  const task = useFragment(WeekGridTaskRowFragment, taskFragment)
  const { myProjectsMembersData } = useProjectMembers()
  const sessionUser = useSession()

  const isSessionUserAdminOfProject =
    task.project.canModify && myProjectsMembersData.some((member) => member.id === sessionUser.data?.user?.id)

  const filteredUserIds = isSessionUserAdminOfProject
    ? userIds
    : userIds.filter((userId) => userId === sessionUser.data?.user?.id)

  return userIds.length === 1 ? (
    <WeekGridTaskRowSingleUser task={task} isDataOutdated={isDataOutdated} userIds={userIds} />
  ) : // eslint-disable-next-line unicorn/no-nested-ternary
  filteredUserIds.length > 0 ? (
    <WeekGridTaskRowAllUsers task={task} isDataOutdated={isDataOutdated} userIds={filteredUserIds} />
  ) : undefined
}
