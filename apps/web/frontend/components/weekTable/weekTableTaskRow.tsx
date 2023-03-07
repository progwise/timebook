import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'
import { eachDayOfInterval, isSameDay, parseISO, isBefore, isAfter } from 'date-fns'
import { TaskWithWorkHoursFragment } from '../../generated/graphql'
import { WeekTableTaskDayCell } from './weekTableTaskDayCell'

interface WeekTableTaskRowProps {
  interval: { start: Date; end: Date }
  task: TaskWithWorkHoursFragment
  projectStart?: string | null
  projectEnd?: string | null
}

export const WeekTableTaskRow = ({ interval, task, projectStart, projectEnd }: WeekTableTaskRowProps) => {
  const taskDurations = task.workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <TableRow>
      <TableCell>{task.title}</TableCell>
      {eachDayOfInterval(interval).map((day) => {
        const durations = task.workHours
          .filter((workHour) => isSameDay(parseISO(workHour.date), day))
          .map((workHour) => workHour.duration)
        const duration = durations.reduce((previous, current) => previous + current, 0)

        return (
          <WeekTableTaskDayCell
            day={day}
            disabled={
              (projectStart ? isBefore(day, new Date(projectStart)) : false) ||
              (projectEnd ? isAfter(day, new Date(projectEnd)) : false)
            }
            taskId={task.id}
            duration={duration}
            key={day.toDateString()}
          />
        )
      })}
      <TableCell>
        <FormattedDuration minutes={taskDurations} title="" />
      </TableCell>
    </TableRow>
  )
}
