import { parseISO } from 'date-fns'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { TaskLockButton } from './taskLockButton'
import { WeekTableTaskDayCell } from './weekTableTaskDayCell'

const WeekTableTaskRowFragment = graphql(`
  fragment WeekTableTaskRow on Task {
    id
    title
    project {
      startDate
      endDate
    }
    workHourOfDays(from: $from, to: $to) {
      date
      workHour {
        duration
      }
      isLocked
    }
    project {
      id
      isProjectMember
      isArchived
    }
    tracking {
      ...TrackingButtonsTracking
    }
    isLockedByAdmin
    ...TrackingButtonsTask
    ...TaskLockButton
  }
`)

interface WeekTableTaskRowProps {
  task: FragmentType<typeof WeekTableTaskRowFragment>
}

export const WeekTableTaskRow = ({ task: taskFragment }: WeekTableTaskRowProps) => {
  const task = useFragment(WeekTableTaskRowFragment, taskFragment)
  const taskDurations = task.workHourOfDays
    .map((workHour) => workHour.workHour?.duration ?? 0)
    .reduce((previous, current) => previous + current, 0)

  return (
    <TableRow className="border-gray-200 dark:border-gray-700">
      <TableCell className="flex gap-1">
        {!task.isLockedByAdmin && !task.project.isArchived && (
          <TrackingButtons tracking={task.tracking} taskToTrack={task} />
        )}
      </TableCell>
      <TableCell>{task.title}</TableCell>
      {task.workHourOfDays.map((workHourOfDay) => (
        <WeekTableTaskDayCell
          day={parseISO(workHourOfDay.date)}
          disabled={workHourOfDay.isLocked}
          taskId={task.id}
          duration={workHourOfDay.workHour?.duration ?? 0}
          key={workHourOfDay.date}
        />
      ))}
      <TableCell className="text-center">
        <FormattedDuration minutes={taskDurations} title="" />
      </TableCell>
      <TableCell>
        {task.project.isProjectMember && !task.isLockedByAdmin && !task.project.isArchived && (
          <TaskLockButton task={task} />
        )}
      </TableCell>
    </TableRow>
  )
}
