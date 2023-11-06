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
      {/* <hr className="col-span-4 -mt-2 h-0.5 bg-neutral " /> */}
      <tr className={`${isToday(props.day) ? classNameMarkDay : ''}`}>
        <td>
          {format(props.day, 'dd.MM.yyyy')} - {format(props.day, 'EEEE')}
        </td>
        <td />
        <td />
        <td>
          <FormattedDuration
            title="Total work hours of the day"
            minutes={workHours
              .map((WorkHourDuration) => WorkHourDuration.duration)
              .reduce((sum, duration) => duration + sum, 0)}
          />
        </td>
      </tr>
      {workHours.map((workHour) => (
        <tr key={workHour.id}>
          <td>{workHour.project.title}</td>
          <td>{workHour.task.title}</td>
          <td>{workHour.user?.name}</td>
          <td>
            <FormattedDuration title="Work duration" minutes={workHour.duration} />
          </td>
        </tr>
      ))}
    </>
  )
}
