import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { format, startOfDay } from 'date-fns'
import React, { useState } from 'react'

import { CalendarSelector } from './calendarSelector'

it('should display the given date', () => {
  render(<CalendarSelector date={new Date('2021-01-01')} onDateChange={jest.fn()} />)

  const selectButton = screen.getByRole('button', { name: /select date/i })
  expect(selectButton).toHaveTextContent('1/1/2021')
})

it('should update the date when the props updates', async () => {
  const CalenderSelectorHelper = () => {
    const [date, setDate] = useState(new Date('2021-01-01'))
    return (
      <>
        <CalendarSelector date={date} onDateChange={jest.fn()} />
        <button onClick={() => setDate(new Date('2021-12-24'))}>update date</button>
      </>
    )
  }

  render(<CalenderSelectorHelper />)

  const selectButton = screen.getByRole('button', { name: /select date/i })
  const updateButton = screen.getByRole('button', { name: /update date/i })
  expect(selectButton).toHaveTextContent('1/1/2021')

  await userEvent.click(updateButton)
  await userEvent.click(selectButton)
  expect(selectButton).toHaveTextContent('12/24/2021')

  const heading = screen.getByRole('heading')
  expect(heading).toHaveTextContent('Dec 2021')
})

describe('when opening the popup', () => {
  const onDateChange = jest.fn()

  beforeEach(async () => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<CalendarSelector date={new Date('2021-01-01')} onDateChange={onDateChange} />)
    const button = screen.getByRole('button')
    await userEvent.click(button)
  })

  it('should render the given month in the heading', async () => {
    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('Jan 2021')
  })

  it('should marks the given date as selected', async () => {
    const selectedDayElement = screen.getByTitle(/^selected day/i)
    expect(selectedDayElement).toHaveTextContent('1')
  })

  it('should be possible to selected a different date', async () => {
    const day14 = screen.getByRole('button', { name: '14' })
    await userEvent.click(day14)

    const expectedDay = startOfDay(new Date('2021-01-14'))
    expect(onDateChange).toHaveBeenCalledWith(expectedDay)
  })

  it('should display previous/next month when clicking on prev/next icons', async () => {
    const previousMonthIcon = screen.getByRole('button', { name: /go to previous month/i })
    const nextMonthIcon = screen.getByRole('button', { name: /go to next month/i })
    const heading = screen.getByRole('heading')
    expect(heading).toHaveTextContent('Jan 2021')

    await userEvent.click(previousMonthIcon)
    expect(heading).toHaveTextContent('Dec 2020')

    await userEvent.click(nextMonthIcon)
    expect(heading).toHaveTextContent('Jan 2021')
  })

  it('should display the current month when clicking on the home icon', async () => {
    const heading = screen.getByRole('heading')
    const homeIcon = screen.getByRole('button', { name: /go to today/i })
    expect(heading).toHaveTextContent('Jan 2021')

    await userEvent.click(homeIcon)
    const expectedMonthTitle = format(new Date(), 'MMM yyyy')
    expect(heading).toHaveTextContent(expectedMonthTitle)
  })
})
