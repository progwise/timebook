import React, { ReactChild, ReactChildren, useState } from 'react'
import { HourInput } from '../components/hourInput'
import { CalendarSelector } from '../components/calendarSelector'

const Time = (): JSX.Element => {
    const ColumnHeader = (props: { children: ReactChildren | ReactChild }) => {
        return <th className="text-left">{props.children}</th>
    }

    const [selectedDate, setSelectedDate] = useState(new Date())

    const todayNumber = selectedDate.getDay()
    const mondayNumber = 1 - todayNumber
    const sundayNumber = 7 - todayNumber
    const monday = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + mondayNumber)
    const sunday = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + sundayNumber)

    const handleSelectedDateChange = (newDate: Date) => {
        setSelectedDate(newDate)
    }

    return (
        <article>
            <h2>Your timetable</h2>
            <div>
                <CalendarSelector onSelectedDateChange={handleSelectedDateChange} />
            </div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <td>
                            <span>{monday.toLocaleDateString()}</span>
                        </td>

                        <td className="flex justify-end mr-10">
                            <span>{sunday.toLocaleDateString()}</span>
                        </td>
                    </tr>
                </thead>
            </table>

            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <ColumnHeader>M</ColumnHeader>
                        <ColumnHeader>T</ColumnHeader>
                        <ColumnHeader>W</ColumnHeader>
                        <ColumnHeader>Th</ColumnHeader>
                        <ColumnHeader>F</ColumnHeader>
                        <ColumnHeader>S</ColumnHeader>
                        <ColumnHeader>Su</ColumnHeader>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <HourInput />
                        </td>
                        <td>
                            <HourInput />
                        </td>
                        <td>
                            <HourInput />
                        </td>
                        <td>
                            <HourInput />
                        </td>
                        <td>
                            <HourInput />
                        </td>
                        <td>
                            <HourInput />
                        </td>
                        <td>
                            <HourInput />
                        </td>
                    </tr>
                </tbody>
            </table>
        </article>
    )
}

export default Time
