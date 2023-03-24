import { eachDayOfInterval, isToday } from 'date-fns'

import { TableCell, TableRow } from '@progwise/timebook-ui'

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
  return (
    <>
      <TableRow>
        <TableCell className="font-bold" colSpan={2}>
          {project.title}
        </TableCell>
        {eachDayOfInterval(interval).map((day) => (
          <TableCell key={day.toDateString()} className={isToday(day) ? classNameMarkDay : ''} />
        ))}
        <TableCell />
      </TableRow>
      {project.tasks.map((task) => (
        <WeekTableTaskRow interval={interval} task={task} key={task.id} />
      ))}
    </>
  )
}
