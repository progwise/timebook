/* eslint @typescript-eslint/no-var-requires: "off" */

import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import ProjectDetails from './[id]'
import { screen } from '@testing-library/dom'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementationOnce(() => ({
    query: { page: 1, per_page: 10 },
    asPath: '/posts',
}))

useRouter.mockImplementationOnce(() => ({
    query: { page: 1, per_page: 10 },
    asPath: '/posts',
}))

describe('... testing form', () => {
    const testNode = <ProjectDetails></ProjectDetails>
    const strings = ['Id', 'Name', 'Start', 'End']
    beforeEach(() => {
        render(testNode)
    })

    it('... test strings', () => {
        for (const i of strings) {
            expect(screen.getByText(i)).toBeInTheDocument()
        }
        expect(screen.getByText('Create Project')).toBeInTheDocument()
    })

    it('... test changing input value', () => {
        for (const y of strings) {
            fireEvent.change(screen.getByTestId(y), { target: { value: 'test' } })
            expect(screen.getByTestId(y)).toHaveValue('test')
        }
    })
})
