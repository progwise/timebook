import { HourInput } from '../components/hourInput'
import React from 'react'

const Test = (): JSX.Element => {
    const workHours = 1.23
    const changeWorkHours = (h) => {
        console.log(h)
    }

    console.log(workHours % 1)
    return <HourInput onChange={(newWorkHours) => changeWorkHours(newWorkHours)} workHours={workHours}></HourInput>
}

export default Test
