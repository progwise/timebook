import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { mockMeQuery, Role } from '../../../frontend/generated/graphql'
import '../../../frontend/mocks/mockServer'
import { mockServer } from '../../../frontend/mocks/mockServer'
import UserDetailsPage from './[userId].page'

const client = new Client({ url: '/api/team1/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { teamSlug: 'slug', userId: '23182391283' },
      isReady: true,
      push: jest.fn(),
    }
  },
}))

beforeEach(() => {
  mockServer.use(
    mockMeQuery((request, response, context) => {
      const result = response(
        context.data({
          __typename: 'Query',
          user: {
            __typename: 'User',
            id: '',
            image: undefined,
            name: 'User',
            role: Role.Admin,
          },
        }),
      )
      return result
    }),
  )
})

describe('UserIdPage (Admin)', () => {
  it('should changed roles', async () => {
    render(<UserDetailsPage />, { wrapper })

    const demoteButton = await screen.findByRole('button', {
      name: /demote to member/i,
    })

    await userEvent.click(demoteButton)
    let loading = await screen.findByText('Loading...')
    expect(loading).toBeVisible()
    await waitFor(() => expect(loading).not.toBeInTheDocument())

    const promoteButton = await screen.findByRole('button', {
      name: /promote to admin/i,
    })

    await userEvent.click(promoteButton)
    loading = await screen.findByText('Loading...')
    expect(loading).toBeVisible()
    await waitFor(() => expect(loading).not.toBeInTheDocument())
  })

  it('should change availableMinutesPerWeek', async () => {
    render(<UserDetailsPage />, { wrapper })

    const availableMinutesPerWeekField = await screen.findByRole('textbox')

    await userEvent.type(availableMinutesPerWeekField, '123')
    await userEvent.click(document.body)

    const errorField = screen.queryByLabelText('error field')

    expect(errorField).not.toBeInTheDocument()
  })
})
