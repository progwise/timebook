import { parse } from 'date-fns'
import { FocusEventHandler, useRef, useState } from 'react'

export interface IWorkDuration {
  hours: number
  minutes: number
}

function validateDuration(duration: IWorkDuration): void {
  if ((duration.hours > 23 && duration.minutes > 0) || duration.hours > 24) {
    throw new Error('A single day has only 24 hours')
  }
}

const parseWorkHours = (timeString: string): number => {
  try {
    const parts = timeString.split(':')
    if (parts.length > 1) {
      let hours = Number.parseInt(parts[0]) || 0
      let minutes = Number.parseInt(parts[1]) || 0

      if (minutes > 59) {
        const remainder = minutes % 60
        hours = hours + (minutes - remainder) / 60
        minutes = remainder
      }

      validateDuration({
        hours,
        minutes,
      })

      return hours + minutes / 60
    }

    const durationAsFloat = Number.parseFloat(parts[0]) || 0
    const duration = {
      hours: Math.floor(durationAsFloat),
      minutes: Math.floor((durationAsFloat % 1) * 60),
    }

    validateDuration(duration)

    return duration.hours + duration.minutes / 60
  } catch (error) {
    alert(error)
    return 0
  }
}

function pad(value: number): string {
  return value < 10 ? '0' + value.toString() : value.toString()
}

export const getFormattedWorkHours = (workHours: number): string => {
  const hours = Math.floor(workHours)
  const minutes = Math.round(workHours * 60 - hours * 60)
  return `${hours}:${pad(minutes)}`
}

export const HourInput = (props: {
  workHours: number
  onChange?: (workHours: number) => void
  className?: string
  onBlur?: (workHours: number) => void
  readOnly?: boolean
  disabled?: boolean
}): JSX.Element => {
  const [workHour, setWorkHour] = useState<string>(getFormattedWorkHours(props.workHours))
  const previousValue = useRef<string>(getFormattedWorkHours(props.workHours))

  const handlerSubmit: FocusEventHandler<HTMLInputElement> = (event) => {
    const formattedValue = getFormattedWorkHours(parseWorkHours(event.target.value))

    if (previousValue.current !== formattedValue) {
      const parsedDate = parse(formattedValue, 'HH:mm', new Date())

      const duration = parsedDate.getHours() * 60 + parsedDate.getMinutes()

      props.onChange?.(duration)
      props.onBlur?.(duration)
    }

    setWorkHour(formattedValue)
    previousValue.current = formattedValue
  }

  return (
    <input
      value={workHour}
      readOnly={props.readOnly}
      onChange={(event) => setWorkHour(event.target.value)}
      onFocus={(event) => event.target.select()}
      className={`rounded-md p-1 text-center dark:bg-slate-800 ${props.className ?? ''}`}
      size={5}
      placeholder="0:00"
      onBlur={handlerSubmit}
      disabled={props.disabled}
    />
  )
}
