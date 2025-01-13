import { parseISO } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { UserLabel } from '../userLabel'
import { WorkHourCommentButton } from '../workHourCommentButton'
import { WeekGridTaskDayCell } from './weekGridTaskDayCell'

const WeekGridTaskRowFragment = graphql(`
  fragment WeekGridTaskRow on Task {
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
    #The userIds parameter queries the workHourOfDays field with the given user IDs. In the row of the task.
    taskTotal: workHourOfDays(from: $from, to: $to, userIds: $userIds, projectMemberUserId: $projectMemberUserId) {
      user {
        id
        name
        image
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
  task: FragmentType<typeof WeekGridTaskRowFragment>
  isDataOutdated?: boolean
  currentUserId: string
}

export const WeekGridTaskRow = ({
  task: taskFragment,
  isDataOutdated = false,
  currentUserId,
}: WeekGridTaskRowProps) => {
  const task = useFragment(WeekGridTaskRowFragment, taskFragment)
  const taskDurations = task.taskTotal
    .map((workHour) => workHour.workHour?.duration ?? 0)
    .reduce((previous, current) => previous + current, 0)

  return (
    <>
      {task.project.members.map(
        (member) =>
          (currentUserId === 'all' || member.id === currentUserId) && ( // Show for all members or the selected member
            <div key={member.id} className="contents" role="row">
              <div className="pl-3" role="cell">
                {!task.isLockedByAdmin && !task.project.isArchived && (
                  <TrackingButtons tracking={task.tracking} taskToTrack={task} interactiveButtons={false} />
                )}
              </div>
              <div className="flex items-center gap-2 px-3">
                <span role="cell">{task.title} </span>
                <div className="pr-4">
                  {currentUserId === 'all' && (
                    <UserLabel name={member.name ?? member.id} image={member.image ?? undefined} />
                  )}
                </div>
              </div>
              {task.taskTotal.map((workHourOfDay) => (
                <WeekGridTaskDayCell
                  day={parseISO(workHourOfDay.date)}
                  disabled={workHourOfDay.isLocked}
                  taskId={task.id}
                  duration={workHourOfDay.workHour?.duration ?? 0}
                  key={workHourOfDay.date}
                  isDataOutdated={isDataOutdated}
                  currentUserId={currentUserId === 'all' ? member.id : currentUserId}
                />
              ))}
              <div className="bg-slate-200 px-2 text-right" role="cell">
                {isDataOutdated ? (
                  <div className="skeleton h-8 w-9" />
                ) : (
                  <FormattedDuration minutes={taskDurations} title="" />
                )}
              </div>
              <div className="px-2" role="cell">
                <WorkHourCommentButton task={task} />
              </div>
            </div>
          ),
      )}
    </>
  )
}
