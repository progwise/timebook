import { differenceInSeconds, minutesToHours, secondsToMinutes } from 'date-fns'
import { useEffect, useState } from 'react'

interface LiveDurationProps {
  start: Date
}

export const LiveDuration = ({ start }: LiveDurationProps) => {
  // When calculating the duration on SSR, we often get an error, that there is a mismatch between server and client.
  // This useState ensures, that the calculation starts on client side.
  const [difference, setDifference] = useState<number>()

  const calculateDuration = () => {
    setDifference(() => differenceInSeconds(new Date(), start))
  }

  useEffect(() => {
    calculateDuration()

    const interval = setInterval(calculateDuration, 1000)
    return () => clearInterval(interval)
  }, [])

  if (difference === undefined) {
    // eslint-disable-next-line unicorn/no-null
    return null
  }

  const differenceInMinutes = secondsToMinutes(difference)
  const hours = minutesToHours(differenceInMinutes)
  const seconds = difference % 60
  const minutes = differenceInMinutes % 60

  const secondsWithLeadingZero = seconds.toString().padStart(2, '0')
  const minutesWithLeadingZero = minutes.toString().padStart(2, '0')

  return (
    <span>
      {hours > 0 && `${hours}:`}
      {minutesWithLeadingZero}:{secondsWithLeadingZero}
    </span>
  )
}
