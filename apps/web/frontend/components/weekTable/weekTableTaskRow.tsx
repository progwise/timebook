import { eachDayOfInterval, isSameDay, parseISO, isBefore, isAfter } from 'date-fns'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { WeekTableTaskDayCell } from './weekTableTaskDayCell'

const WeekTableTaskRowFragment = graphql(`
  fragment WeekTableTaskRow on Task {
    id
    title
    project {
      startDate
      endDate
    }
    workHours(from: $from, to: $to) {
      duration
      date
    }
  }
`)

interface WeekTableTaskRowProps {
  interval: { start: Date; end: Date }
  task: FragmentType<typeof WeekTableTaskRowFragment>
}

export const WeekTableTaskRow = ({ interval, task: taskFragment }: WeekTableTaskRowProps) => {
  const task = useFragment(WeekTableTaskRowFragment, taskFragment)
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
              (task.project.startDate ? isBefore(day, parseISO(task.project.startDate)) : false) ||
              (task.project.endDate ? isAfter(day, parseISO(task.project.endDate)) : false)
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
