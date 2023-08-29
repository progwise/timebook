import { useLocalStorageValue } from '@react-hookz/web'
import { eachDayOfInterval } from 'date-fns'
import { BiArrowToBottom } from 'react-icons/bi'

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
      workHours(from: $from, to: $to) {
        duration
      }
    }
  }
`)

interface WeekGridProjectRowGroupProps {
  interval: { start: Date; end: Date }
  project: FragmentType<typeof WeekGridProjectRowGroupFragment>
  isFirstProject: boolean
  isLastProject: boolean
}

export const WeekGridProjectRowGroup = ({
  interval,
  project: projectFragment,
  isFirstProject,
}: WeekGridProjectRowGroupProps) => {
  const project = useFragment(WeekGridProjectRowGroupFragment, projectFragment)

  const { value: isCollapsed, set: setIsCollapsed } = useLocalStorageValue(`isCollapsed-${project.id}`, {
    defaultValue: false,
    initializeWithValue: false,
  })

  const workHours = project.tasks.flatMap((task) => task.workHours)
  const projectDuration = workHours.reduce((accumulator, workHour) => accumulator + workHour.duration, 0)

  return (
    <>
      <div onClick={() => setIsCollapsed(!isCollapsed)} className="contents cursor-pointer" role="row">
        <div
          className={`col-span-2 col-start-1 flex items-center gap-1 self-stretch ${
            isFirstProject ? 'rounded-tl-md' : ''
          } border-t p-2 text-lg font-bold`}
          role="cell"
        >
          <BiArrowToBottom className={`${isCollapsed ? '-rotate-180' : ''} transition`} />
          {project.isArchived ? <span title="This project was archived">🗄️ {project.title}</span> : project.title}
        </div>
        {eachDayOfInterval(interval).map((day) => (
          <div key={day.toDateString()} className="self-stretch border-t px-1 text-lg" role="cell" />
        ))}
        <div className="flex items-center self-stretch border-t px-2 text-center text-lg font-bold" role="cell">
          <FormattedDuration title="" minutes={projectDuration} />
        </div>
        <div className={`self-stretch border-t px-5 ${isFirstProject ? 'rounded-tr-md' : ''}`} role="cell" />
      </div>
      <div
        className={`contents ${
          isCollapsed ? 'invisible [&_*]:max-h-0 [&_*]:opacity-0' : '[&_*]:max-h-[9999rem]'
        } [&_*]:transition-all`}
      >
        {project.tasks.map((task) => (
          <WeekGridTaskRow interval={interval} task={task} key={task.id} />
        ))}
      </div>
    </>
  )
}
