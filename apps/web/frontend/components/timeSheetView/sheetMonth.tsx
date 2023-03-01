import { eachDayOfInterval, endOfMonth, format, isSameDay, min, parseISO } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useWorkHoursQuery } from '../../generated/graphql'
import { SheetDayRow } from './sheetDayRow'

interface SheetMonthProps {
  startDay: Date
  onFetched: () => void
}

export const SheetMonth = (props: SheetMonthProps): JSX.Element | null => {
  const today = new Date()
  const startDate = props.startDay
  const endDate = min([endOfMonth(startDate), today]) // Don't show days in the future

  const interval = { start: startDate, end: endDate }
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const [{ data, fetching }] = useWorkHoursQuery({
    variables: { from: format(props.startDay, 'yyyy-MM-dd'), to: format(endDate, 'yyyy-MM-dd') },
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
      {eachDayOfInterval(interval)
        .reverse()
        .map((day) => (
          <SheetDayRow
            workHours={data?.workHours.filter((workHour) => isSameDay(parseISO(workHour.date), day)) ?? []}
            key={day.toString()}
            day={day}
          />
        ))}
    </>
  )
}
