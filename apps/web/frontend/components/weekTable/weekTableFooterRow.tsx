import { eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns'

import { FormattedDuration, TableCell, TableFootRow } from '@progwise/timebook-ui'

import { SimpleWorkHourFragment } from '../../generated/graphql'
import { classNameMarkDay } from './classNameMarkDay'

interface WeekTableFooterRowProps {
  interval: { start: Date; end: Date }
  workHours: SimpleWorkHourFragment[]
}

export const WeekTableFooterRow = ({ interval, workHours }: WeekTableFooterRowProps) => {
  const sumOfDurationsOfTheWeek = workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <TableFootRow>
      <TableCell />
      {eachDayOfInterval(interval).map((day) => {
        const workHoursOfTheDay = workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day))
        const sumOfDurationsOfTheDay = workHoursOfTheDay
          .map((workHour) => workHour.duration)
          .reduce((previous, current) => previous + current, 0)

        return (
          <TableCell className={isToday(day) ? classNameMarkDay : ''} key={day.toString()}>
            <FormattedDuration title="" minutes={sumOfDurationsOfTheDay} />
          </TableCell>
        )
      })}
      <TableCell>
        <FormattedDuration title="" minutes={sumOfDurationsOfTheWeek} />
      </TableCell>
    </TableFootRow>
  )
}
