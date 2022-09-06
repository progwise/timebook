import { Popover, Transition } from '@headlessui/react'
import { AiOutlineCalendar } from 'react-icons/ai'
import backIcon from '../assets/backIcon.svg'
import forwardIcon from '../assets/forwardIcon.svg'
import home from '../assets/home.svg'
import { useState } from 'react'
import CalendarIcon from './calendarIcon'
import { offset, shift, useFloating } from '@floating-ui/react-dom'
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

interface DayItemProps {
  day: Date
  selectedDate: Date
  onClick: () => void
}

const DayItem = ({ day, selectedDate, onClick }: DayItemProps): JSX.Element => {
  const classNames = ['text-center border cursor-pointer p-0']

  if (!isSameMonth(day, selectedDate)) {
    classNames.push('italic')
  }

  let title = format(day, 'do MMM yyyy')

  if (isSameDay(day, selectedDate)) {
    classNames.push('border-red-700')
    title = `Selected Day, ${title}`
  }

  if (isWeekend(day)) {
    classNames.push('text-green-600')
  }

  if (!isWeekend(day) && isSameMonth(day, selectedDate)) {
    classNames.push('font-bold')
  }

  return (
    <button title={title} className={classNames.join(' ')} onClick={onClick} type="button">
      {getDate(day)}
    </button>
  )
}

export interface CalendarSelectorProps {
  onSelectedDateChange?: (newDate: Date) => void
  hideLabel?: boolean
  className?: string
  disabled?: boolean
}

export const CalendarSelector = (props: CalendarSelectorProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const selectNewDate = (targetDate: Date): void => {
    setSelectedDate(targetDate)
    props.onSelectedDateChange?.(targetDate)
  }

  const goToToday = () => setSelectedDate(new Date())

  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const startFirstWeek = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endLastWeek = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const daysToRender = eachDayOfInterval({ start: startFirstWeek, end: endLastWeek })

  const gotoPreviousMonth = () => {
    setSelectedDate((oldDate) => subMonths(oldDate, 1))
  }

  const gotoNextMonth = () => {
    setSelectedDate((oldDate) => addMonths(oldDate, 1))
  }

  const monthTitle = format(selectedDate, 'MMM yyyy')

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
          className="flex disabled:opacity-50"
          disabled={props.disabled ?? false}
        >
          {!props.hideLabel && <span title="Display value">{selectedDate.toLocaleDateString()}</span>}
          <AiOutlineCalendar className="ml-2" size="1.3em" title="Calendar icon" />
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
                className="absolute w-80 rounded-xl border-2 bg-gray-200 p-2 text-sm dark:bg-slate-800 dark:text-white"
                data-testid="calendar-popover"
              >
                <header className="flex justify-between p-0 pb-2 font-bold">
                  <CalendarIcon title="Goto previous month" onClick={gotoPreviousMonth} src={backIcon} size={20} />
                  <CalendarIcon title="Goto today" onClick={goToToday} src={home} size={20}>
                    <h2 className="ml-2">{monthTitle}</h2>
                  </CalendarIcon>
                  <CalendarIcon title="Goto next month" onClick={gotoNextMonth} src={forwardIcon} size={20} />
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
                      selectedDate={selectedDate}
                      onClick={() => {
                        selectNewDate(day)
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
