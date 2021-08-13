import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HourInput } from './hourInput'

describe('the hour input control should display ...', () => {
    beforeEach(() => {
        render(
            <>
                <HourInput />
                <button>Click me!</button>
            </>,
        )
    })

    it('... 0:00 in the beginning', () => {
        const hourBox = screen.getByRole('textbox')
        expect(hourBox).toHaveDisplayValue('0:00')
    })

    it('... 1:00 if the user types "1"', () => {
        const hourBox = screen.getByRole('textbox')

        userEvent.clear(hourBox)
        userEvent.type(hourBox, '1')
        userEvent.click(screen.getByRole('button'))

        expect(hourBox).toHaveDisplayValue('1:00')
    })

    it('... display "0:00" user types "abc"', () => {
        const hourBox = screen.getByRole('textbox')

        userEvent.clear(hourBox)
        userEvent.type(hourBox, 'abc')
        userEvent.click(screen.getByRole('button'))

        expect(hourBox).toHaveDisplayValue('0:00')
    })

    describe('... should allow "hh:mm" input when ...', () => {
        it('... typing in "01:12"', () => {
            const hourBox = screen.getByRole('textbox')

            userEvent.clear(hourBox)
            userEvent.type(hourBox, '01:12')
            userEvent.click(screen.getByRole('button'))

            expect(hourBox).toHaveDisplayValue('1:12')
        })

        it('... typing 23:59 is ok', () => {
            const hourBox = screen.getByRole('textbox')

            userEvent.clear(hourBox)
            userEvent.type(hourBox, '23:59')
            userEvent.click(screen.getByRole('button'))

            expect(hourBox).toHaveDisplayValue('23:59')
        })

        it('... typing 23:60 is re-calculated to 24:00', () => {
            const hourBox = screen.getByRole('textbox')

            userEvent.clear(hourBox)
            userEvent.type(hourBox, '23:60')
            userEvent.click(screen.getByRole('button'))

            expect(hourBox).toHaveDisplayValue('24:00')
        })

        it('... typing 12.45 is changed to 12:26', () => {
            const hourBox = screen.getByRole('textbox')

            userEvent.clear(hourBox)
            userEvent.type(hourBox, '12.45')
            userEvent.click(screen.getByRole('button'))

            expect(hourBox).toHaveDisplayValue('12:26')
        })

        it('... typing 24.01 is changed to 24:00', () => {
            const hourBox = screen.getByRole('textbox')

            userEvent.clear(hourBox)
            userEvent.type(hourBox, '24.01')
            userEvent.click(screen.getByRole('button'))

            expect(hourBox).toHaveDisplayValue('24:00')
        })

        it('... typing 12.ab is changed to 12:00', () => {
            const hourBox = screen.getByRole('textbox')

            userEvent.clear(hourBox)
            userEvent.type(hourBox, '12.ab')
            userEvent.click(screen.getByRole('button'))

            expect(hourBox).toHaveDisplayValue('12:00')
        })
    })

    it('... typing 24.018 reports an error', () => {
        window.alert = jest.fn()
        const hourBox = screen.getByRole('textbox')

        userEvent.clear(hourBox)
        userEvent.type(hourBox, '24.017')
        userEvent.click(screen.getByRole('button'))

        expect(window.alert).toHaveBeenCalledTimes(1)
        expect(hourBox).toHaveDisplayValue('0:00')
    })
})
