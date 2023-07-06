import { useLocalStorageValue } from '@react-hookz/web'
import { eachDayOfInterval, isToday } from 'date-fns'
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { classNameMarkDay } from './classNameMarkDay'
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

export const WeekTableProjectRowGroup = ({ interval, project: projectFragment }: WeekTableProjectRowGroupProps) => {
  const project = useFragment(WeekTableProjectRowGroupFragment, projectFragment)

  const { value: isCollapsed, set: setIsCollapsed } = useLocalStorageValue(`isCollapsed-${project.id}`, {
    defaultValue: false,
    initializeWithValue: false,
  })

  const workHours = project.tasks.flatMap((task) => task.workHours)
  const projectDuration = workHours.reduce((accumulator, workHour) => accumulator + workHour.duration, 0)

  return (
    <>
      <TableRow onClick={() => setIsCollapsed(!isCollapsed)} className="cursor-pointer border-t border-b-0 text-lg">
        <TableCell colSpan={2}>
          <div className="flex items-center gap-1 whitespace-nowrap font-bold">
            {isCollapsed ? <BiArrowToBottom /> : <BiArrowToTop />}
            {project.isArchived ? <span title="This project was archived">🗄️ {project.title}</span> : project.title}
          </div>
        </TableCell>
        {eachDayOfInterval(interval).map((day, index, array) => (
          <TableCell
            key={day.toDateString()}
            className={`py-0 ${index === 0 ? 'border-l' : ''} ${index === array.length - 1 ? 'border-r' : ''}`}
          >
            <div className={`${isToday(day) ? classNameMarkDay : ''}`} />
          </TableCell>
        ))}
        <TableCell className="text-center font-bold">
          <FormattedDuration title="" minutes={projectDuration} />
        </TableCell>
        <TableCell />
      </TableRow>
      {!isCollapsed && project.tasks.map((task) => <WeekTableTaskRow interval={interval} task={task} key={task.id} />)}
    </>
  )
}
