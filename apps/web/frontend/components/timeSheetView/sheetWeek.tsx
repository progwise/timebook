import { addDays, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useWorkHoursQuery } from '../../generated/graphql'
import { SheetDayRow } from './sheetDayRow'

interface SheetWeekProps {
  startDay: Date
  onFetched: () => void
}
const NUMBER_OF_DAYS = 7

export const SheetWeek = (props: SheetWeekProps): JSX.Element | null => {
  const fromDate = props.startDay
  const toDate = addDays(fromDate, NUMBER_OF_DAYS - 1)
  const interval = { start: fromDate, end: toDate }
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const router = useRouter()
  const teamSlug = router.query.teamSlug?.toString() ?? ''
  const [{ data, fetching }] = useWorkHoursQuery({
    variables: { teamSlug, from: format(props.startDay, 'yyyy-MM-dd'), to: format(toDate, 'yyyy-MM-dd') },
    context,
  })

  useEffect(() => {
    if (!fetching) {
      props.onFetched()
    }
  }, [fetching])

  if (fetching || !data) {
    // eslint-disable-next-line unicorn/no-null
    return null
  }

  return (
    <>
      {eachDayOfInterval(interval).map((day) => (
        <SheetDayRow
          workHours={data?.workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day)) ?? []}
          key={day.toString()}
          day={day}
        />
      ))}
    </>
  )
}
