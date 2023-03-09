import { eachMonthOfInterval, subMonths } from 'date-fns'
import { useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'

import { Spinner } from '@progwise/timebook-ui'

import { DayWeekSwitch } from '../dayWeekSwitchButton'
import { SheetMonth } from './sheetMonth'

export const WorkHoursSheet = (): JSX.Element => {
  const today = new Date()
  // Initially load two months, because on the first day of the month only one row would be initially shown
  const [monthsToLoad, setMonthsToLoad] = useState(2)
  const [fetching, setFetching] = useState(true)
  const startDate = subMonths(today, monthsToLoad)
  const toDate = today
  const interval = { start: startDate, end: toDate }

  const loadMore = () => {
    setMonthsToLoad((monthsToLoad) => monthsToLoad + 1)
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

          {eachMonthOfInterval(interval)
            .reverse()
            .map((startOfMonth) => (
              <SheetMonth key={startOfMonth.toString()} startDay={startOfMonth} onFetched={() => setFetching(false)} />
            ))}
          <div ref={sentryReference}>
            <Spinner size="small" />
          </div>
        </section>
      </div>
    </>
  )
}
