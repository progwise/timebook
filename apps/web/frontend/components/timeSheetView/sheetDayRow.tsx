import { format, isToday } from 'date-fns'

import { FormattedDuration } from '@progwise/timebook-ui'

import { WorkHourFragment } from '../../generated/graphql'

interface SheetDayRowProps {
  day: Date
  workHours: WorkHourFragment[]
}

export const SheetDayRow = (props: SheetDayRowProps): JSX.Element => {
  const classNameMarkDay = 'bg-slate-300 dark:bg-gray-900'

  return (
    <>
      <hr className="col-span-4 -mt-2 h-0.5 bg-gray-700 " />
      <strong className={`col-span-3 ${isToday(props.day) ? classNameMarkDay : ''}`}>
        {format(props.day, 'dd.MM.yyyy')} - {format(props.day, 'EEEE')}
      </strong>
      <FormattedDuration
        title="Total work hours of the day"
        minutes={props.workHours
          .map((WorkHourDuration) => WorkHourDuration.duration)
          .reduce((sum, duration) => duration + sum, 0)}
      />

      {props.workHours.map((workHour) => (
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
