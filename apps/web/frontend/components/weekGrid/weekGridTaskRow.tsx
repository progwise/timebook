import { eachDayOfInterval, isSameDay, parseISO, isBefore, isAfter } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { TaskLockButton } from './taskLockButton'
import { WeekGridTaskDayCell } from './weekGridTaskDayCell'

const WeekGridTaskRowFragment = graphql(`
  fragment WeekGridTaskRow on Task {
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

interface WeekGridTaskRowProps {
  interval: { start: Date; end: Date }
  task: FragmentType<typeof WeekGridTaskRowFragment>
}

export const WeekGridTaskRow = ({ interval, task: taskFragment }: WeekGridTaskRowProps) => {
  const task = useFragment(WeekGridTaskRowFragment, taskFragment)
  const taskDurations = task.workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <div className="contents" role="row">
      <div className="pl-2" role="cell">
        {!task.isLockedByAdmin && !task.project.isArchived && (
          <TrackingButtons tracking={task.tracking} taskToTrack={task} />
        )}
      </div>
      <div className="px-2" role="cell">
        {task.title}
      </div>
      {eachDayOfInterval(interval).map((day) => {
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
            className="self-stretch"
          />
        )
      })}
      <div className="text-center" role="cell">
        <FormattedDuration minutes={taskDurations} title="" />
      </div>
      <div className="px-1" role="cell">
        {task.project.isProjectMember && !task.isLockedByAdmin && !task.project.isArchived && (
          <TaskLockButton task={task} />
        )}
      </div>
    </div>
  )
}
