import { useLocalStorageValue } from '@react-hookz/web'
import { eachDayOfInterval } from 'date-fns'
import Link from 'next/link'
import { FaAngleRight } from 'react-icons/fa6'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { WeekGridTaskRow } from './weekGridTaskRow'

export const WeekGridTaskRowGroupFragment = graphql(`
  fragment WeekGridTaskRowGroup on Task {
    id
    title
    archived
    project {
      members {
        id
        name
        image
      }
    }
    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {
      workHour {
        duration
      }
    }
    ...WeekGridTaskRow
  }
`)

interface WeekGridTaskRowGroupProps {
  interval: { start: Date; end: Date }
  task: FragmentType<typeof WeekGridTaskRowGroupFragment>
  isDataOutdated?: boolean
  projectMembers: Array<{ id: string; name: string; image?: string }>
}

export const WeekGridTaskRowGroup = ({
  interval,
  task: taskFragment,
  isDataOutdated = false,
  projectMembers,
}: WeekGridTaskRowGroupProps) => {
  const task = useFragment(WeekGridTaskRowGroupFragment, taskFragment)

  const { value: isCollapsed, set: setIsCollapsed } = useLocalStorageValue(`isCollapsed-${task.id}`, {
    defaultValue: false,
    initializeWithValue: false,
  })

  const workHours = task.workHourOfDays
  const taskDuration = workHours.reduce((accumulator, workHour) => accumulator + (workHour.workHour?.duration ?? 0), 0)

  return (
    <>
      <div onClick={() => setIsCollapsed(!isCollapsed)} className="contents cursor-pointer" role="row">
        <div
          className="col-span-2 flex items-center gap-1 self-stretch rounded-l-box bg-base-200 p-2 text-lg font-bold text-base-content"
          role="cell"
        >
          <FaAngleRight className={`${isCollapsed ? '' : 'rotate-90'} transition`} />
          <Link href={`tasks/${task.id}`} className="link-hover link flex items-center gap-1">
            {task.archived ? <span title="This task was archived">🗄️ {task.title}</span> : task.title}
          </Link>
        </div>

        {eachDayOfInterval(interval).map((day) => (
          <div key={day.toDateString()} className="self-stretch bg-base-200" role="cell" />
        ))}
        <div
          className="flex items-center justify-end self-stretch bg-base-200 px-2 text-right text-lg font-bold text-base-content"
          role="cell"
        >
          {isDataOutdated ? (
            <div className="skeleton h-8 w-9" />
          ) : (
            <FormattedDuration title="" minutes={taskDuration} />
          )}
        </div>
      </div>
      <div className="self-stretch rounded-r-box bg-base-200" role="cell" />
      <div className="self-stretch rounded-r-box bg-base-200" role="cell" />
      <div className={`contents ${isCollapsed ? 'invisible [&_*]:h-0' : ''}`}>
        {task.project.members.map((member) => (
          <WeekGridTaskRow
            task={task}
            key={member.id}
            isDataOutdated={isDataOutdated}
            projectMembers={projectMembers}
          />
        ))}
      </div>
    </>
  )
}
