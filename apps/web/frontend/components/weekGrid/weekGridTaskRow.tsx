import { parseISO } from 'date-fns'

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

interface WeekGridTaskRowProps {
  task: FragmentType<typeof WeekGridTaskRowFragment>
  isDataOutdated?: boolean
}

export const WeekGridTaskRow = ({ task: taskFragment, isDataOutdated = false }: WeekGridTaskRowProps) => {
  const task = useFragment(WeekGridTaskRowFragment, taskFragment)
  const taskDurations = task.workHourOfDays
    .map((workHour) => workHour.workHour?.duration ?? 0)
    .reduce((previous, current) => previous + current, 0)

  return (
    <div className="contents" role="row">
      <div className="pl-3" role="cell">
        {!task.isLockedByAdmin && !task.project.isArchived && (
          <TrackingButtons tracking={task.tracking} taskToTrack={task} />
        )}
      </div>
      <div className="px-3" role="cell">
        {task.title}
      </div>
      {task.workHourOfDays.map((workHourOfDay) => (
        <WeekGridTaskDayCell
          day={parseISO(workHourOfDay.date)}
          disabled={workHourOfDay.isLocked}
          taskId={task.id}
          duration={workHourOfDay.workHour?.duration ?? 0}
          key={workHourOfDay.date}
          isDataOutdated={isDataOutdated}
        />
      ))}
      <div className="px-2 text-right" role="cell">
        {isDataOutdated ? (
          <div className="skeleton h-8 w-16" />
        ) : (
          <FormattedDuration minutes={taskDurations} title="" />
        )}
      </div>
      <div className="px-2" role="cell">
        {task.project.isProjectMember && !task.isLockedByAdmin && !task.project.isArchived && (
          <TaskLockButton task={task} />
        )}
      </div>
    </div>
  )
}
