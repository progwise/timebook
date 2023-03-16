import { eachDayOfInterval, isSameDay, parseISO } from 'date-fns'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { WeekTableTaskDayCell } from './weekTableTaskDayCell'

const WeekTableTaskRowFragment = graphql(`
  fragment WeekTableTaskRow on Task {
    id
    title
    workHours(from: $from, to: $to) {
      duration
      date
    }
    project {
      id
    }
    tracking {
      ...TrackingButtonsTracking
    }
    ...TrackingButtonsTask
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
      <TableCell>
        <div className="flex gap-1">
          <TrackingButtons tracking={task.tracking} taskToTrack={task} />
        </div>
      </TableCell>
      <TableCell>
        <div>{task.title}</div>
      </TableCell>
      {eachDayOfInterval(interval).map((day) => {
        const durations = task.workHours
          .filter((workHour) => isSameDay(parseISO(workHour.date), day))
          .map((workHour) => workHour.duration)
        const duration = durations.reduce((previous, current) => previous + current, 0)

        return (
          <WeekTableTaskDayCell
            day={day}
            taskId={task.id}
            duration={duration}
            key={day.toDateString() + duration}
            projectId={task.project.id}
          />
        )
      })}
      <TableCell>
        <FormattedDuration minutes={taskDurations} title="" />
      </TableCell>
    </TableRow>
  )
}
