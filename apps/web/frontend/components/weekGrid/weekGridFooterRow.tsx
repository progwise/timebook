import { eachDayOfInterval, isSameDay, parseISO } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const WeekGridFooterFragment = graphql(`
  fragment WeekGridFooter on WorkHourOfDay {
    date
    workHour {
      duration
    }
  }
`)

interface WeekGridFooterRowProps {
  interval: { start: Date; end: Date }
  workHours: FragmentType<typeof WeekGridFooterFragment>[]
}

export const WeekGridFooterRow = ({ interval, workHours: workHoursFragment }: WeekGridFooterRowProps) => {
  const workHours = useFragment(WeekGridFooterFragment, workHoursFragment)
  const sumOfDurationsOfTheWeek = workHours
    .map((workHour) => workHour.workHour?.duration ?? 0)
    .reduce((previous, current) => previous + current, 0)

  return (
    <div className="contents text-center text-lg">
      <div className="col-span-2 col-start-1" />
      {eachDayOfInterval(interval).map((day) => {
        const workHoursOfTheDay = workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day))
        const sumOfDurationsOfTheDay = workHoursOfTheDay
          .map((workHour) => workHour.workHour?.duration ?? 0)
          .reduce((previous, current) => previous + current, 0)

        return (
          <div
            className="z-10 py-3 text-base-content [&:nth-child(2)]:rounded-bl-box [&:nth-last-child(2)]:rounded-br-box"
            key={day.toString()}
          >
            <FormattedDuration title="" minutes={sumOfDurationsOfTheDay} />
          </div>
        )
      })}
      <div className="px-2 text-right font-bold">
        <FormattedDuration title="" minutes={sumOfDurationsOfTheWeek} />
      </div>
    </div>
  )
}
