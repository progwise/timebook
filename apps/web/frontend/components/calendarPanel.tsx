import { format, getDate, isSameDay, isSameMonth, isThisMonth, isToday, isWeekend } from 'date-fns'
import { FaAngleLeft, FaAngleRight, FaArrowTurnUp } from 'react-icons/fa6'

interface CalendarPanelProps {
  shownDate: Date
  daysToRender: Date[]
  selectedDate?: Date
  onDateChange: (newDate: Date) => void
  gotoPreviousMonth: () => void
  gotoNextMonth: () => void
  goToToday: () => void
}

interface DayItemProps {
  day: Date
  selectedDate?: Date
  shownDate: Date
  onClick: () => void
}
const DayItem = ({ day, selectedDate, onClick, shownDate }: DayItemProps): JSX.Element => {
  const classNames = ['btn btn-sm']

  if (!isSameMonth(day, shownDate)) {
    classNames.push('opacity-50')
  }

  let title = format(day, 'do MMM yyyy')

  if (isWeekend(day)) {
    classNames.push('opacity-50')
  }

  if (selectedDate && isSameDay(day, selectedDate)) {
    classNames.push('btn-primary')
    title = `Selected Day, ${title}`
  } else if (isToday(day)) {
    classNames.push('btn-neutral')
  } else {
    classNames.push('btn-ghost')
  }

  return (
    <button title={title} className={classNames.join(' ')} onClick={onClick} type="button">
      {getDate(day)}
    </button>
  )
}

export const CalendarPanel = ({
  shownDate,
  daysToRender,
  selectedDate,
  onDateChange,
  gotoPreviousMonth,
  gotoNextMonth,
  goToToday,
}: CalendarPanelProps): JSX.Element => {
  const monthTitle = format(shownDate, 'MMMM yyyy')
  const currentDate = new Date()
  const currentMonth = format(currentDate, 'MMMM yyyy')

  return (
    <>
      <header className="mb-1 flex items-center justify-between font-bold">
        <button
          className="btn btn-ghost btn-xs"
          onClick={gotoPreviousMonth}
          type="button"
          aria-label="go to previous month"
        >
          <FaAngleLeft />
        </button>
        <div className="text-lg" role="heading">
          {monthTitle}
        </div>
        <button className="btn btn-ghost btn-xs" onClick={gotoNextMonth} type="button" aria-label="go to next month">
          <FaAngleRight />
        </button>
      </header>
      <div className="grid grid-cols-7 gap-1 text-center">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div className="opacity-50">Sat</div>
        <div className="opacity-50">Sun</div>
        <div className="divider col-span-7 -my-1" />
        {daysToRender.map((day) => (
          <DayItem
            key={day.toString()}
            day={day}
            selectedDate={selectedDate}
            shownDate={shownDate}
            onClick={() => onDateChange(day)}
          />
        ))}
      </div>
      {!isThisMonth(shownDate) && (
        <>
          <div className="divider col-span-7 -my-1" />
          <button className="btn btn-ghost no-animation btn-xs btn-block" onClick={goToToday} aria-label="go to today">
            Back to {currentMonth}
            <FaArrowTurnUp />
          </button>
        </>
      )}
    </>
  )
}
