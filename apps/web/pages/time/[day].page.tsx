import { isThisWeek, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import TimePage from './index.page'

const TimePageForASpecificDay = () => {
  const router = useRouter()

  if (!router.isReady) {
    return
  }

  const dayString = router.query.day?.toString() ?? ''
  const day = parseISO(dayString)

  const isServerSide = typeof window === 'undefined'
  if (!isServerSide && isThisWeek(day, { weekStartsOn: 1 })) {
    router.push('/time')
  }

  return <TimePage day={day} />
}

export default TimePageForASpecificDay
