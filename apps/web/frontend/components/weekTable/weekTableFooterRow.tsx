import { eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns'

import { FormattedDuration, TableCell, TableFootRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { classNameMarkDay } from './classNameMarkDay'

const WeekTableFooterFragment = graphql(`
  fragment WeekTableFooter on WorkHour {
    duration
    date
  }
`)

interface WeekTableFooterRowProps {
  interval: { start: Date; end: Date }
  workHours: FragmentType<typeof WeekTableFooterFragment>[]
}

export const WeekTableFooterRow = ({ interval, workHours: workHoursFragment }: WeekTableFooterRowProps) => {
  const workHours = useFragment(WeekTableFooterFragment, workHoursFragment)
  const sumOfDurationsOfTheWeek = workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <TableFootRow>
      <TableCell />
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
