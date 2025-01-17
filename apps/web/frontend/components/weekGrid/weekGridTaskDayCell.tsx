import { format } from 'date-fns'
import { useMutation } from 'urql'

import { graphql } from '../../generated/gql'
import { HourInput } from '../hourInput/hourInput'
import { useProjectMembers } from '../useProjectMembers'

const WorkHourUpdateMutationDocument = graphql(`
  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!, $userIds: [ID!]!) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId, userIds: $userIds) {
      id
    }
  }
`)

interface WeekGridTaskDayCellProps {
  duration: number
  taskId: string
  day: Date
  disabled: boolean
  isDataOutdated?: boolean
  currentUserId: string
}

export const WeekGridTaskDayCell = ({
  duration,
  taskId,
  day,
  disabled,
  isDataOutdated = false,
  currentUserId,
}: WeekGridTaskDayCellProps) => {
  const [, workHourUpdate] = useMutation(WorkHourUpdateMutationDocument)
  const { myProjectsMembersData } = useProjectMembers()
  const key = `${taskId}-${day.toDateString()}-${currentUserId}`

  return (
    <div key={key} className="z-20 justify-self-center px-4" role="cell">
      <div className="relative py-1">
        {isDataOutdated ? (
          <div className="skeleton h-8 w-16" />
        ) : (
          <HourInput
            onBlur={(newDuration: number) => {
              const userIds = currentUserId === 'all' ? myProjectsMembersData.map((user) => user.id) : [currentUserId]
              workHourUpdate({
                data: {
                  date: format(day, 'yyyy-MM-dd'),
                  duration: newDuration,
                  taskId,
                },
                date: format(day, 'yyyy-MM-dd'),
                taskId,
                userIds,
              })
            }}
            duration={duration}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  )
}
