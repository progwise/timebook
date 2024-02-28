import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { startOfMonth } from 'date-fns'
import { useState } from 'react'

import { CalendarMonthSelector } from './calendarMonthSelector'

it('should display the given month and year', () => {
  render(<CalendarMonthSelector date={new Date('2021-01')} onDateChange={jest.fn()} />)

  const selectButton = screen.getByRole('button', { name: /select month/i })
  expect(selectButton).toHaveTextContent('January 2021')
})

it('should update the date when the props updates', async () => {
  const CalendarMonthSelectorHelper = () => {
    const [date, setDate] = useState(new Date('2021-01'))
    return (
      <>
        <CalendarMonthSelector date={date} onDateChange={jest.fn()} />
        <button onClick={() => setDate(new Date('2022-12'))}>update month</button>
      </>
    )
  }

  render(<CalendarMonthSelectorHelper />)

  const selectButton = screen.getByRole('button', { name: /select month/i })
  const updateButton = screen.getByRole('button', { name: /update month/i })
  expect(selectButton).toHaveTextContent('January 2021')

  await userEvent.click(updateButton)
  await userEvent.click(selectButton)
  expect(selectButton).toHaveTextContent('December 2022')

  const heading = screen.getByRole('heading')
  expect(heading).toHaveTextContent('2022')
})

describe('when opening the popup', () => {
  const onDateChange = jest.fn()

  beforeEach(async () => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<CalendarMonthSelector date={new Date('2021-01')} onDateChange={onDateChange} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)
  })

  it('should render the given year in the heading', async () => {
    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('2021')
  })

  it('should highlight the given month as selected', async () => {
    const selectedMonthElement = screen.getByTitle(/^selected month/i)
    expect(selectedMonthElement).toHaveTextContent('Jan')
  })

  it('should be possible to select a different month', async () => {
    const aprilButton = screen.getByRole('button', { name: 'Apr' })
    await userEvent.click(aprilButton)

    const expectedMonth = startOfMonth(new Date('2021-04'))
    expect(onDateChange).toHaveBeenCalledWith(expectedMonth)
  })

  it('should display previous/next year when clicking on previous/next icons', async () => {
    const previousYearIcon = screen.getByRole('button', { name: /go to previous year/i })
    const nextYearIcon = screen.getByRole('button', { name: /go to next year/i })
    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('2021')

    await userEvent.click(previousYearIcon)
    expect(heading).toHaveTextContent('2020')

    await userEvent.click(nextYearIcon)
    expect(heading).toHaveTextContent('2021')
  })
})
