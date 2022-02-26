/* eslint-disable*/
import { setupServer } from 'msw/lib/types/node'
import { useState } from 'react'
import { Button } from '../frontend/components/button/button'

interface CounterProps {
  start: number
  steps: number
}

const CounterLinus = ({ start, steps }: CounterProps) => {
  const [state, setState] = useState(start)
  return (
    <>
      <span>{state}</span>
      <Button
        variant="primarySlim"
        onClick={() => {
          setState(state + steps)
        }}
      >
        Erhöhen
      </Button>
    </>
  )
}

const CounterSante = ({ start, steps }: CounterProps) => {
  const handleClickDecrease = () => {
    setValue((oldState) => oldState - 1)
  }

  const handleClick = () => {
    setValue(value + steps)
  }
  const [value, setValue] = useState(start)

  return (
    <>
      <h4>{value}</h4>
      <Button variant="primarySlim" onClick={handleClick}>
        {' '}
        Increase by {steps}
      </Button>
      <Button variant="primarySlim" onClick={handleClickDecrease}>
        {' '}
        Decrease{' '}
      </Button>
    </>
  )
}

const CounterPascal = () => {
  const [value, setValue] = useState(0)

  const handleClick = () => {
    setValue(1)
  }

  return (
    <>
      <span>{value}</span>
      <Button variant="primarySlim" onClick={handleClick}>
        Erhöhen
      </Button>
    </>
  )
}

const TempPage = () => {
  const [steps, setSteps] = useState(1)

  return (
    <>
      <Button variant="primary" onClick={() => setSteps(Math.ceil(Math.random() * 10))}>
        Steps: {steps}
      </Button>
      <CounterSante start={10} steps={steps} />
      <hr />
      <CounterLinus start={-20} steps={steps} />
      <CounterLinus start={10} steps={steps} />
      <hr />
      <CounterPascal />
    </>
  )
}

export default TempPage
