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
    {eachDayOfInterval(interval).map((day, index, array) => (
      <TableHeadCell
        className={` border-t px-0.5 pb-0 pt-1 text-center ${index === 0 ? 'border-l' : ''} ${
          index === array.length - 1 ? 'border-r' : ''
        }`}
        key={day.toString()}
      >
        <div className={`${isToday(day) ? `${classNameMarkDay} rounded-t-lg ` : ''}`}>
          {format(day, 'EEE')}
          <br />
          <span className="text-base font-normal">{format(day, 'dd. MMM')}</span>
        </div>
      </TableHeadCell>
    ))}
    <TableHeadCell />
    <TableHeadCell />
  </TableHeadRow>
)
