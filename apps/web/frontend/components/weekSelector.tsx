import { Transition } from '@headlessui/react'
import { endOfWeek, format, getWeek, getYear, isThisWeek, startOfWeek, nextMonday, previousMonday } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { DateRangePicker, RangeKeyDict } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { AiOutlineCheck } from 'react-icons/ai'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import { BsCalendarCheck, BsCalendarDate } from 'react-icons/bs'

import { Button } from '@progwise/timebook-ui'

interface WeekSelectorProps {
  value: Date
  onChange: (newDay: Date) => void
}

export const WeekSelector = ({ value, onChange }: WeekSelectorProps) => {
  const [selectedWeek, setSelectedWeek] = useState({
    startDate: startOfWeek(value, { locale: enGB }),
    endDate: endOfWeek(value, { locale: enGB }),
    year: getYear(value),
    key: 'selection',
  })
  const selectedCalendarWeek = getWeek(selectedWeek.startDate, { locale: enGB })
  const isCurrentWeek = isThisWeek(selectedWeek.startDate, { weekStartsOn: 1 })
  const [isCalendarDisplayed, setIsCalendarDisplayed] = useState(false)

  const getDaysOfWeek = (date: Date) => {
    const monday = startOfWeek(date, { locale: enGB })
    const sunday = endOfWeek(date, { locale: enGB })
    const year = getYear(monday)
    setSelectedWeek({ startDate: monday, endDate: sunday, year, key: 'selection' })
    onChange(monday)
  }
  const handleWeekSelect = (ranges: RangeKeyDict) => {
    const { startDate } = ranges.selection
    getDaysOfWeek(startDate ?? value)
  }

  return (
    <div className="static">
      <div className="flex flex-col items-center">
        <div className="flex gap-5">
          <BiLeftArrow
            className="cursor-pointer fill-cyan-400 drop-shadow-lg hover:fill-cyan-600 "
            size="3em"
            onClick={() => getDaysOfWeek(previousMonday(selectedWeek.startDate))}
          />
          <div className="flex w-40 flex-col items-center">
            <span className="font-bold">
              Week {selectedCalendarWeek}/{selectedWeek.year}
            </span>
            <span className="font-medium">
              {format(selectedWeek.startDate, 'dd.MM')} - {format(selectedWeek.endDate, 'dd.MM.yyyy')}
              {isCurrentWeek && '*'}
            </span>
          </div>
          <BiRightArrow
            className="cursor-pointer fill-cyan-400 drop-shadow-lg hover:fill-cyan-600 "
            size="3em"
            onClick={() => getDaysOfWeek(nextMonday(selectedWeek.startDate))}
          />
        </div>
        <div className="flex gap-5 text-sm text-gray-400">
          <div className="flex cursor-pointer items-center gap-1" onClick={() => getDaysOfWeek(new Date())}>
            <BsCalendarCheck className="stroke-1 " size="1.4em" />
            today
          </div>
          <div className="flex cursor-pointer items-center gap-1" onClick={() => setIsCalendarDisplayed(true)}>
            <BsCalendarDate className="stroke-1 " size="1.4em" />
            select
          </div>
        </div>
      </div>

      <Transition
        show={isCalendarDisplayed}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-75 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-100 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-75 opacity-0"
      >
        <ClickAwayListener onClickAway={() => setIsCalendarDisplayed(false)}>
          <div className="absolute left-[50%] translate-x-[-50%] bg-white drop-shadow-lg">
            <DateRangePicker
              ranges={[selectedWeek]}
              onChange={handleWeekSelect}
              moveRangeOnFirstSelection={false}
              direction="horizontal"
              showMonthAndYearPickers
              preventSnapRefocus
              showPreview={false}
              showDateDisplay={false}
              locale={enGB}
            />
            <div className="flex justify-end">
              <Button variant="tertiary" onClick={() => setIsCalendarDisplayed(false)}>
                <AiOutlineCheck />
              </Button>
            </div>
          </div>
        </ClickAwayListener>
      </Transition>
    </div>
  )
}
