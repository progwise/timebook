import { FormattedDuration, Spinner, TableCell, TableRow } from '@progwise/timebook-ui'
import { eachDayOfInterval, isSameDay, parseISO, format, isBefore, isAfter } from 'date-fns'
import { ProjectFilter, TaskWithWorkHoursFragment, useMyProjectsQuery } from '../../generated/graphql'
import { WeekTableTaskDayCell } from './weekTableTaskDayCell'

interface WeekTableTaskRowProps {
  interval: { start: Date; end: Date }
  task: TaskWithWorkHoursFragment
}

export const WeekTableTaskRow = ({ interval, task }: WeekTableTaskRowProps) => {
  const taskDurations = task.workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  const [{ data }] = useMyProjectsQuery({
    variables: { from: format(new Date(), 'yyyy-MM-dd'), filter: ProjectFilter.All },
  })

  const currentProjekt = data?.projects.find((project) => project.id === task.project.id)
  const startDay = new Date(currentProjekt?.startDate ?? '')
  const endDate = new Date(currentProjekt?.endDate ?? '')

  return (
    <TableRow>
      <TableCell>{task.title}</TableCell>
      {data &&
        eachDayOfInterval(interval).map((day) => {
          const isDayBefore = isBefore(day, startDay)
          const isDayAfter = isAfter(day, endDate)

          const durations = task.workHours
            .filter((workHour) => isSameDay(parseISO(workHour.date), day))
            .map((workHour) => workHour.duration)
          const duration = durations.reduce((previous, current) => previous + current, 0)

          return (
            <WeekTableTaskDayCell
              day={day}
              disabled={isDayBefore || isDayAfter}
              taskId={task.id}
              duration={duration}
              key={day.toDateString()}
            />
          )
        })}
      <TableCell>
        <FormattedDuration minutes={taskDurations} title="" />
      </TableCell>
    </TableRow>
  )
}
