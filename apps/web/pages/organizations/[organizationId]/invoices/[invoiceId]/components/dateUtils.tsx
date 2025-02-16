import { convertToTimeZone } from 'date-fns-timezone'

export const adjustDateToUTC = (localDate: Date | string): string => {
  const date = typeof localDate === 'string' ? new Date(localDate) : localDate
  const zonedDate = convertToTimeZone(date, { timeZone: 'UTC' })
  const offset = date.getTimezoneOffset() * 60_000 // Convert minutes to milliseconds
  return new Date(zonedDate.getTime() - offset).toISOString() // Subtract offset to adjust to local time zone
}
