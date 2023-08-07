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

export const WeekGridFooterRow = ({ interval, workHours: workHoursFragment }: WeekTableFooterRowProps) => {
  const workHours = useFragment(WeekTableFooterFragment, workHoursFragment)
  const sumOfDurationsOfTheWeek = workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <div className="contents">
      <div className="col-span-2 self-stretch border-t" />
      {eachDayOfInterval(interval).map((day, index, array) => {
        const workHoursOfTheDay = workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day))
        const sumOfDurationsOfTheDay = workHoursOfTheDay
          .map((workHour) => workHour.duration)
          .reduce((previous, current) => previous + current, 0)

        return (
          <div className="border-t p-0 text-center text-lg" key={day.toString()}>
            <div
              className={`border-b px-0.5 pb-1 ${index === 0 ? 'rounded-bl-md border-l' : ''} ${
                index === array.length - 1 ? 'rounded-br-md border-r' : ''
              }`}
            >
              <div className={`${isToday(day) ? `${classNameMarkDay} rounded-b-lg` : ''} pt-0.5`}>
                <FormattedDuration title="" minutes={sumOfDurationsOfTheDay} />
              </div>
            </div>
          </div>
        )
      })}
      <div className="text-center text-lg font-bold">
        <FormattedDuration title="" minutes={sumOfDurationsOfTheWeek} />
      </div>
      <div />
    </div>
  )
}
