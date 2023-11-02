import { format, isToday } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

export const SheetDayRowFragment = graphql(`
  fragment SheetDayRow on WorkHour {
    id
    duration
    project {
      title
    }
    task {
      title
    }
    user {
      name
    }
  }
`)

interface SheetDayRowProps {
  day: Date
  workHours: FragmentType<typeof SheetDayRowFragment>[]
}

export const SheetDayRow = (props: SheetDayRowProps): JSX.Element => {
  const workHours = useFragment(SheetDayRowFragment, props.workHours)
  const classNameMarkDay = 'bg-base-300'

  return (
    <>
      <hr className="col-span-4 -mt-2 h-0.5 bg-neutral " />
      <strong className={`col-span-4 flex justify-between ${isToday(props.day) ? classNameMarkDay : ''}`}>
        {format(props.day, 'dd.MM.yyyy')} - {format(props.day, 'EEEE')}
        <FormattedDuration
          title="Total work hours of the day"
          minutes={workHours
            .map((WorkHourDuration) => WorkHourDuration.duration)
            .reduce((sum, duration) => duration + sum, 0)}
        />
      </strong>
      {workHours.map((workHour) => (
        <article key={workHour.id} className="contents">
          <h1>{workHour.project.title}</h1>
          <h1>{workHour.task.title}</h1>
          <span>{workHour.user?.name}</span>
          <FormattedDuration title="Work duration" minutes={workHour.duration} />
        </article>
      ))}
    </>
  )
}
