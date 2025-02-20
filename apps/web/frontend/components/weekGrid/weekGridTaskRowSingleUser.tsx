import { parseISO } from 'date-fns'
import { useSession } from 'next-auth/react'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { WorkHourCommentButton } from '../workHourCommentButton'
import { WeekGridTaskDayCell } from './weekGridTaskDayCell'

const WeekGridTaskRowSingleUserFragment = graphql(`
  fragment WeekGridTaskRowSingleUser on Task {
    id
    title
    project {
      id
      isArchived
      members {
        id
      }
    }
    taskTotal: workHourOfDays(from: $from, to: $to, userIds: $userIds) {
      user {
        id
      }
      date
      workHour {
        duration
      }
      isLocked
    }
    tracking {
      ...TrackingButtonsTracking
    }
    isLockedByAdmin
    ...TrackingButtonsTask
    ...WorkHourCommentFragment
  }
`)

interface WeekGridTaskRowProps {
  task: FragmentType<typeof WeekGridTaskRowSingleUserFragment>
  isDataOutdated?: boolean
  userIds: string[]
}

const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0] // Monday to Sunday

export const WeekGridTaskRowSingleUser = ({
  task: taskFragment,
  isDataOutdated = false,
  userIds,
}: WeekGridTaskRowProps) => {
  const task = useFragment(WeekGridTaskRowSingleUserFragment, taskFragment)
  const session = useSession()
  const sessionUserId = session.data?.user.id

  const canUserTrackTask = task.project.members.some((member) => member.id === sessionUserId)

  const taskDurations = task.taskTotal.reduce((total, workHour) => total + (workHour.workHour?.duration ?? 0), 0)

  return (
    <div key={task.id} className="contents" role="row">
      <div className="pl-3" role="cell">
        {!task.isLockedByAdmin && !task.project.isArchived && (
          <TrackingButtons
            tracking={task.tracking}
            taskToTrack={task}
            interactiveButtons={false}
            canUserTrackTask={canUserTrackTask && !!sessionUserId && userIds.includes(sessionUserId)}
          />
        )}
      </div>
      <div className="flex items-center gap-2 px-3">
        <span role="cell">{task.title}</span>
      </div>
      {DAYS_OF_WEEK.map((day) => {
        const workHour = task.taskTotal.find(
          (hour) => new Date(hour.date).getDay() === day && hour.user.id === userIds[0],
        )
        return workHour ? (
          <WeekGridTaskDayCell
            day={parseISO(workHour.date)}
            disabled={workHour.isLocked}
            taskId={task.id}
            duration={workHour.workHour?.duration ?? 0}
            key={`${task.id}-${workHour.date}-${workHour.user.id}`}
            isDataOutdated={isDataOutdated}
            userIds={userIds}
          />
        ) : (
          <div key={`${task.id}-${userIds[0]}-${day}`} />
        )
      })}
      <div className="px-2 text-right" role="cell">
        {isDataOutdated ? <div className="skeleton h-8 w-9" /> : <FormattedDuration minutes={taskDurations} title="" />}
      </div>
      <div className="px-2" role="cell">
        <WorkHourCommentButton
          task={task}
          currentUserId={sessionUserId && userIds.includes(sessionUserId) ? sessionUserId : userIds[0]}
        />
      </div>
    </div>
  )
}
