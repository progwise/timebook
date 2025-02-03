import { parseISO } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { UserLabel } from '../userLabel'
import { WorkHourCommentButton } from '../workHourCommentButton'
import { WeekGridTaskDayCell } from './weekGridTaskDayCell'

const WeekGridTaskRowAllUsersFragment = graphql(`
  fragment WeekGridTaskRowAllUsers on Task {
    id
    title
    project {
      id
      isArchived
      members {
        id
        name
        image
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
  task: FragmentType<typeof WeekGridTaskRowAllUsersFragment>
  isDataOutdated?: boolean
  userIds: string[]
}

const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 0] // Monday to Sunday

export const WeekGridTaskRowAllUsers = ({
  task: taskFragment,
  isDataOutdated = false,
  userIds,
}: WeekGridTaskRowProps) => {
  const task = useFragment(WeekGridTaskRowAllUsersFragment, taskFragment)

  const calculateMemberDuration = (userId: string) =>
    task.taskTotal
      .filter((workHour) => workHour.user.id === userId && task.project.members.some((member) => member.id === userId))
      .reduce((total, workHour) => total + (workHour.workHour?.duration ?? 0), 0)

  return task.project.members.map((member) => {
    if (!userIds.includes(member.id)) {
      return
    }
    const memberTaskDurations = calculateMemberDuration(member.id)

    return (
      <div key={`${task.id}-${member.id}`} className="contents" role="row">
        <div className="pl-3" role="cell">
          {!task.isLockedByAdmin && !task.project.isArchived && (
            <TrackingButtons tracking={task.tracking} taskToTrack={task} interactiveButtons={false} />
          )}
        </div>
        <div className="flex items-center gap-2 px-3">
          <span role="cell">{task.title}</span>
          <div className="pr-4">
            <UserLabel name={member.name ?? member.id} image={member.image ?? undefined} />
          </div>
        </div>
        {DAYS_OF_WEEK.map((day) => {
          const workHour = task.taskTotal.find(
            (hour) =>
              new Date(hour.date).getDay() === day &&
              hour.user.id === member.id &&
              task.project.members.some((member) => member.id === hour.user.id),
          )
          return workHour ? (
            <WeekGridTaskDayCell
              day={parseISO(workHour.date)}
              disabled={workHour.isLocked}
              taskId={task.id}
              duration={workHour.workHour?.duration ?? 0}
              key={`${task.id}-${workHour.date}-${workHour.user.id}`}
              isDataOutdated={isDataOutdated}
              userIds={[workHour.user.id]}
            />
          ) : (
            <div key={`${task.id}-${member.id}-${day}`} className="flex items-center justify-center py-1" role="cell">
              <div className="skeleton h-8 w-16" />
            </div>
          )
        })}
        <div className="px-2 text-right" role="cell">
          {isDataOutdated ? (
            <div className="skeleton h-8 w-9" />
          ) : (
            <FormattedDuration minutes={memberTaskDurations} title="" />
          )}
        </div>
        <div className="px-2" role="cell">
          <WorkHourCommentButton task={task} />
        </div>
      </div>
    )
  })
}
