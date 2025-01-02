import { format } from 'date-fns'
// import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { graphql } from '../../generated/gql'
import { HourInput } from '../hourInput/hourInput'

const WorkHourUpdateMutationDocument = graphql(`
  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!, $projectMemberUserId: ID) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId, projectMemberUserId: $projectMemberUserId) {
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
  projectMemberUserId?: string
}

export const WeekGridTaskDayCell = ({
  duration,
  taskId,
  day,
  disabled,
  isDataOutdated = false,
  projectMemberUserId,
}: WeekGridTaskDayCellProps) => {
  const [, workHourUpdate] = useMutation(WorkHourUpdateMutationDocument)
  // const router = useRouter()

  return (
    <div key={day.toDateString()} className="z-20 justify-self-center px-4" role="cell">
      <div className="relative py-1">
        {isDataOutdated ? (
          <div className="skeleton h-8 w-16" />
        ) : (
          <HourInput
            onBlur={(newDuration: number) => {
              workHourUpdate({
                data: {
                  date: format(day, 'yyyy-MM-dd'),
                  duration: newDuration,
                  taskId,
                },
                date: format(day, 'yyyy-MM-dd'),
                taskId,
                projectMemberUserId,
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
