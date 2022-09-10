import { addDays, endOfWeek, format, parse, startOfWeek } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { WeekPageTable } from '../../../frontend/components/weekPageTable'

const WeekPage = (): JSX.Element => {
  const router = useRouter()
  const teamSlug = router.query.teamSlug
  const urlDate = router.query.date?.toString()

  const currentDate = urlDate ? parse(urlDate, 'yyyy-MM-dd', new Date()) : new Date()

  const startOfTheWeek = startOfWeek(currentDate, { weekStartsOn: 1 }) //startOfWeek in camel case doesn´t work, because of the following function: startOfWeek()

  const endOfTheWeek = endOfWeek(currentDate, { weekStartsOn: 1 })

  const startDate = format(startOfTheWeek, 'dd.MM')
  const endDate = format(endOfTheWeek, 'dd.MM.yyyy')

  const nextWeek = addDays(currentDate, 7)
  const previousWeek = addDays(currentDate, -7)
  const previousWeekString = format(previousWeek, 'yyyy-MM-dd')
  const nextWeekString = format(nextWeek, 'yyyy-MM-dd')
  return (
    <>
      <WeekPageTable startDate={startOfTheWeek} />
      <span className="text-center text-xs">
        <Link href={`/${teamSlug}/time/week?date=${previousWeekString}`}>
          <a className={`k w-10 rounded-l-lg bg-gray-400 px-2 py-1`}>Last</a>
        </Link>
        <Link href={`/${teamSlug}/time/week?date=${nextWeekString}`}>
          <a className={` w-10 rounded-r-lg bg-gray-400 px-2 py-1`}>Next</a>
        </Link>
      </span>
      <div>
        {startDate}-{endDate}
      </div>
    </>
  )
}
export default WeekPage
