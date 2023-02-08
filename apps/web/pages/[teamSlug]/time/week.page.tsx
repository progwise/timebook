import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  format,
  formatISO,
  parse,
  parseISO,
  startOfWeek,
  toDate,
} from 'date-fns'
import { context } from 'msw'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { WeekPageTable, WorkHoursTableRow } from '../../../frontend/components/weekPageTable'
import { useWorkHoursQuery } from '../../../frontend/generated/graphql'

const NUMBER_OF_DAYS = 7

const WeekPage = (): JSX.Element => {
  const router = useRouter()
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])

  const teamSlug = router.query.teamSlug
  const urlDate = router.query.date?.toString()

  const currentDate = urlDate ? parse(urlDate, 'yyyy-MM-dd', new Date()) : new Date()

  const startOfTheWeek = startOfWeek(currentDate, { weekStartsOn: 1 })

  const nextWeek = addDays(currentDate, 7)
  const previousWeek = addDays(currentDate, -7)
  const previousWeekString = format(previousWeek, 'yyyy-MM-dd')
  const nextWeekString = format(nextWeek, 'yyyy-MM-dd')
  const fromDate = startOfTheWeek
  const toDate = addDays(fromDate, NUMBER_OF_DAYS - 1)
  const interval = { start: fromDate, end: toDate }
  const [{ data }] = useWorkHoursQuery({
    variables: {
      teamSlug: router.query.teamSlug?.toString() ?? '',
      from: formatISO(fromDate, { representation: 'date' }),
      to: formatISO(toDate, { representation: 'date' }),
    },
    context,
  })
  const tableData: WorkHoursTableRow[] = []

  for (const workHour of data?.workHours ?? []) {
    const workHourDate = parseISO(workHour.date)
    const weekDay = differenceInDays(workHourDate, fromDate)
    const rowIndex = tableData.findIndex((row) => {
      return row.task.id === workHour.task.id
    })
    if (rowIndex === -1) {
      tableData.push({
        project: workHour.project,
        task: workHour.task,
        durations: eachDayOfInterval(interval).map(() => 0),
      })
      tableData[tableData.length - 1].durations[weekDay] = workHour.duration
    } else {
      tableData[rowIndex].durations[weekDay] += workHour.duration
    }
  }
  return (
    <>
      <span className="text-center text-xs">
        <Link href={`/${teamSlug}/time/week?date=${previousWeekString}`}>
          <a className="k w-10 rounded-l-lg bg-gray-400 px-2 py-1">Last</a>
        </Link>
        <Link href={`/${teamSlug}/time/week?date=${nextWeekString}`}>
          <a className="w-10 rounded-r-lg bg-gray-400 px-2 py-1">Next</a>
        </Link>
      </span>
      <WeekPageTable startDate={startOfTheWeek} tableData={tableData} numberOfDays={NUMBER_OF_DAYS} />
    </>
  )
}
export default WeekPage
