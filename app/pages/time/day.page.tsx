import { DayWeekSwitch } from '../../frontend/components/dayWeekSwitchButton'
import { ProtectedPage } from '../../frontend/components/protectedPage'

import { Button } from '../../frontend/components/button/button'
import { BiChevronLeft, BiChevronRight, BiPlus } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { addDays, format, intlFormat, parse } from 'date-fns'
import Link from 'next/link'

const WeekTime = (): JSX.Element => {
  const router = useRouter()

  const urlDate = router.query.date?.toString()

  const currentDate = urlDate ? parse(urlDate, 'yyyy-MM-dd', new Date()) : new Date()
  const nextDay = addDays(currentDate, 1)
  const previousDay = addDays(currentDate, -1)
  const previousDayString = format(previousDay, 'yyyy-MM-dd')
  const nextDayString = format(nextDay, 'yyyy-MM-dd')
  const currentDayString = intlFormat(currentDate, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <ProtectedPage>
      <div className="flex flex-col items-end">
        <Button ariaLabel="Add" variant="primary">
          <BiPlus className="flex items-end text-3xl" />
        </Button>
      </div>
      <article className="timebook">
        <div className="flex gap-1">
          <Link href={`/time/day?date=${previousDayString}`}>
            <a className="rounded-l-lg bg-gray-400 px-2 py-1">
              <BiChevronLeft />
            </a>
          </Link>
          <div>{currentDayString}</div>
          <Link href={`/time/day?date=${nextDayString}`}>
            <a className="rounded-r-lg bg-gray-400 px-2 py-1">
              <BiChevronRight />
            </a>
          </Link>
        </div>

        <DayWeekSwitch selectedButton="day" />
        <h2>Your timetable for day</h2>
      </article>
    </ProtectedPage>
  )
}

export default WeekTime
