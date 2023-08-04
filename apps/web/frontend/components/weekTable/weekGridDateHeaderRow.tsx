import { eachDayOfInterval, format, isToday } from 'date-fns'

import { TableHeadCell, TableHeadRow } from '@progwise/timebook-ui'

import { classNameMarkDay } from './classNameMarkDay'

interface WeekTableDateHeaderRowProps {
  interval: { start: Date; end: Date }
}

export const WeekGridDateHeaderRow = ({ interval }: WeekTableDateHeaderRowProps) => (
  <div className="contents">
    <div />
    <div />
    {eachDayOfInterval(interval).map((day, index, array) => (
      <div
        className={`border-t px-0.5 pt-1 ${index === 0 ? 'rounded-tl-md border-l' : ''} ${
          index === array.length - 1 ? 'rounded-tr-md border-r' : ''
        } text-center text-lg`}
        key={day.toString()}
      >
        <div className={`${isToday(day) ? `${classNameMarkDay} rounded-t-lg` : ''} px-5 font-bold`}>
          {format(day, 'EEE')}
          <br />
          <span className="whitespace-nowrap text-base font-normal">{format(day, 'dd. MMM')}</span>
        </div>
      </div>
    ))}
    <div />
    <div />
  </div>
)
