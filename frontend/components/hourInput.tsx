import { ChangeEvent, FocusEvent, useState } from 'react'

export interface IWorkDuration {
    hours: number
    minutes: number
}

function validateDuration(duration: IWorkDuration): IWorkDuration {
    if (duration.hours > 23 && duration.minutes > 0) {
        throw new Error('A single day has only 24 hours')
    }
    return duration
}

function parseIntNoNaN(valueAsString: string): number {
    const valueAsNumber = Number.parseInt(valueAsString)
    if (Number.isNaN(valueAsNumber)) {
        return 0
    }
    return valueAsNumber
}

function parseFloatNoNaN(valueAsString: string): number {
    const valueAsNumber = Number.parseFloat(valueAsString)
    if (Number.isNaN(valueAsNumber)) {
        return 0
    }
    return valueAsNumber
}

export const parseDuration = (timeString: string): IWorkDuration => {
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

            return validateDuration({
                hours,
                minutes,
            })
        }

        const durationAsFloat = parseFloatNoNaN(parts[0])

        return validateDuration({
            hours: Math.floor(durationAsFloat),
            minutes: Math.floor((durationAsFloat % 1) * 60),
        })
    } catch (error) {
        alert(error)
        return { hours: 0, minutes: 0 }
    }
}

function pad(value: number): string {
    return value < 10 ? '0' + value.toString() : value.toString()
}

export const HourInput = (): JSX.Element => {
    const [formattedDuration, setFormattedDuration] = useState('0:00')

    const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
        const newDuration = parseDuration(event.target.value)
        setFormattedDuration(`${newDuration.hours}:${pad(newDuration.minutes)}`)
    }

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormattedDuration(event.target.value)
    }

    return (
        <div className="border w-14">
            <input
                className="w-full text-center p-1"
                type="text"
                name="hours"
                placeholder="0:00"
                onBlur={handleOnBlur}
                value={formattedDuration}
                onChange={handleOnChange}
            />
        </div>
    )
}
