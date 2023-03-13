import { eachDayOfInterval, endOfMonth, format, isSameDay, min, parseISO } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useQuery } from 'urql'

import { graphql } from '../../generated/gql'
import { SheetDayRow } from './sheetDayRow'

const WorkHoursQueryDocument = graphql(`
  query workHours($from: Date!, $to: Date) {
    workHours(from: $from, to: $to) {
      date
      ...SheetDayRow
    }
  }
`)

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
  const [{ data, fetching }] = useQuery({
    query: WorkHoursQueryDocument,
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
