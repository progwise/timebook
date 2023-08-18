import { useLocalStorageValue } from '@react-hookz/web'
import { eachDayOfInterval, isToday } from 'date-fns'
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { classNameMarkDay } from './classNameMarkDay'
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
      <div onClick={() => setIsCollapsed(!isCollapsed)} className="contents cursor-pointer">
        <div
          className={`col-span-2 col-start-1 flex items-center gap-1 self-stretch ${
            isFirstProject ? 'rounded-tl-md' : ''
          } border-t p-2 text-lg font-bold`}
        >
          {isCollapsed ? <BiArrowToBottom /> : <BiArrowToTop />}
          {project.isArchived ? <span title="This project was archived">🗄️ {project.title}</span> : project.title}
        </div>
        {eachDayOfInterval(interval).map((day) => (
          <div key={day.toDateString()} className="self-stretch border-t px-1 text-lg" />
        ))}
        <div className="flex items-center self-stretch border-t px-2 text-center text-lg font-bold">
          <FormattedDuration title="" minutes={projectDuration} />
        </div>
        <div className={`self-stretch border-t px-5 ${isFirstProject ? 'rounded-tr-md' : ''}`} />
      </div>
      {!isCollapsed && project.tasks.map((task) => <WeekGridTaskRow interval={interval} task={task} key={task.id} />)}
    </>
  )
}
