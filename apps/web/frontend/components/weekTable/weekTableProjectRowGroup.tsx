import { eachDayOfInterval, isToday } from 'date-fns'
import { useState } from 'react'
import { BiArrowFromBottom, BiArrowFromTop, BiArrowToBottom, BiArrowToTop, BiUpArrow } from 'react-icons/bi'

import { TableBody, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { classNameMarkDay } from './classNameMarkDay'
import { WeekTableTaskRow } from './weekTableTaskRow'

export const WeekTableProjectRowGroupFragment = graphql(`
  fragment WeekTableProjectRowGroup on Project {
    id
    title
    tasks {
      id
      ...WeekTableTaskRow
    }
  }
`)

interface WeekTableProjectRowGroupProps {
  interval: { start: Date; end: Date }
  project: FragmentType<typeof WeekTableProjectRowGroupFragment>
}

export const WeekTableProjectRowGroup = ({ interval, project: projectFragment }: WeekTableProjectRowGroupProps) => {
  const project = useFragment(WeekTableProjectRowGroupFragment, projectFragment)
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <>
      <TableRow onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        <TableCell colSpan={2}>
          <div className="flex items-center gap-1 font-bold">
            {project.title}
            {isExpanded ? <BiArrowToTop /> : <BiArrowToBottom />}
            {!isExpanded && `${project.tasks.length} tasks`}
          </div>
        </TableCell>
        {eachDayOfInterval(interval).map((day) => (
          <TableCell key={day.toDateString()} className={isToday(day) ? classNameMarkDay : ''} />
        ))}
        <TableCell />
      </TableRow>
      {isExpanded && project.tasks.map((task) => <WeekTableTaskRow interval={interval} task={task} key={task.id} />)}
    </>
  )
}
