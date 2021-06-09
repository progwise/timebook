import { fireEvent, render, screen } from '@testing-library/react'
import { HourInput } from './hourInput'
import userEvent from '@testing-library/user-event'

describe('the hour input control should display ...', () => {

    const testNode = <><HourInput></HourInput><button>Click me!</button></>

    it('... 0:00 in the beginning', () => {
        const { getByDisplayValue } = render(testNode)
        expect(getByDisplayValue('0:00')).toBeDefined()
    })

    it('... 1:00 if the user types "1"', () => {
        const { getByRole, getByText } = render(testNode)
        const hourBox = getByRole('textbox')
        hourBox.focus()
        fireEvent.change(hourBox, { target: { value: '1' } })
        getByText(/click me!/i).focus()

        screen.debug()
        expect(hourBox).toHaveValue('1:00')
    })

    it('... display "0:00" user types "abc"', () => {
        const renderResult = render(testNode)

    })

    describe('... should allow "hh:mm" input when ...', () => {
        it('... typing in "01:12"', () => {
            const { getByRole, getByText } = render(testNode)
            const hourBox = getByRole('textbox')
            hourBox.focus()
            fireEvent.change(hourBox, { target: { value: 'abc' } })
            getByText(/click me!/i).focus()

            screen.debug()
            expect(hourBox).toHaveValue('0:00')
        })
    })
})