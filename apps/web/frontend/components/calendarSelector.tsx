import { offset, shift, useFloating } from '@floating-ui/react-dom'
import { Popover, Transition } from '@headlessui/react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isSameDay,
  isSameMonth,
  isThisMonth,
  isToday,
  isWeekend,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { BiCalendarAlt, BiCaretLeft, BiLeftArrow, BiRightArrow } from 'react-icons/bi'

interface DayItemProps {
  day: Date
  selectedDate?: Date
  shownDate: Date
  onClick: () => void
}

const DayItem = ({ day, selectedDate, onClick, shownDate }: DayItemProps): JSX.Element => {
  const classNames = ['btn btn-sm cursor-pointer']

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

export interface CalendarSelectorProps {
  onDateChange: (newDate: Date) => void
  date?: Date
  selectLabel?: boolean
  hideLabel?: boolean
  className?: string
  disabled?: boolean
}

export const CalendarSelector = (props: CalendarSelectorProps): JSX.Element => {
  const [shownDate, setShownDate] = useState(props.date ?? new Date())

  useEffect(() => {
    setShownDate(props.date ?? new Date())
  }, [props.date, setShownDate])

  const goToToday = () => setShownDate(new Date())

  const monthStart = startOfMonth(shownDate)
  const monthEnd = endOfMonth(shownDate)
  const startFirstWeek = startOfWeek(monthStart)
  const endLastWeek = endOfWeek(monthEnd)
  const daysToRender = eachDayOfInterval({ start: startFirstWeek, end: endLastWeek })

  const gotoPreviousMonth = () => {
    setShownDate((oldDate) => subMonths(oldDate, 1))
  }

  const gotoNextMonth = () => {
    setShownDate((oldDate) => addMonths(oldDate, 1))
  }

  const monthTitle = format(shownDate, 'MMMM yyyy')

  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    strategy: 'absolute',
    middleware: [offset(10), shift({ crossAxis: true })],
  })

  const currentDate = new Date()
  const currentMonth = format(currentDate, 'MMMM yyyy')

  return (
    <section className={props.className}>
      <Popover className="flex justify-center">
        <Popover.Button
          ref={reference}
          aria-label="select date"
          className="btn no-animation btn-sm"
          disabled={props.disabled ?? false}
        >
          {!props.hideLabel && <span title="Display value">{props.date?.toLocaleDateString()}</span>}
          <BiCalendarAlt title="Calendar icon" />
          {props.selectLabel && <span>select</span>}
        </Popover.Button>

        <Transition
          className="rounded-box z-40 border bg-base-200 p-2 shadow-md"
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-75 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-100 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-75 opacity-0"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          ref={floating}
          data-testid="calendar-popover"
        >
          <Popover.Panel className="bg-base-200">
            {({ close }) => (
              <>
                <header className="flex justify-between font-bold">
                  <button
                    className="btn btn-ghost btn-xs self-center"
                    onClick={gotoPreviousMonth}
                    type="button"
                    aria-label="go to previous month"
                  >
                    <BiLeftArrow />
                  </button>
                  <div className="flex gap-2 text-lg">
                    <div className="self-center" role="heading">
                      {monthTitle}
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-xs self-center"
                    onClick={gotoNextMonth}
                    type="button"
                    aria-label="go to next month"
                  >
                    <BiRightArrow />
                  </button>
                </header>
                <div className="grid auto-cols-min grid-flow-row grid-cols-7 gap-2 pt-2 text-center text-base">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div className="opacity-50">Sat</div>
                  <div className="opacity-50">Sun</div>
                  <div className="divider col-span-7 -my-2" />
                  {daysToRender.map((day) => (
                    <DayItem
                      key={day.toString()}
                      day={day}
                      selectedDate={props.date}
                      shownDate={shownDate}
                      onClick={() => {
                        props.onDateChange(day)
                        close()
                      }}
                    />
                  ))}
                </div>
                {!isThisMonth(shownDate) && (
                  <>
                    <hr className="col-span-7 mt-2 h-0.5 bg-neutral opacity-50" />
                    <button
                      className="btn btn-ghost no-animation btn-xs btn-block mt-1"
                      onClick={goToToday}
                      aria-label="go to today"
                    >
                      <BiCaretLeft />
                      Back to {currentMonth}
                    </button>
                  </>
                )}
              </>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </section>
  )
}
