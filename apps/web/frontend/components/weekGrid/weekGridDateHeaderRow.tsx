import { eachDayOfInterval, format } from 'date-fns'

interface WeekGridDateHeaderRowProps {
  interval: { start: Date; end: Date }
}

export const WeekGridDateHeaderRow = ({ interval }: WeekGridDateHeaderRowProps) => (
  <div className="contents">
    <div />
    <div />
    {eachDayOfInterval(interval).map((day) => (
      <div className="z-10 px-6 pt-1 text-center text-xl font-bold" key={day.toString()}>
        {format(day, 'EEE')}
        <br />
        <span className="whitespace-nowrap text-base font-normal">{format(day, 'dd. MMM')}</span>
      </div>
    ))}
    <div />
    <div />
  </div>
)
