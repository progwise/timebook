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
    <TableFootRow className="border-t text-lg">
      <TableCell />
      <TableCell />
      {eachDayOfInterval(interval).map((day, index, array) => {
        const workHoursOfTheDay = workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day))
        const sumOfDurationsOfTheDay = workHoursOfTheDay
          .map((workHour) => workHour.duration)
          .reduce((previous, current) => previous + current, 0)

        return (
          <TableCell
            className={` border-b px-0.5 pt-0 pb-0.5 text-center ${index === 0 ? 'border-l' : ''} ${
              index === array.length - 1 ? 'border-r' : ''
            }`}
            key={day.toString()}
          >
            <div className={`${isToday(day) ? `${classNameMarkDay} rounded-b-lg` : ''} `}>
              <FormattedDuration title="" minutes={sumOfDurationsOfTheDay} />
            </div>
          </TableCell>
        )
      })}
      <TableCell className="text-center font-bold">
        <FormattedDuration title="" minutes={sumOfDurationsOfTheWeek} />
      </TableCell>
      <TableCell />
    </TableFootRow>
  )
}
