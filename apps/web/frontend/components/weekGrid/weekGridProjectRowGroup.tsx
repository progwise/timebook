import { useLocalStorageValue } from '@react-hookz/web'
import { eachDayOfInterval } from 'date-fns'
import { BiChevronRight } from 'react-icons/bi'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { WeekGridTaskRow } from './weekGridTaskRow'

export const WeekGridProjectRowGroupFragment = graphql(`
  fragment WeekGridProjectRowGroup on Project {
    id
    title
    isArchived
    tasks {
      id
      ...WeekGridTaskRow
      workHourOfDays(from: $from, to: $to) {
        workHour {
          duration
        }
      }
    }
  }
`)

interface WeekGridProjectRowGroupProps {
  interval: { start: Date; end: Date }
  project: FragmentType<typeof WeekGridProjectRowGroupFragment>
}

export const WeekGridProjectRowGroup = ({ interval, project: projectFragment }: WeekGridProjectRowGroupProps) => {
  const project = useFragment(WeekGridProjectRowGroupFragment, projectFragment)

  const { value: isCollapsed, set: setIsCollapsed } = useLocalStorageValue(`isCollapsed-${project.id}`, {
    defaultValue: false,
    initializeWithValue: false,
  })

  const workHours = project.tasks.flatMap((task) => task.workHourOfDays)
  const projectDuration = workHours.reduce(
    (accumulator, workHour) => accumulator + (workHour.workHour?.duration ?? 0),
    0,
  )

  return (
    <>
      <div onClick={() => setIsCollapsed(!isCollapsed)} className="contents cursor-pointer" role="row">
        <div
          className="rounded-l-box col-span-2 flex items-center gap-1 self-stretch bg-base-200 p-2 text-lg font-bold text-base-content"
          role="cell"
        >
          <BiChevronRight className={`${isCollapsed ? '' : 'rotate-90'} transition`} />
          {project.isArchived ? <span title="This project was archived">🗄️ {project.title}</span> : project.title}
        </div>
        {eachDayOfInterval(interval).map((day) => (
          <div key={day.toDateString()} className="self-stretch bg-base-200" role="cell" />
        ))}
        <div
          className="flex items-center self-stretch bg-base-200 px-2 text-center text-lg font-bold text-base-content"
          role="cell"
        >
          <FormattedDuration title="" minutes={projectDuration} />
        </div>
        <div className="rounded-r-box self-stretch bg-base-200" role="cell" />
      </div>
      <div className={`contents ${isCollapsed ? 'invisible [&_*]:max-h-0' : ''}`}>
        {project.tasks.map((task) => (
          <WeekGridTaskRow task={task} key={task.id} />
        ))}
      </div>
    </>
  )
}
