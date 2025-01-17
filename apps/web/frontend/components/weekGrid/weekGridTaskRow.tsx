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
    taskTotal: workHourOfDays(from: $from, to: $to, userIds: $userIds) {
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

interface WorkHourProps {
  date: string
  isLocked: boolean
  user: {
    id: string
    name?: string | null
    image?: string | null
  }
  workHour?: {
    duration: number
  } | null
}

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
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 0] // Monday to Sunday

  const calculateMemberDuration = (userId: string) =>
    task.taskTotal
      .filter((workHour) => workHour.user.id === userId)
      .reduce((total, workHour) => total + (workHour.workHour?.duration ?? 0), 0)

  const renderDayCell = (workHour: WorkHourProps, taskId: string, isDataOutdated: boolean, currentUserId: string) => {
    const key = `${taskId}-${workHour.date}-${workHour.user.id}`

    return (
      <WeekGridTaskDayCell
        day={parseISO(workHour.date)}
        disabled={workHour.isLocked}
        taskId={taskId}
        duration={workHour.workHour?.duration ?? 0}
        key={key}
        isDataOutdated={isDataOutdated}
        currentUserId={currentUserId}
      />
    )
  }

  // Member row rendering
  const renderMemberRows = () =>
    task.project.members.map((member) => {
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
          {daysOfWeek.map((day) => {
            const workHour = task.taskTotal.find(
              (hour) => new Date(hour.date).getDay() === day && hour.user.id === member.id,
            )
            return workHour ? (
              renderDayCell(workHour, task.id, isDataOutdated, member.id)
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

  // Single-row rendering
  const renderSingleRow = () => {
    const taskDurations = task.taskTotal.reduce((total, workHour) => total + (workHour.workHour?.duration ?? 0), 0)

    return (
      <div key={task.id} className="contents" role="row">
        <div className="pl-3" role="cell">
          {!task.isLockedByAdmin && !task.project.isArchived && (
            <TrackingButtons tracking={task.tracking} taskToTrack={task} interactiveButtons={false} />
          )}
        </div>
        <div className="flex items-center gap-2 px-3">
          <span role="cell">{task.title}</span>
        </div>
        {daysOfWeek.map((day) => {
          const workHour = task.taskTotal.find(
            (hour) => new Date(hour.date).getDay() === day && hour.user.id === currentUserId,
          )
          return workHour ? (
            renderDayCell(workHour, task.id, isDataOutdated, currentUserId)
          ) : (
            <div key={`${task.id}-${currentUserId}-${day}`} />
          )
        })}
        <div className="px-2 text-right" role="cell">
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
    )
  }

  // Conditional rendering based on current user
  return currentUserId === 'all' ? renderMemberRows() : renderSingleRow()
}
