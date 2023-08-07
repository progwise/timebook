import { useLocalStorageValue } from '@react-hookz/web'
import { eachDayOfInterval, isToday } from 'date-fns'
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { classNameMarkDay } from './classNameMarkDay'
import { WeekGridTaskRow } from './weekGridTaskRow'
import { WeekTableTaskRow } from './weekTableTaskRow'

export const WeekTableProjectRowGroupFragment = graphql(`
  fragment WeekTableProjectRowGroup on Project {
    id
    title
    isArchived
    tasks {
      id
      ...WeekTableTaskRow
      workHours(from: $from, to: $to) {
        duration
      }
    }
  }
`)

interface WeekTableProjectRowGroupProps {
  interval: { start: Date; end: Date }
  project: FragmentType<typeof WeekTableProjectRowGroupFragment>
}

export const WeekGridProjectRowGroup = ({ interval, project: projectFragment }: WeekTableProjectRowGroupProps) => {
  const project = useFragment(WeekTableProjectRowGroupFragment, projectFragment)

  const { value: isCollapsed, set: setIsCollapsed } = useLocalStorageValue(`isCollapsed-${project.id}`, {
    defaultValue: false,
    initializeWithValue: false,
  })

  const workHours = project.tasks.flatMap((task) => task.workHours)
  const projectDuration = workHours.reduce((accumulator, workHour) => accumulator + workHour.duration, 0)

  return (
    <>
      <div onClick={() => setIsCollapsed(!isCollapsed)} className="contents cursor-pointer">
        <div className="col-span-2 col-start-1 flex items-center gap-1 self-stretch whitespace-nowrap border-t py-2 text-lg font-bold">
          {isCollapsed ? <BiArrowToBottom /> : <BiArrowToTop />}
          {project.isArchived ? <span title="This project was archived">🗄️ {project.title}</span> : project.title}
        </div>
        {eachDayOfInterval(interval).map((day, index, array) => (
          <div
            key={day.toDateString()}
            className={`${index === 0 ? 'border-l' : ''} ${index === array.length - 1 ? 'border-r' : ''}
            self-stretch px-0.5 text-lg`}
          >
            <div className={`${isToday(day) ? classNameMarkDay : ''} h-full border-t`} />
          </div>
        ))}
        <div className="px-2 text-center text-lg font-bold">
          <FormattedDuration title="" minutes={projectDuration} />
        </div>
        <div className="px-5" />
      </div>
      {!isCollapsed && project.tasks.map((task) => <WeekGridTaskRow interval={interval} task={task} key={task.id} />)}
    </>
  )
}
