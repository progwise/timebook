import { render, screen, waitFor } from '@testing-library/react'
import '../../../frontend/mocks/mockServer'
import { Client, Provider } from 'urql'
import UserDetailsPage from './[userId].page'
import { mockMeQuery, mockUserQuery, Role } from '../../../frontend/generated/graphql'
import { mockServer } from '../../../frontend/mocks/mockServer'
import userEvent from '@testing-library/user-event'
import { assignedProjects } from '../../../frontend/mocks/projectHandlers'

const client = new Client({ url: '/api/team1/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>
let userRole: Role = Role.Member

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { teamSlug: 'wint', userId: '23182391283' },
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
            projects: [],
          },
        }),
      )
      return result
    }),
  )

  mockServer.use(
    mockUserQuery((request, response, context) => {
      const result = response(
        context.data({
          __typename: 'Query',
          user: {
            __typename: 'User',
            id: '23182391283',
            name: 'Test Member',
            image: undefined,
            role: userRole,
            projects: assignedProjects,
          },
        }),
      )
      return result
    }),
  )
})

describe('UserIdPage (Admin)', () => {
  it('should promote to admin', async () => {
    render(<UserDetailsPage />, { wrapper })

    const promoteButton = await screen.findByRole('button', {
      name: /promote to admin/i,
    })

    await userEvent.click(promoteButton)
    const loading = await screen.findByText('Loading...')
    expect(loading).toBeVisible()
    await waitFor(() => expect(loading).not.toBeInTheDocument())

    userRole = Role.Admin
  })

  it('should demote to member', async () => {
    render(<UserDetailsPage />, { wrapper })

    const demoteButton = await screen.findByRole('button', {
      name: /demote to member/i,
    })

    await userEvent.click(demoteButton)
    const loading = await screen.findByText('Loading...')
    expect(loading).toBeVisible()
    await waitFor(() => expect(loading).not.toBeInTheDocument())
  })

  it('should remove project', async () => {
    render(<UserDetailsPage />, { wrapper })

    const switchButtons = await screen.findAllByRole('switch')

    await userEvent.click(switchButtons[0])

    await waitFor(() => expect(switchButtons[0]).not.toBeChecked())
  })

  it('should add project', async () => {
    render(<UserDetailsPage />, { wrapper })

    const switchButtons = await screen.findAllByRole('switch')

    await userEvent.click(switchButtons[1])

    await waitFor(() => expect(switchButtons[1]).toBeChecked())
  })

  it('should get validation errors capacityMinutes', async () => {
    render(<UserDetailsPage />, { wrapper })

    const capacityMinutesField = await screen.findByRole('textbox')

    await userEvent.type(capacityMinutesField, 'wrong data')
    const capasityNotNumber = await screen.findByText('Capacity minutes should be number')
    expect(capasityNotNumber).toBeInTheDocument()

    await userEvent.clear(capacityMinutesField)
    const emptyCapacity = await screen.findByText("Capacity minutes can't be empty")
    expect(emptyCapacity).toBeInTheDocument()

    await userEvent.type(capacityMinutesField, '-1234')
    const capasityNegativeNumber = await screen.findByText("Minutes can't be negative")
    expect(capasityNegativeNumber).toBeInTheDocument()
  })

  it('should change capacityMinutes', async () => {
    render(<UserDetailsPage />, { wrapper })

    const capacityMinutesField = await screen.findByRole('textbox')

    await userEvent.type(capacityMinutesField, '123')
    await userEvent.click(document.body)

    const errorField = screen.queryByLabelText('error field')

    expect(errorField).not.toBeInTheDocument()
  })
})
