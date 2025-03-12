import { autoUpdate, offset, shift, useFloating } from '@floating-ui/react-dom'
import { Popover, Transition } from '@headlessui/react'
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { useEffect, useState } from 'react'
import { FaRegCalendar } from 'react-icons/fa6'

import { CalendarPanel } from './calendarPanel'

export interface CalendarSelectorProps {
  onDateChange: (newDate: Date) => void
  date?: Date
  selectLabel?: boolean
  hideLabel?: boolean
  className?: string
  disabled?: boolean
  alwaysOpen?: boolean
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

  const { floatingStyles, refs } = useFloating({
    middleware: [offset(10), shift({ crossAxis: true })],
    whileElementsMounted: autoUpdate,
  })

  return (
    <section>
      {!props.alwaysOpen && (
        <Popover>
          <Popover.Button
            ref={refs.setReference}
            aria-label="select date"
            className={`btn ${!props.selectLabel && 'btn-square'} ${props.className}`}
            disabled={props.disabled}
          >
            <div className="flex items-center gap-1">
              {!props.hideLabel && <span title="Display value">{props.date?.toLocaleDateString()}</span>}
              <FaRegCalendar />
              {props.selectLabel && 'Select'}
            </div>
          </Popover.Button>

          <div style={floatingStyles} ref={refs.setFloating} className="z-40">
            <Transition
              className="rounded-box border border-base-content/50 bg-base-200 p-2 shadow-md"
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-75 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-100 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-75 opacity-0"
              data-testid="calendar-popover"
              show={props.alwaysOpen}
            >
              <Popover.Panel>
                {({ close }) => (
                  <CalendarPanel
                    shownDate={shownDate}
                    daysToRender={daysToRender}
                    selectedDate={props.date}
                    onDateChange={(day) => {
                      props.onDateChange(day)
                      close()
                    }}
                    gotoPreviousMonth={gotoPreviousMonth}
                    gotoNextMonth={gotoNextMonth}
                    goToToday={goToToday}
                  />
                )}
              </Popover.Panel>
            </Transition>
          </div>
        </Popover>
      )}
      {props.alwaysOpen && (
        <div className="rounded-box border border-base-content/50 bg-base-200 p-2 shadow-md">
          <CalendarPanel
            shownDate={shownDate}
            daysToRender={daysToRender}
            selectedDate={props.date}
            onDateChange={props.onDateChange}
            gotoPreviousMonth={gotoPreviousMonth}
            gotoNextMonth={gotoNextMonth}
            goToToday={goToToday}
          />
        </div>
      )}
    </section>
  )
}
