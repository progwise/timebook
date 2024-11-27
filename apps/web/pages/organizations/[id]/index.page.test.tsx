import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import '../../../frontend/mocks/mockServer'
import OrganizationDetails from './index.page'

const client = new Client({ url: '/api/graphql', exchanges: [] })

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

it('should promote a member to admin and demote an admin to a member', async () => {
  render(<OrganizationDetails />, { wrapper })

  const button = await screen.findByRole('button', { name: 'Promote' })
  expect(button).toBeInTheDocument()

  await userEvent.click(button)
  await waitFor(() => expect(button).toHaveTextContent('Demote'))

  await userEvent.click(button)
  await waitFor(() => expect(button).toHaveTextContent('Promote'))
})
