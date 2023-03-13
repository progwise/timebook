import { format, isToday } from 'date-fns'
import { useMutation } from 'urql'

import { TableCell } from '@progwise/timebook-ui'

import { graphql } from '../../generated/gql'
import { HourInput } from '../hourInput'
import { classNameMarkDay } from './classNameMarkDay'

const workHourUpdateMutationDocument = graphql(`
  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId) {
      id
    }
  }
`)

interface WeekTableTaskDayCellProps {
  duration: number
  taskId: string
  day: Date
}

export const WeekTableTaskDayCell = ({ duration, taskId, day }: WeekTableTaskDayCellProps) => {
  const [, workHourUpdate] = useMutation(workHourUpdateMutationDocument)

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
