/* eslint-disable unicorn/filename-case */
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import '../frontend/mocks/mockServer'
import AccessTokensPage from './access-tokens.page'

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

describe('AccessTokensPage', () => {
  it('should display an error message when submitting an access token without a name', async () => {
    render(<AccessTokensPage />, { wrapper })

    const submitButton = await screen.findByRole('button', { name: 'Add' })
    const nameInput = screen.getByPlaceholderText('Enter a new access token name')

    await userEvent.type(nameInput, ' ')
    await userEvent.click(submitButton)

    const errorMessage = await screen.findByText('title must be at least 1 character')
    expect(errorMessage).toBeInTheDocument()
  })

  it('should display a table of access tokens', async () => {
    render(<AccessTokensPage />, { wrapper })

    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(4)
    expect(rows[1]).toHaveTextContent('A1')
    expect(rows[2]).toHaveTextContent('A2')
  })

  it('should add the access token to the table when creating a new access token', async () => {
    render(<AccessTokensPage />, { wrapper })

    const table = await screen.findByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(4)

    const inputField = screen.getByRole('textbox', { name: 'access token name' })
    await userEvent.type(inputField, 'access token 1')

    const addButton = screen.getByRole('button', { name: 'Add' })
    await userEvent.click(addButton)
    await waitFor(() => expect(within(table).getAllByRole('row')).toHaveLength(5))
  })
})
