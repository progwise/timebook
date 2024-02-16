/* eslint-disable no-console */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { HourInput } from './hourInput'

const HourInputHelper = () => {
  const [duration, setDuration] = useState(0)
  return (
    <>
      <HourInput duration={duration} onChange={jest.fn()} />
      <button onDoubleClick={() => setDuration(60)}>Click me!</button>
    </>
  )
}

describe('the hour input control should display ...', () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<HourInputHelper />)
  })

  it('... 0:00 in the beginning', () => {
    const hourBox = screen.getByRole('textbox')
    expect(hourBox).toHaveDisplayValue('')
  })

  it('... 1:00 if the user types "1"', async () => {
    const hourBox = screen.getByRole('textbox')

    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, '1')
    await userEvent.click(screen.getByRole('button'))

    expect(hourBox).toHaveDisplayValue('1:00')
  })

  it('... display "" user types "abc"', async () => {
    const hourBox = screen.getByRole('textbox')

    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, 'abc')
    await userEvent.click(screen.getByRole('button'))

    expect(hourBox).toHaveDisplayValue('')
  })

  describe('... should allow "hh:mm" input when ...', () => {
    it('... typing in "01:12"', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '01:12')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('1:12')
    })

    it('... typing 23:59 is ok', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '23:59')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('23:59')
    })

    it('... typing 23:60 is re-calculated to 24:00', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '23:60')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('24:00')
    })

    it('... typing 1:02 should stay 1:02', async () => {
      const hourBox = screen.getByRole('textbox')
      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '1:02')
      await userEvent.click(screen.getByRole('button'))
      expect(hourBox).toHaveDisplayValue('1:02')
    })

    it('... typing 1:55 is should stay 1:55', async () => {
      const hourBox = screen.getByRole('textbox')
      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '1:55')
      await userEvent.click(screen.getByRole('button'))
      expect(hourBox).toHaveDisplayValue('1:55')
    })

    it('... typing 12.45 is changed to 12:27', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '12.45')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('12:27')
    })

    it('... typing 24.01 is changed to 24:00', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '24.01')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('24:00')
    })
  })

  it('... typing 24.018 resets to previous value', async () => {
    const hourBox = screen.getByRole('textbox')

    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, '24.018')
    await userEvent.click(screen.getByRole('button'))

    expect(hourBox).toHaveDisplayValue('')
  })

  it('... and the default total working hours are added up for each day', async () => {
    const hourBox = screen.getByRole('textbox')
    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, '4:00')
    await userEvent.click(screen.getByRole('button'))
    const resultElement = await screen.findByDisplayValue('4:00')
    expect(resultElement).toBeInTheDocument()
  })

  it('updates when duration changes', async () => {
    const button = screen.getByRole('button')
    await userEvent.dblClick(button)
    const hourBox = screen.getByRole('textbox')
    expect(hourBox).toHaveDisplayValue('1:00')
  })
})
