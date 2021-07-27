import { findByDisplayValue, fireEvent, getByDisplayValue, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { CalendarSelector } from './calendarSelector'

describe('the custom calendar should ...', () => {
    const testNode = (
        <>
            <CalendarSelector></CalendarSelector>
        </>
    )

    it('... expand button shows text from Mon to Sun', () => {
        const { getByRole, getByText } = render(testNode)

        const expandButton = getByRole('button')

        expandButton.click()
        screen.logTestingPlaygroundURL()

        expect(getByText('Mon')).toBeInTheDocument()
        expect(getByText('Tue')).toBeInTheDocument()
        expect(getByText('Wed')).toBeInTheDocument()
        expect(getByText('Thu')).toBeInTheDocument()
        expect(getByText('Fri')).toBeInTheDocument()
        expect(getByText('Sat')).toBeInTheDocument()
        expect(getByText('Sun')).toBeInTheDocument()
    })

    it('... clicking the home button gives today', () => {
        const { getByRole, getByDisplayValue } = render(testNode)
        const today = new Date()
        const homeButton = getByRole('today')
        homeButton.focus()
        fireEvent.change(homeButton, { target: { value: today } })
        getByDisplayValue(/click me!/i).focus()
        expect(homeButton).toEqual(today)
    })
})
