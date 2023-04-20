import { eachDayOfInterval, isToday } from 'date-fns'
import { useEffect, useState } from 'react'
// <-- import useLocalStorage
import { BiArrowToBottom, BiArrowToTop } from 'react-icons/bi'
import { useLocalStorage } from 'react-use'

import { FormattedDuration, TableCell, TableRow } from '@progwise/timebook-ui'

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

  const [isExpanded, setIsExpanded] = useLocalStorage(`isExpanded-${project.id}`, true)
  const [readFromLocalStorage, setReadFromLocalStorage] = useState(false)
  useEffect(() => {
    setReadFromLocalStorage(true)
  }, [])

  const workHours = project.tasks.flatMap((task) => task.workHours)
  const projectDuration = workHours.reduce((accumulator, workHour) => accumulator + workHour.duration, 0)

  return (
    <>
      <TableRow onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer text-lg">
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
        <TableCell className="text-center font-bold">
          <FormattedDuration title="" minutes={projectDuration} />
        </TableCell>
      </TableRow>
      {isExpanded && project.tasks.map((task) => <WeekTableTaskRow interval={interval} task={task} key={task.id} />)}
    </>
  )
}
