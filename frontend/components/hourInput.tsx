import { ChangeEvent, FocusEvent, useState } from 'react'

export interface IWorkDuration {
    hours: number
    minutes: number
}

function validateDuration(duration: IWorkDuration): IWorkDuration {
    if (duration.hours > 23 && duration.minutes > 0) {
        throw new Error('A single day has only 24 hours')
    }
}

function parseIntNoNaN(valueAsString: string): number {
    const valueAsNumber = parseInt(valueAsString)
    if (isNaN(valueAsNumber)) {
        return 0
    }
    return valueAsNumber
}

function parseFloatNoNaN(valueAsString: string): number {
    const valueAsNumber = parseFloat(valueAsString)
    if (isNaN(valueAsNumber)) {
        return 0
    }
    return valueAsNumber
}

export const parseWorkHours = (timeString: string): number => {
    try {
        const parts = timeString.split(':')
        if (parts.length > 1) {
            let hours = parseIntNoNaN(parts[0])
            let minutes = parseIntNoNaN(parts[1])

            if (minutes > 59) {
                const remainer = minutes % 60
                hours = hours + (minutes - remainer) / 60
                minutes = remainer
            }

            validateDuration({
                hours,
                minutes,
            })

            return hours + minutes / 60
        }

        const durationAsFloat = parseFloatNoNaN(parts[0])
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

export const getFormattedWorkHours = (workHours: number) => {
    const hours = Math.floor(workHours)
    const minutes = Math.floor((workHours - hours) * 100)
    return `${hours}:${pad(minutes)}`
}

export const HourInput = (props: { workHours: number; onChange: (workHours: number) => void }): JSX.Element => {
    const [workHours, setWorkHours] = useState(props.workHours)

    const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
        const workHours = parseWorkHours(event.target.value)

        props.onChange(workHours)
        setWorkHours(workHours)
    }

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const durationParts = event.target.value.split(':')
        console.log(event.target.value)
        console.log(durationParts)
        const hours = parseInt(durationParts[0])
        const minutes = parseInt(durationParts[1])
        //setWorkHours(hours + (isNaN(minutes) ? 0 : minutes / 60))
    }

    const formattedDuration = getFormattedWorkHours(workHours)

    return (
        <div className="border w-14">
            <input
                className="w-full text-center p-1"
                type="text"
                name="hours"
                placeholder="0:00"
                onBlur={handleOnBlur}
                defaultValue={formattedDuration}
                onChange={handleOnChange}
            />
        </div>
    )
}
