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
  isWeekend,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { BiHome, BiLeftArrow, BiRightArrow } from 'react-icons/bi'

import CalendarIcon from './calendarIcon'

interface DayItemProps {
  day: Date
  selectedDate?: Date
  shownDate: Date
  onClick: () => void
}

const DayItem = ({ day, selectedDate, onClick, shownDate }: DayItemProps): JSX.Element => {
  const classNames = ['text-center border cursor-pointer p-0']

  if (!isSameMonth(day, shownDate)) {
    classNames.push('italic')
  }

  let title = format(day, 'do MMM yyyy')

  if (selectedDate && isSameDay(day, selectedDate)) {
    classNames.push('border-red-700')
    title = `Selected Day, ${title}`
  }

  if (isWeekend(day)) {
    classNames.push('text-green-600')
  }

  if (!isWeekend(day) && isSameMonth(day, shownDate)) {
    classNames.push('font-bold')
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

  const monthTitle = format(shownDate, 'MMM yyyy')

  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom',
    strategy: 'absolute',
    middleware: [offset(10), shift({ crossAxis: true })],
  })

  return (
    <section className={props.className}>
      <Popover className="flex justify-center">
        <Popover.Button
          ref={reference}
          aria-label="select date"
          className="flex gap-1 disabled:opacity-50"
          disabled={props.disabled ?? false}
        >
          {!props.hideLabel && <span title="Display value">{props.date?.toLocaleDateString()}</span>}
          <AiOutlineCalendar className="ml-2 h-5 w-5" title="Calendar icon" />
          {props.selectLabel && <span>select</span>}
        </Popover.Button>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-75 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-100 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-75 opacity-0"
        >
          <Popover.Panel className="absolute z-10">
            {({ close }) => (
              <section
                ref={floating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                className="w-80 rounded-xl border-2 bg-gray-200 p-2 text-sm dark:bg-slate-800 dark:text-white"
                data-testid="calendar-popover"
              >
                <header className="flex justify-between p-0 pb-2 font-bold">
                  <CalendarIcon label="Go to previous month" onClick={gotoPreviousMonth}>
                    <BiLeftArrow />
                  </CalendarIcon>
                  <div className="flex gap-2">
                    <CalendarIcon label="Go to today" onClick={goToToday}>
                      <BiHome />
                    </CalendarIcon>
                    <h2>{monthTitle}</h2>
                  </div>
                  <CalendarIcon label="Go to next month" onClick={gotoNextMonth}>
                    <BiRightArrow />
                  </CalendarIcon>
                </header>
                <div className="grid auto-cols-min grid-flow-row grid-cols-7 gap-3">
                  <div className="border-b border-gray-800 p-1 text-center">Mon</div>
                  <div className="border-b border-gray-800 p-1 text-center">Tue</div>
                  <div className="border-b border-gray-800 p-1 text-center">Wed</div>
                  <div className="border-b border-gray-800 p-1 text-center">Thu</div>
                  <div className="border-b border-gray-800 p-1 text-center">Fri</div>
                  <div className="border-b border-gray-800 p-1 text-center text-green-600">Sat</div>
                  <div className="border-b border-gray-800 p-1 text-center text-green-600">Sun</div>
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
              </section>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </section>
  )
}
