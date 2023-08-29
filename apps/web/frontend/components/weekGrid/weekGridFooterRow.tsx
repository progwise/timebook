import { eachDayOfInterval, isSameDay, parseISO } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const WeekGridFooterFragment = graphql(`
  fragment WeekGridFooter on WorkHour {
    duration
    date
  }
`)

interface WeekGridFooterRowProps {
  interval: { start: Date; end: Date }
  workHours: FragmentType<typeof WeekGridFooterFragment>[]
}

export const WeekGridFooterRow = ({ interval, workHours: workHoursFragment }: WeekGridFooterRowProps) => {
  const workHours = useFragment(WeekGridFooterFragment, workHoursFragment)
  const sumOfDurationsOfTheWeek = workHours
    .map((workHour) => workHour.duration)
    .reduce((previous, current) => previous + current, 0)

  return (
    <div className="contents">
      <div className="col-span-2 self-stretch" />
      {eachDayOfInterval(interval).map((day) => {
        const workHoursOfTheDay = workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day))
        const sumOfDurationsOfTheDay = workHoursOfTheDay
          .map((workHour) => workHour.duration)
          .reduce((previous, current) => previous + current, 0)

        return (
          <div className="z-10 self-stretch p-0 text-center text-lg" key={day.toString()}>
            <div className="h-full px-1 pb-1">
              <div className="pt-0.5">
                <FormattedDuration title="" minutes={sumOfDurationsOfTheDay} />
              </div>
            </div>
          </div>
        )
      })}
      <div className="self-stretch text-center text-lg font-bold">
        <FormattedDuration title="" minutes={sumOfDurationsOfTheWeek} />
      </div>
      <div className="self-stretch" />
    </div>
  )
}
