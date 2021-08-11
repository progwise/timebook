import { HourInput } from '../components/hourInput'
import React, { useState } from 'react'

const Test = (): JSX.Element => {
    const [workHours, setWorkHours] = useState(1.5)
    const changeWorkHours = (h) => {
        setWorkHours(h)
    }

    return (
        <div>
            <h1>Workhours: {workHours}</h1>
            <HourInput onChange={(newWorkHours) => changeWorkHours(newWorkHours)} workHours={workHours}></HourInput>
        </div>
    )
}

export default Test
