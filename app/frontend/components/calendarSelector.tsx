import { Popover, Transition } from '@headlessui/react'
import calendarIcon from '../assets/calendarIcon.svg'
import backIcon from '../assets/backIcon.svg'
import forwardIcon from '../assets/forwardIcon.svg'
import home from '../assets/home.svg'
import { useState } from 'react'
import CalendarIcon from './calendarIcon'
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

  return (
    <section className={props.className}>
      <Popover className="flex justify-center">
        <Popover.Button>
          <CalendarIcon src={calendarIcon} childPosition="right">
            {props.hideLabel ? undefined : (
              <span className="ml-2" title="Display value">
                {selectedDate.toLocaleDateString()}
              </span>
            )}
          </CalendarIcon>
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
              <section className="text-sm absolute border-2 bg-gray-200 w-80 rounded-xl p-2 ">
                <header className="flex justify-between p-0 pb-2 font-bold">
                  <CalendarIcon title="Goto previous month" onClick={gotoPreviousMonth} src={backIcon} size={20} />
                  <CalendarIcon title="Goto today" onClick={goToToday} src={home} size={20}>
                    <h2 className="ml-2">{monthTitle}</h2>
                  </CalendarIcon>
                  <CalendarIcon title="Goto next month" onClick={gotoNextMonth} src={forwardIcon} size={20} />
                </header>
                <div className="grid grid-cols-7 grid-flow-row gap-3 auto-cols-min">
                  <div className="p-1 text-center border-gray-800 border-b">Mon</div>
                  <div className="p-1 text-center border-gray-800 border-b">Tue</div>
                  <div className="p-1 text-center border-gray-800 border-b">Wed</div>
                  <div className="p-1 text-center border-gray-800 border-b">Thu</div>
                  <div className="p-1 text-center border-gray-800 border-b">Fri</div>
                  <div className="p-1 text-center border-gray-800 border-b text-green-600">Sat</div>
                  <div className="p-1 text-center border-gray-800 border-b text-green-600">Sun</div>
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
