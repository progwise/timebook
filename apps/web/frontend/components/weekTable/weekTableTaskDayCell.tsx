import { format, getMonth, getYear, isToday } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from 'urql'

import { TableCell } from '@progwise/timebook-ui'

import { graphql } from '../../generated/gql'
import { HourInput } from '../hourInput'
import { classNameMarkDay } from './classNameMarkDay'

const WorkHourUpdateMutationDocument = graphql(`
  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId) {
      id
    }
  }
`)

const IsLockedQueryDocument = graphql(`
  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!) {
    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
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
    variables: { year, month, userId: userId ?? '', projectId },
    pause: !userId,
  })
  const isLockedByReport = data?.report.isLocked ?? false

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
        workHours={duration / 60}
        disabled={isLockedByReport || disabled}
      />
    </TableCell>
  )
}
