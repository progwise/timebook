import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { CalendarSelector } from './calendarSelector'

describe('the custom calendar should ...', () => {
    const testNode = (
        <>
            <CalendarSelector></CalendarSelector>
        </>
    )

    it('... a heading showing the current date', () => {
        render(testNode)
        const todayAsString = new Date().toLocaleDateString()
        expect(screen.getByText(todayAsString)).toBeInTheDocument()
    })

    describe('...if click on the field', () => {
        beforeEach(() => {
            render(testNode)
            fireEvent.click(screen.getByTitle('Calendar icon'))
        })

        it('...it renders the current month', () => {
            const currentMonth = new Date().getMonth()
            switch (currentMonth) {
                case 0:
                    expect(screen.getByText(/Jan/)).toBeInTheDocument()
                    break
                case 1:
                    expect(screen.getByText(/Feb/)).toBeInTheDocument()
                    break
                case 2:
                    expect(screen.getByText(/Mar/)).toBeInTheDocument()
                    break
                case 3:
                    expect(screen.getByText(/Apr/)).toBeInTheDocument()
                    break
                case 4:
                    expect(screen.getByText(/May/)).toBeInTheDocument()
                    break
                case 5:
                    expect(screen.getByText(/Jun/)).toBeInTheDocument()
                    break
                case 6:
                    expect(screen.getByText(/Jul/)).toBeInTheDocument()
                    break
                case 7:
                    expect(screen.getByText(/Aug/)).toBeInTheDocument()
                    break
                case 8:
                    expect(screen.getByText(/Sep/)).toBeInTheDocument()
                    break
                case 9:
                    expect(screen.getByText(/Oct/)).toBeInTheDocument()
                    break
                case 10:
                    expect(screen.getByText(/Nov/)).toBeInTheDocument()
                    break
                case 11:
                    expect(screen.getByText(/Dec/)).toBeInTheDocument()
                    break
                default:
                    throw new Error(`Test for month ${currentMonth} not implemented`)
            }
        })

        it('... expand button shows text from Mon to Sun', () => {
            expect(screen.getByText('Mon')).toBeInTheDocument()
            expect(screen.getByText('Tue')).toBeInTheDocument()
            expect(screen.getByText('Wed')).toBeInTheDocument()
            expect(screen.getByText('Thu')).toBeInTheDocument()
            expect(screen.getByText('Fri')).toBeInTheDocument()
            expect(screen.getByText('Sat')).toBeInTheDocument()
            expect(screen.getByText('Sun')).toBeInTheDocument()
        })
        it('... today is selected', () => {
            const today = new Date().getDate()
            const selectedDayElement = screen.getByTitle(/^Selected Day/)
            expect(selectedDayElement).toHaveTextContent(today.toString())
        })

        describe('...and select the 15th of the current month', () => {
            beforeEach(() => {
                fireEvent.click(screen.getByText(/^15$/))
            })

            it('...the 15th is selected', () => {
                const selectedDayElement = screen.getByTitle(/^Selected Day/)
                expect(selectedDayElement).toHaveTextContent(/15/)
                const valueElement = screen.getByTitle(/Display value/i)
                expect(valueElement).toHaveTextContent(/15\//)
            })

            it('...and select the 14th of the current month', () => {
                fireEvent.click(screen.getByText(/^14$/))
                const selectedDayElement = screen.getByTitle(/^Selected Day/)
                expect(selectedDayElement).toHaveTextContent(/14/)
                const valueElement = screen.getByTitle(/Display value/i)
                expect(valueElement).toHaveTextContent(/14\//)
            })

            it('...and click the goto today button', () => {
                fireEvent.click(screen.getByText(/^16$/))
                let selectedDayElement = screen.getByTitle(/^Selected Day/)
                expect(selectedDayElement).toHaveTextContent(/16/)
                fireEvent.click(screen.getByTitle(/Goto today/))
                const today = new Date()
                const todayOfMonth = today.getDate()
                selectedDayElement = screen.getByTitle(/^Selected Day/)
                expect(selectedDayElement).toHaveTextContent(todayOfMonth.toString())
            })
        })
    })
})
