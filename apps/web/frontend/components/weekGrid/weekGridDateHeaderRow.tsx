import { eachDayOfInterval, format } from 'date-fns'

interface WeekGridDateHeaderRowProps {
  interval: { start: Date; end: Date }
}

export const WeekGridDateHeaderRow = ({ interval }: WeekGridDateHeaderRowProps) => (
  <div className="contents">
    <div className="col-span-2" />
    {eachDayOfInterval(interval).map((day) => (
      <div
        className="z-10 px-6 pt-1 text-center text-xl font-bold text-base-content [&:nth-child(2)]:rounded-tl-box [&:nth-last-child(2)]:rounded-tr-box"
        key={day.toString()}
      >
        <div className="relative z-50">
          {format(day, 'EEE')}
          <br />
          <span className="whitespace-nowrap text-base font-normal">{format(day, 'dd. MMM')}</span>
        </div>
      </div>
    ))}
    <div className="col-span-2" />
  </div>
)
