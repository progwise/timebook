import { eachDayOfInterval, format, isToday } from 'date-fns'

import { classNameMarkDay } from './classNameMarkDay'

interface WeekGridDateHeaderRowProps {
  interval: { start: Date; end: Date }
}

export const WeekGridDateHeaderRow = ({ interval }: WeekGridDateHeaderRowProps) => (
  <div className="contents">
    <div />
    <div />
    {eachDayOfInterval(interval).map((day) => (
      <div className="px-1 pt-1 text-center text-xl" key={day.toString()}>
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
