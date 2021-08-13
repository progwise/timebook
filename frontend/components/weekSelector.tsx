import { useState } from 'react'

export const WeekSelector = (props: { onChange: (year: number, week: number) => void }): JSX.Element => {
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear())
    const [selectedWeek, setSelectedWeek] = useState(() => {
        const now = new Date()
        const start = new Date(now.getFullYear(), 0, 1)
        const weekNum = Math.floor(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
        return weekNum
    })

    const weekNumbers = Array.from(Array(54), (_, index) => 1 + index)

    const arrayOfYears = () => {
        const max = new Date().getFullYear()
        const min = max - 2
        const years = []

        for (let i = max; i >= min; i--) {
            years.push(i)
        }
        return years
    }

    const years = arrayOfYears()

    const handleWeekChange = (e) => {
        const newWeek = e.target.value
        setSelectedWeek(newWeek)
        props.onChange(selectedYear, newWeek)
    }

    const handleYearChange = (e) => {
        const newYear = e.target.value
        setSelectedYear(newYear)
        props.onChange(newYear, selectedWeek)
    }

    return (
        <label className="flex flex-row mt-6 space-x-4">
            <span className="space-x-10">
                {selectedWeek}/{selectedYear}
            </span>
            <div>
                <select onChange={handleWeekChange}>
                    {weekNumbers.map((w: number) => {
                        return (
                            <option selected={w === selectedWeek} value={w} key={w}>
                                Week {w}
                            </option>
                        )
                    })}
                </select>

                <select onChange={handleYearChange}>
                    {years.map((y) => {
                        return (
                            <option selected={y === selectedYear} value={y} key={y}>
                                {y}
                            </option>
                        )
                    })}
                </select>
            </div>
        </label>
    )
}
