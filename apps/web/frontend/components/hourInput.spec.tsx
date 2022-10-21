/* eslint-disable no-console */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HourInput } from './hourInput'

describe('the hour input control should display ...', () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <>
        <HourInput workHours={0} onChange={jest.fn()} />
        <button>Click me!</button>
      </>,
    )
  })

  it('... 0:00 in the beginning', () => {
    const hourBox = screen.getByRole('textbox')
    expect(hourBox).toHaveDisplayValue('0:00')
  })

  it('... 1:00 if the user types "1"', async () => {
    const hourBox = screen.getByRole('textbox')

    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, '1')
    await userEvent.click(screen.getByRole('button'))

    expect(hourBox).toHaveDisplayValue('1:00')
  })

  it('... display "0:00" user types "abc"', async () => {
    const hourBox = screen.getByRole('textbox')

    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, 'abc')
    await userEvent.click(screen.getByRole('button'))

    expect(hourBox).toHaveDisplayValue('0:00')
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

    it('... typing 12.45 is changed to 12:26', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '12.45')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('12:26')
    })

    it('... typing 24.01 is changed to 24:00', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '24.01')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('24:00')
    })

    it('... typing 12.ab is changed to 12:00', async () => {
      const hourBox = screen.getByRole('textbox')

      await userEvent.clear(hourBox)
      await userEvent.type(hourBox, '12.ab')
      await userEvent.click(screen.getByRole('button'))

      expect(hourBox).toHaveDisplayValue('12:00')
    })
  })

  it('... typing 24.018 reports an error', async () => {
    window.alert = jest.fn()
    const hourBox = screen.getByRole('textbox')

    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, '24.017')
    await userEvent.click(screen.getByRole('button'))

    expect(window.alert).toHaveBeenCalledTimes(1)
    expect(hourBox).toHaveDisplayValue('0:00')
  })

  it('... and the default total working hours are added up for each day', async () => {
    const hourBox = screen.getByRole('textbox')
    await userEvent.clear(hourBox)
    await userEvent.type(hourBox, '4:00')
    await userEvent.click(screen.getByRole('button'))
    const resultElement = await screen.findByDisplayValue('4:00')
    expect(resultElement).toBeInTheDocument()
  })
})
