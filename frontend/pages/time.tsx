import React, { ReactChild, ReactChildren, useEffect, useState } from 'react'
import { getFormattedWorkHours, HourInput } from '../components/hourInput'
import { CalendarSelector } from '../components/calendarSelector'
import { IProject, useProjects } from '../hooks/useProjects'

export interface IProjectTimeEntry {
    project: IProject
    times: Array<{ date: Date; workHours: number }>
}

const Time = (): JSX.Element => {
    const ColumnHeader = (props: { children: ReactChildren | ReactChild }) => {
        return <th className="text-center">{props.children}</th>
    }

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [timeData, setTimeData] = useState([])

    const { projects, error } = useProjects()

    useEffect(() => {
        const newData = projects.map((p) => ({
            project: p,
            times: [
                {
                    date: getDateForWeekday(selectedDate, 1),
                    workHours: 1,
                },
                {
                    date: getDateForWeekday(selectedDate, 2),
                    workHours: 1,
                },
                {
                    date: getDateForWeekday(selectedDate, 3),
                    workHours: 1,
                },
                {
                    date: getDateForWeekday(selectedDate, 4),
                    workHours: 1,
                },
                {
                    date: getDateForWeekday(selectedDate, 5),
                    workHours: 1,
                },
                {
                    date: getDateForWeekday(selectedDate, 6),
                    workHours: 1,
                },
                {
                    date: getDateForWeekday(selectedDate, 7),
                    workHours: 1,
                },
            ],
        }))
        setTimeData(newData)
    }, [projects])

    const getDateForWeekday = (baseDate: Date, weekdayNumber: number) =>
        new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + weekdayNumber - baseDate.getDay())

    const handleSelectedDateChange = (newDate: Date) => {
        setSelectedDate(newDate)
    }
    const getWeekdayDurationSum = (weekday: number): number => {
        let result = 0.0
        timeData.forEach((projectData) => {
            const timesForWeekday = projectData.times
                .filter((t) => t.date.getDay() === weekday)
                .map((entry) => entry.workHours)
            if (timesForWeekday.length) {
                result = result + timesForWeekday.reduce((a, b) => a + b)
            }
        })
        return result
    }

    const setWorkHours = (project: IProject, date: Date, workHours: number) => {
        const projectEntry = timeData.find((entry) => entry.project.id === project.id)
        const dateEntry = projectEntry.times.find((t) => t.date.toLocaleDateString() === date.toLocaleDateString())
        if (!dateEntry) {
            projectEntry.times.push({ date, workHours })
        } else {
            dateEntry.workHours = workHours
        }
        setTimeData(timeData.map((x) => x))
    }

    return (
        <article>
            <h2>Your timetable</h2>
            <div>
                <CalendarSelector onSelectedDateChange={handleSelectedDateChange} />
            </div>

            <table id="timeTable" className="w-full table-auto">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th colSpan={3} className="text-left">
                            {getDateForWeekday(selectedDate, 1).toLocaleDateString()}
                        </th>
                        <th />
                        <th colSpan={3} className="text-right">
                            {getDateForWeekday(selectedDate, 7).toLocaleDateString()}
                        </th>
                    </tr>
                    <tr>
                        <ColumnHeader>&nbsp;</ColumnHeader>
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
                    {timeData.map((timeEntry) => (
                        <tr key={timeEntry.project.id}>
                            <td>{timeEntry.project.title}</td>
                            {timeEntry.times.map(({ date, workHours }, index) => (
                                <td className="pl-2 pr-2 min-w-min" key={index}>
                                    <HourInput
                                        onChange={(newWorkHours) => setWorkHours(timeEntry.project, date, newWorkHours)}
                                        workHours={workHours}
                                    ></HourInput>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <td className="text-center" key={i}>
                                {getFormattedWorkHours(getWeekdayDurationSum((i + 1) % 7))}
                            </td>
                        ))}
                    </tr>
                </tfoot>
            </table>
        </article>
    )
}

export default Time
