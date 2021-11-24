import { Popover, Transition } from '@headlessui/react'
import calendarIcon from '../assets/calendarIcon.svg'
import backIcon from '../assets/backIcon.svg'
import forwardIcon from '../assets/forwardIcon.svg'
import home from '../assets/home.svg'
import { useRef, useState } from 'react'
import CalendarIcon from './calendarIcon'

export const getMonthTitle = (day: Date): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthName = monthNames[day.getMonth()]
  return `${monthName} ${day.getFullYear()}`
}

export const getDayTitle = (day: Date): string => {
  const monthTitle = getMonthTitle(day)
  const dayString = day.getDate()
  return `${dayString} ${monthTitle}`
}

const DayItem = (props: { day: Date; selectedDate: Date; onClick: (day: Date) => void }): JSX.Element => {
  const day = props.day
  const selectedDate = props.selectedDate
  const dayString = day.getDate()

  const classNames = new Array<string>()

  classNames.push('text-center border cursor-pointer p-0')

  const isSelectedYearAndMonth =
    selectedDate.getFullYear() === day.getFullYear() && selectedDate.getMonth() === day.getMonth()

  if (!isSelectedYearAndMonth) {
    classNames.push('italic')
  }

  let title = getDayTitle(day)

  if (selectedDate.toLocaleDateString() === day.toLocaleDateString()) {
    classNames.push('border-red-700')
    title = `Selected Day, ${title}`
  }

  if (day.getDay() === 6 || day.getDay() === 0) {
    classNames.push('text-green-600')
  } else if (isSelectedYearAndMonth) {
    classNames.push('font-bold')
  }

  return (
    <button title={title} className={classNames.join(' ')} onClick={() => props.onClick(day)} type="button">
      {dayString}
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

  const componentNode = useRef<HTMLElement>(null)

  const selectNewDate = (targetDate: Date): void => {
    setSelectedDate(targetDate)
    props.onSelectedDateChange?.(targetDate)
  }

  const goToToday = () => setSelectedDate(new Date())

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const firstDayOfSelectedMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)

  const getPreviousMonday = (startDate: Date): Date => {
    const dayOfWeek = startDate.getDay()
    if (dayOfWeek === 1) {
      return startDate
    }

    const newDate = startDate
    if (dayOfWeek === 0) {
      newDate.setDate(startDate.getDate() - 6)
    } else {
      newDate.setDate(startDate.getDate() - (startDate.getDay() - 1))
    }

    return newDate
  }

  const daysToRender = new Array<Date>()
  const start = getPreviousMonday(firstDayOfSelectedMonth)
  for (let index = 0; index < 35; index++) {
    const dayToAdd = new Date(start.getTime() + index * 24 * 60 * 60 * 1000)
    daysToRender.push(dayToAdd)
  }

  const gotoPreviousMonth = () => {
    setSelectedDate((oldDate) => new Date(oldDate.getFullYear(), oldDate.getMonth() - 1, 1))
  }

  const gotoNextMonth = () => {
    setSelectedDate((oldDate) => new Date(oldDate.getFullYear(), oldDate.getMonth() + 1, 1))
  }

  const monthTitle = getMonthTitle(selectedDate)

  return (
    <section className={props.className} ref={componentNode}>
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
              <section className="text-sm absolute border-2 bg-gray-200 w-80 h-64 rounded-xl p-2 ">
                <header className="flex justify-between p-0 pb-2 font-bold">
                  <CalendarIcon title="Goto previous month" onClick={gotoPreviousMonth} src={backIcon} size={20} />
                  <CalendarIcon title="Goto today" onClick={goToToday} src={home} size={20}>
                    <h2 className="ml-2">{monthTitle}</h2>
                  </CalendarIcon>
                  <CalendarIcon title="Goto next month" onClick={gotoNextMonth} src={forwardIcon} size={20} />
                </header>
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((weekDay, index) => {
                    const classNames = ['p-1 text-center border-gray-800 border-b']
                    if (index > 4) {
                      classNames.push('text-green-600')
                    }

                    return (
                      <div className={classNames.join(' ')} key={index}>
                        {weekDay}
                      </div>
                    )
                  })}
                  {daysToRender.map((day, index) => (
                    <DayItem
                      key={index}
                      day={day}
                      selectedDate={selectedDate}
                      onClick={(date) => {
                        selectNewDate(date)
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
