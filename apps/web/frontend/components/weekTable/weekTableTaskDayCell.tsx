import { format, getMonth, getYear, isToday } from 'date-fns'
import { useSession } from 'next-auth/react'

import { TableCell } from '@progwise/timebook-ui'

import { useIsLockedQuery, useWorkHourUpdateMutation } from '../../generated/graphql'
import { HourInput } from '../hourInput'
import { classNameMarkDay } from './classNameMarkDay'

interface WeekTableTaskDayCellProps {
  duration: number
  taskId: string
  projectId: string
  day: Date
}

export const WeekTableTaskDayCell = ({ duration, taskId, day, projectId }: WeekTableTaskDayCellProps) => {
  const [, workHourUpdate] = useWorkHourUpdateMutation()
  const session = useSession()
  const userId = session.data?.user.id

  const year = getYear(day)
  const month = getMonth(day)

  const [{ data }] = useIsLockedQuery({ variables: { year, month, userId: userId ?? '', projectId }, pause: !userId })
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
        disabled={isLockedByReport}
      />
    </TableCell>
  )
}
