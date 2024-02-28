import { autoUpdate, offset, shift, useFloating } from '@floating-ui/react-dom'
import { Popover, Transition } from '@headlessui/react'
import {
  addYears,
  eachMonthOfInterval,
  endOfYear,
  format,
  isSameMonth,
  isThisMonth,
  isThisYear,
  startOfYear,
  subYears,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleRight, FaArrowTurnUp, FaRegCalendar } from 'react-icons/fa6'

interface MonthItemProps {
  month: Date
  selectedDate?: Date
  onClick: () => void
}

const MonthItem = ({ month, selectedDate, onClick }: MonthItemProps): JSX.Element => {
  const classNames = ['btn btn-sm']

  let title = format(month, 'yyyy')

  if (selectedDate && isSameMonth(month, selectedDate)) {
    classNames.push('btn-primary')
    title = `Selected Month, ${title}`
  } else if (isThisMonth(month)) {
    classNames.push('btn-neutral')
  } else {
    classNames.push('btn-ghost')
  }

  return (
    <button title={title} className={classNames.join(' ')} onClick={onClick} type="button">
      {format(month, 'MMM')}
    </button>
  )
}

export interface CalendarMonthSelectorProps {
  onDateChange: (newDate: Date) => void
  date?: Date
  selectLabel?: boolean
  className?: string
  disabled?: boolean
}

export const CalendarMonthSelector = (props: CalendarMonthSelectorProps): JSX.Element => {
  const [shownYear, setShownYear] = useState(props.date ?? new Date())

  useEffect(() => {
    setShownYear(props.date ?? new Date())
  }, [props.date, setShownYear])

  const goToToday = () => setShownYear(new Date())

  const yearStart = startOfYear(shownYear)
  const yearEnd = endOfYear(shownYear)
  const monthsToRender = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  const gotoPreviousYear = () => {
    setShownYear((oldDate) => subYears(oldDate, 1))
  }

  const gotoNextYear = () => {
    setShownYear((oldDate) => addYears(oldDate, 1))
  }

  const yearTitle = format(shownYear, 'yyyy')

  const { floatingStyles, refs } = useFloating({
    strategy: 'fixed',
    middleware: [offset(10), shift({ crossAxis: true })],
    whileElementsMounted: autoUpdate,
  })

  const currentMonth = new Date()
  const currentYear = format(currentMonth, 'yyyy')

  return (
    <section className={props.className}>
      <Popover>
        <Popover.Button
          ref={refs.setReference}
          aria-label="select month"
          className="btn no-animation btn-md min-w-40"
          disabled={props.disabled}
        >
          <FaRegCalendar />
          <span>{props.date && format(props.date, 'MMMM yyyy')}</span>
        </Popover.Button>
        <Transition
          className="z-40 rounded-box border border-base-content/50 bg-base-200 p-2 shadow-md"
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-75 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-100 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-75 opacity-0"
          style={floatingStyles}
          ref={refs.setFloating}
        >
          <Popover.Panel>
            {({ close }) => (
              <>
                <header className="flex items-center justify-between font-bold">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={gotoPreviousYear}
                    type="button"
                    aria-label="go to previous year"
                  >
                    <FaAngleLeft />
                  </button>
                  <div className="text-lg" role="heading">
                    {yearTitle}
                  </div>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={gotoNextYear}
                    type="button"
                    aria-label="go to next year"
                  >
                    <FaAngleRight />
                  </button>
                </header>
                <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                  {monthsToRender.map((month) => (
                    <MonthItem
                      key={month.toString()}
                      month={month}
                      selectedDate={props.date}
                      onClick={() => {
                        props.onDateChange(month)
                        close()
                      }}
                    />
                  ))}
                </div>
                {!isThisYear(shownYear) && (
                  <>
                    <div className="divider col-span-4 -my-1" />
                    <button
                      className="btn btn-ghost no-animation btn-xs btn-block"
                      onClick={goToToday}
                      aria-label="go to today"
                    >
                      Back to {currentYear}
                      <FaArrowTurnUp />
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
