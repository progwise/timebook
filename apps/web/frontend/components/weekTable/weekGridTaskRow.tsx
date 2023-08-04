import { eachDayOfInterval, isSameDay, parseISO, isBefore, isAfter } from 'date-fns'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { TaskLockButton } from './taskLockButton'
import { WeekGridTaskDayCell } from './weekGridTaskDeyCell'
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
  interval: { start: Date; end: Date }
  task: FragmentType<typeof WeekTableTaskRowFragment>
}

export const WeekGridTaskRow = ({ interval, task: taskFragment }: WeekTableTaskRowProps) => {
  const task = useFragment(WeekTableTaskRowFragment, taskFragment)
  const taskDurations = task.workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <div className="contents border-none">
      <div className="gap-1">
        {!task.isLockedByAdmin && !task.project.isArchived && (
          <TrackingButtons tracking={task.tracking} taskToTrack={task} />
        )}
      </div>
      <div>{task.title}</div>
      {eachDayOfInterval(interval).map((day, index, array) => {
        const durations = task.workHours
          .filter((workHour) => isSameDay(parseISO(workHour.date), day))
          .map((workHour) => workHour.duration)
        const duration = durations.reduce((previous, current) => previous + current, 0)

        return (
          <WeekGridTaskDayCell
            day={day}
            disabled={
              task.project.isArchived ||
              !task.project.isProjectMember ||
              (task.project.startDate ? isBefore(day, parseISO(task.project.startDate)) : false) ||
              (task.project.endDate ? isAfter(day, parseISO(task.project.endDate)) : false)
            }
            taskId={task.id}
            duration={duration}
            key={day.toDateString() + duration}
            projectId={task.project.id}
            className={`${index === 0 ? 'border-l' : ''} ${index === array.length - 1 ? 'border-r' : ''} self-stretch`}
          />
        )
      })}
      <div className="text-center">
        <FormattedDuration minutes={taskDurations} title="" />
      </div>
      <div>
        {task.project.isProjectMember && !task.isLockedByAdmin && !task.project.isArchived && (
          <TaskLockButton task={task} />
        )}
      </div>
    </div>
  )
}
