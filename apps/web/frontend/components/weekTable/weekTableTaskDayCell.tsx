import { format, isToday } from 'date-fns'
import { useMutation } from 'urql'

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

interface WeekTableTaskDayCellProps {
  duration: number
  taskId: string
  day: Date
  disabled: boolean
}

export const WeekTableTaskDayCell = ({ duration, taskId, day, disabled }: WeekTableTaskDayCellProps) => {
  const [, workHourUpdate] = useMutation(WorkHourUpdateMutationDocument)

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
        disabled={disabled}
      />
    </TableCell>
  )
}
