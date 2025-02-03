import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { isSessionUserAdminOfProject, getSessionUser } from '../projectUtils'
import { WeekGridTaskRowAllUsers } from './weekGridTaskRowAllUsers'
import { WeekGridTaskRowSingleUser } from './weekGridTaskRowSingleUser'

const WeekGridTaskRowFragment = graphql(`
  fragment WeekGridTaskRow on Task {
    ...WeekGridTaskRowSingleUser
    ...WeekGridTaskRowAllUsers
    project {
      canModify
      members {
        id
      }
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
  const sessionUser = getSessionUser()

  const isSessionUserAdmin = sessionUser && isSessionUserAdminOfProject(task.project, sessionUser.id ?? '')

  const filteredUserIds = isSessionUserAdmin ? userIds : userIds.filter((userId) => userId === sessionUser.id)

  return userIds.length === 1 ? (
    <WeekGridTaskRowSingleUser task={task} isDataOutdated={isDataOutdated} userIds={userIds} />
  ) : // eslint-disable-next-line unicorn/no-nested-ternary
  filteredUserIds.length > 0 ? (
    <WeekGridTaskRowAllUsers task={task} isDataOutdated={isDataOutdated} userIds={filteredUserIds} />
  ) : undefined
}
