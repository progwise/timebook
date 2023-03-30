import { format, getMonth, getYear, isToday } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from 'urql'

import { TableCell } from '@progwise/timebook-ui'

import { graphql } from '../../generated/gql'
import { HourInput } from '../hourInput/hourInput'
import { classNameMarkDay } from './classNameMarkDay'

const WorkHourUpdateMutationDocument = graphql(`
  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId) {
      id
    }
  }
`)

const IsLockedQueryDocument = graphql(`
  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!, $taskId: ID!) {
    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
    }
    task(taskId: $taskId) {
      isLockedByUser
    }
  }
`)

interface WeekTableTaskDayCellProps {
  duration: number
  taskId: string
  projectId: string
  day: Date
  disabled: boolean
}

export const WeekTableTaskDayCell = ({ duration, taskId, day, projectId, disabled }: WeekTableTaskDayCellProps) => {
  const [, workHourUpdate] = useMutation(WorkHourUpdateMutationDocument)
  const session = useSession()
  const userId = session.data?.user.id

  const year = getYear(day)
  const month = getMonth(day)

  const [{ data }] = useQuery({
    query: IsLockedQueryDocument,
    variables: { year, month, userId: userId ?? '', projectId, taskId },
    pause: !userId,
  })
  const isLockedByReport = data?.report.isLocked ?? false
  const isLockedByUser = data?.task.isLockedByUser ?? false
  const isLocked = isLockedByReport || isLockedByUser

  return (
    <TableCell key={day.toDateString()} className={isToday(day) ? classNameMarkDay : ''}>
      <HourInput
        onBlur={(duration: number) => {
          workHourUpdate({
            data: {
              date: format(day, 'yyyy-MM-dd'),
              duration: duration,
              taskId,
            },
            date: format(day, 'yyyy-MM-dd'),
            taskId,
          })
        }}
        duration={duration}
        disabled={isLocked || disabled}
      />
    </TableCell>
  )
}
