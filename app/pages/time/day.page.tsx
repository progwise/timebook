import { DayWeekSwitch } from '../../frontend/components/dayWeekSwitchButton'
import { ProtectedPage } from '../../frontend/components/protectedPage'

import { Button } from '../../frontend/components/button/button'
import { BiPlus } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { addDays, format, parse } from 'date-fns'
import Link from 'next/link'

const WeekTime = (): JSX.Element => {
  const router = useRouter()

  const urlDate = router.query.date?.toString()

  const currentDate = urlDate ? parse(urlDate, 'yyyy-MM-dd', new Date()) : new Date()
  const nextDay = addDays(currentDate, 1)
  const previousDay = addDays(currentDate, -1)
  const previousDayString = format(previousDay, 'yyyy-MM-dd')
  const nextDayString = format(nextDay, 'yyyy-MM-dd')
  const CurrentDayString = format(currentDate, 'iii MM-dd')
  return (
    <ProtectedPage>
      <div className="flex flex-col items-end">
        <Button ariaLabel="Add" variant="primary">
          <BiPlus className="flex items-end text-3xl" />
        </Button>
      </div>
      <article className="timebook">
        <Link href={`/time/day?date=${previousDayString}`}>
          <a className={`k w-10 rounded-l-lg bg-gray-400 px-2 py-1`}>Last</a>
        </Link>
        <Link href={`/time/day?date=${nextDayString}`}>
          <a className={` w-10 rounded-r-lg bg-gray-400 px-2 py-1`}>Next</a>
        </Link>

        <div>This day: {CurrentDayString}</div>
        <DayWeekSwitch selectedButton="day" />
        <h2>Your timetable for day</h2>
      </article>
    </ProtectedPage>
  )
}

export default WeekTime
