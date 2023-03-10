import { format, isToday } from 'date-fns'

import { TableCell } from '@progwise/timebook-ui'

import { useWorkHourUpdateMutation } from '../../generated/graphql'
import { HourInput } from '../hourInput'
import { classNameMarkDay } from './classNameMarkDay'

interface WeekTableTaskDayCellProps {
  duration: number
  taskId: string
  day: Date
}

export const WeekTableTaskDayCell = ({ duration, taskId, day }: WeekTableTaskDayCellProps) => {
  const [, workHourUpdate] = useWorkHourUpdateMutation()

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
      />
    </TableCell>
  )
}
