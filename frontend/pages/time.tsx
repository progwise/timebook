import React, { ReactChild, ReactChildren, useEffect, useState } from 'react'
import { getFormattedWorkHours, HourInput } from '../components/hourInput'
import { CalendarSelector } from '../components/calendarSelector'
import { IProject, useProjects } from '../hooks/useProjects'
import { time } from 'console'

export interface IProjectTimeEntry {
    project: IProject
    times: Array<{ date: Date; workHours: number }>
}

const Time = (): JSX.Element => {
    const ColumnHeader = (props: { children: ReactChildren | ReactChild }) => {
        return <th className="text-left">{props.children}</th>
    }

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [timeData, setTimeData] = useState([])

    const { projects, error } = useProjects()

    useEffect(() => {
        const newData = projects.map((p) => ({
            project: p,
            times: [
                {
                    date: monday,
                    workHours: 1,
                },
                {
                    date: monday,
                    workHours: 1,
                },
                {
                    date: monday,
                    workHours: 1,
                },
                {
                    date: monday,
                    workHours: 1,
                },
                {
                    date: monday,
                    workHours: 1,
                },
                {
                    date: monday,
                    workHours: 1,
                },
                {
                    date: sunday,
                    workHours: 1,
                },
            ],
        }))
        setTimeData(newData)
    }, [projects])

    const todayNumber = selectedDate.getDay()
    const mondayNumber = 1 - todayNumber
    const sundayNumber = 7 - todayNumber
    const monday = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + mondayNumber)
    const sunday = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + sundayNumber)

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
                        <th className="text-left">{monday.toLocaleDateString()}</th>
                        <th colSpan={5} />
                        <th className="text-left">{sunday.toLocaleDateString()}</th>
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
                                <td key={index}>
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
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(1))}</td>
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(2))}</td>
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(3))}</td>
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(4))}</td>
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(5))}</td>
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(6))}</td>
                        <td>{getFormattedWorkHours(getWeekdayDurationSum(0))}</td>
                    </tr>
                </tfoot>
            </table>
        </article>
    )
}

export default Time
