import { eachDayOfInterval, format, isToday } from 'date-fns'

import { TableHeadCell, TableHeadRow } from '@progwise/timebook-ui'

import { classNameMarkDay } from './classNameMarkDay'

interface WeekTableDateHeaderRowProps {
  interval: { start: Date; end: Date }
}

export const WeekTableDateHeaderRow = ({ interval }: WeekTableDateHeaderRowProps) => (
  <TableHeadRow className="text-lg">
    <TableHeadCell />
    <TableHeadCell />
    {eachDayOfInterval(interval).map((day) => (
      <TableHeadCell className={`${isToday(day) ? classNameMarkDay : ''} text-center`} key={day.toString()}>
        {format(day, 'EEE')}
        <br />
        {format(day, 'dd. MMM')}
      </TableHeadCell>
    ))}
    <TableHeadCell />
  </TableHeadRow>
)
