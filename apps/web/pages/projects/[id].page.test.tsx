import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import '../../frontend/mocks/mockServer'
import ProjectDetails from './[id].page'

const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { id: '1' },
      isReady: true,
      push: jest.fn(),
    }
  },
}))

describe('ProjectDetails', () => {
  it('should promote a member to admin and demote an admin to a member', async () => {
    render(<ProjectDetails />, { wrapper })

    const button = await screen.findByRole('button', { name: 'Promote' })
    expect(button).toBeInTheDocument()

    await userEvent.click(button)
    await waitFor(() => expect(button).toHaveTextContent('Demote'))

    await userEvent.click(button)
    await waitFor(() => expect(button).toHaveTextContent('Promote'))
  })

  // https://github.com/jsdom/jsdom/issues/3294
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should remove a member', async () => {
    render(<ProjectDetails />, { wrapper })

    const button = await screen.findByRole('button', { name: 'Remove user from project' })
    expect(button).toBeInTheDocument()

    await userEvent.click(button)
    const confirmRemoveButton = screen.getByRole('button', { name: 'Remove' })

    await userEvent.click(confirmRemoveButton)
    await waitFor(() => expect(button).not.toBeInTheDocument())
  })
})
