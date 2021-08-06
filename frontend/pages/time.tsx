import React, { ReactChild, ReactChildren, useState } from 'react'
import { HourInput } from '../components/hourInput'
import { CalendarSelector } from '../components/calendarSelector'
import { useProjects } from '../hooks/useProjects'

const Time = () => {
    const ColumnHeader = (props: { children: ReactChildren | ReactChild }) => {
        return <th className="text-left">{props.children}</th>
    }

    const [selectedDate, setSelectedDate] = useState(new Date())
    const { projects, error } = useProjects()

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
            <tr>
                {projects.map((p, rows) => {
                    return (
                        <th className="grid grid-cols-4" key={rows}>
                            {p.title}
                        </th>
                    )
                })}
            </tr>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="text-left">{monday.toLocaleDateString()}</th>
                        <th colSpan={5} />
                        <th className="text-left">{sunday.toLocaleDateString()}</th>
                    </tr>
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
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                        <td>
                            <HourInput></HourInput>
                        </td>
                    </tr>
                </tbody>
            </table>
        </article>
    )
}

export default Time
