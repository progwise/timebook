import { useState } from 'react'

// const add = (a: number, b: number) => {
//   return a + b
// }

// const square = (a: number) => {
//   return a * a
// }

// const whatIsOnePlusTwo = add(1, 2)

// const [value, setValue]: [number, string] = [1, "we don't know yet"]
// // const value = someArray[0]

// interface Person {
//   name: string
//   age: number
//   gender: 'female' | 'male' | 'something else'
// }

// const sascha: Person = {
//   name: 'Sascha',
//   age: 24,
//   gender: 'male',
// }

// const { name, age } = sascha

// TODO:
// - start value
// - reset button

interface CounterProps {
  step: number
  start: number
}

export const Counter = ({ step, start }: CounterProps): JSX.Element => {
  const [value, setValue] = useState(start)
  const handleResetClick = () => {
    setValue(start)
  }

  const handleClick = () => {
    setValue(value + step)
    console.log('Button was clicked', step)
  }
  return (
    <div>
      <button onClick={handleClick}>Value is {value}</button>
      <br />
      {value > 50 ? <button onClick={handleResetClick}>Reset button</button> : 'Click more'}
    </div>
  )
}
