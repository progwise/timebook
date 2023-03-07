import { TableCell, TableRow } from '@progwise/timebook-ui'
import { eachDayOfInterval, isToday } from 'date-fns'
import { ProjectWithWorkHoursFragment } from '../../generated/graphql'
import { classNameMarkDay } from './classNameMarkDay'
import { WeekTableTaskRow } from './weekTableTaskRow'

interface WeekTableProjectRowGroupProps {
  interval: { start: Date; end: Date }
  project: ProjectWithWorkHoursFragment
}

export const WeekTableProjectRowGroup = ({ interval, project }: WeekTableProjectRowGroupProps) => (
  <>
    <TableRow>
      <TableCell className="font-bold">{project.title}</TableCell>
      {eachDayOfInterval(interval).map((day) => (
        <TableCell key={day.toDateString()} className={isToday(day) ? classNameMarkDay : ''} />
      ))}
      <TableCell />
    </TableRow>
    {project.tasks.map((task) => (
      <WeekTableTaskRow
        projectStart={project.startDate}
        projectEnd={project.endDate}
        interval={interval}
        task={task}
        key={task.id}
      />
    ))}
  </>
)
