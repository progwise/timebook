import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { TeamFragment, Theme } from '../../generated/graphql'
import { requestedSlugs } from '../../mocks/handlers'
import '../../mocks/mockServer'
import { TeamForm } from './teamForm'

process.env.NEXTAUTH_URL = 'http://localhost:3000'

const routerPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push: routerPush }),
}))

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

afterEach(() => {
  requestedSlugs.slice(0, requestedSlugs.length)
  cleanup()
  jest.resetAllMocks()
})

describe('TeamForm', () => {
  it('should create a new team', async () => {
    render(<TeamForm />, { wrapper })

    const teamNameField = screen.getByRole('textbox', { name: 'Team name' })
    const slugField = screen.getByRole('textbox', { name: 'Slug' })
    const saveButton = screen.getByRole('button', { name: 'Save' })

    await userEvent.type(teamNameField, 'Apple')
    await userEvent.type(slugField, 'apple')
    await userEvent.click(saveButton)

    await waitFor(() => expect(routerPush).toHaveBeenNthCalledWith(1, '/apple/team'))
  })

  it('should update a team', async () => {
    const team: TeamFragment = {
      id: 'ckyh7z2xr000509lbd993cyyu',
      inviteKey: 'ckyh7z75t000609lb5vkvhmxq',
      slug: 'google',
      theme: Theme.Blue,
      title: 'Google',
      archived: false,
      __typename: 'Team',
    }

    render(<TeamForm team={team} />, { wrapper })

    const teamNameField = screen.getByRole('textbox', { name: 'Team name' })
    const slugField = screen.getByRole('textbox', { name: 'Slug' })
    const invitationLink = screen.getByRole('textbox', { name: 'Invitation link' })
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(teamNameField).toHaveValue('Google')
    expect(slugField).toHaveValue('google')
    expect(invitationLink).toHaveValue('http://localhost:3000/google/team/invite/ckyh7z75t000609lb5vkvhmxq')

    await userEvent.clear(teamNameField)
    await userEvent.type(teamNameField, 'Alphabet')
    await userEvent.clear(slugField)
    await userEvent.type(slugField, 'alphabet')

    await userEvent.click(saveButton)

    await waitFor(() => expect(routerPush).toHaveBeenNthCalledWith(1, '/alphabet/team'))
  })

  it('should display error message', async () => {
    render(<TeamForm />, { wrapper })

    const teamNameField = screen.getByRole('textbox', { name: 'Team name' })
    const slugField = screen.getByRole('textbox', { name: 'Slug' })
    const saveButton = screen.getByRole('button', { name: 'Save' })

    await userEvent.type(teamNameField, 'Limom')
    await userEvent.type(slugField, 'limom')
    await userEvent.click(saveButton)

    await waitFor(() => expect(routerPush).toHaveBeenNthCalledWith(1, '/limom/team'))

    await userEvent.clear(teamNameField)
    await userEvent.clear(slugField)

    await userEvent.type(teamNameField, 'Limom')
    await userEvent.type(slugField, 'limom')
    await userEvent.click(saveButton)

    const alert = await screen.findByRole('alert')

    expect(alert).toBeVisible()
    expect(routerPush).not.toHaveBeenCalledTimes(2)
  })
})