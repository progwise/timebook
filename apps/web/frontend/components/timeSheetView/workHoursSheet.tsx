import { eachMonthOfInterval, subMonths } from 'date-fns'
import { useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'

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
    <div>
      <table className="table table-pin-rows">
        <thead className="text-lg">
          <tr className="top-16">
            <th>Project</th>
            <th>Task</th>
            <th>Person</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {eachMonthOfInterval(interval)
            .reverse()
            .map((startOfMonth) => (
              <SheetMonth key={startOfMonth.toString()} startDay={startOfMonth} onFetched={() => setFetching(false)} />
            ))}
        </tbody>
        <tfoot ref={sentryReference}>
          <tr>
            <th className="loading loading-spinner" />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
