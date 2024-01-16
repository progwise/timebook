/* eslint-disable unicorn/filename-case */
import { render, screen, within } from '@testing-library/react'
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
  it('should display a table of access tokens', async () => {
    render(<AccessTokensPage />, { wrapper })

    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row')
    expect(rows).toHaveLength(3)
    expect(rows[1]).toHaveTextContent('A1')
    expect(rows[2]).toHaveTextContent('A2')
  })
})
