import { addDays, eachWeekOfInterval } from 'date-fns'

import { Spinner } from '@progwise/timebook-ui'
import { useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { DayWeekSwitch } from '../dayWeekSwitchButton'
import { SheetWeek } from './sheetWeek'

interface SheetPageTableProps {
  startDate: Date
}

export const WorkHoursSheet = (props: SheetPageTableProps): JSX.Element => {
  const [days, setDays] = useState(7)
  const [fetching, setFetching] = useState(true)
  const fromDate = props.startDate
  const toDate = addDays(fromDate, days - 1)
  const interval = { start: fromDate, end: toDate }

  const loadMore = () => {
    setDays(days + 7)
    setFetching(true)
  }

  const [sentryReference] = useInfiniteScroll({
    loading: fetching,
    hasNextPage: true,
    onLoadMore: loadMore,
    rootMargin: '0px 0px 400px 0px',
  })

  return (
    <>
      <div className="my-4">
        <DayWeekSwitch selectedButton="sheet" />
      </div>
      <div className="flex flex-col">
        <section className="mt-10 grid w-full grid-cols-3 gap-2 text-left">
          <article className="contents border-y text-lg">
            <hr className="col-span-4 -mb-2 h-0.5 bg-gray-600" />
            <strong>Project</strong>
            <strong>Task</strong>
            <strong>Person</strong>
            <strong>Hours</strong>
          </article>

          {eachWeekOfInterval(interval, { weekStartsOn: 1 }).map((startOfWeek) => (
            <SheetWeek key={startOfWeek.toString()} startDay={startOfWeek} onFetched={() => setFetching(false)} />
          ))}
          <div ref={sentryReference}>
            <Spinner size="small" />
          </div>
        </section>
      </div>
    </>
  )
}
