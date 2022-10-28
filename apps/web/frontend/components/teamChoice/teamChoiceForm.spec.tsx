/* eslint-disable testing-library/no-debugging-utils */
import { render, screen } from '@testing-library/react'
import { Client, Provider } from 'urql'

import '../../mocks/mockServer'
import { TeamChoiceForm } from './teamChoiceForm'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>
describe('teamChoiceForm', () => {
  it('should display teams', async () => {
    render(<TeamChoiceForm />, { wrapper })
    expect(await screen.findByRole('link', { name: /team1/i })).toBeVisible()
  })
  it('should display projects', async () => {
    render(<TeamChoiceForm />, { wrapper })
    expect(await screen.findByRole('link', { name: /project 1/i })).toBeVisible()
    expect(await screen.findByRole('link', { name: /project 2/i })).toBeVisible()
  })
})
