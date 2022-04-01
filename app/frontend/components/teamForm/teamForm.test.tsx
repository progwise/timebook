import { Client, Provider } from 'urql'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamForm } from './teamForm'
import { TeamFragment, Theme } from '../../generated/graphql'

import '../../mocks/mockServer'

const routerPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({ push: routerPush }),
}))

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

afterEach(() => {
  cleanup()
  jest.resetAllMocks()
})

describe('TeamForm', () => {
  it('should create a new team', async () => {
    render(<TeamForm />, { wrapper })

    const companyField = screen.getByRole('textbox', { name: 'Company' })
    const slugField = screen.getByRole('textbox', { name: 'Slug' })
    const saveButton = screen.getByRole('button', { name: 'Save' })

    userEvent.type(companyField, 'Apple')
    userEvent.type(slugField, 'apple')
    userEvent.click(saveButton)

    await waitFor(() => expect(routerPush).toHaveBeenNthCalledWith(1, '/apple/team'))
  })

  it('should update a team', async () => {
    const team: TeamFragment = {
      id: 'ckyh7z2xr000509lbd993cyyu',
      canModify: true,
      inviteKey: 'ckyh7z75t000609lb5vkvhmxq',
      slug: 'google',
      theme: Theme.Blue,
      title: 'Google',
    }

    render(<TeamForm team={team} />, { wrapper })

    const companyField = screen.getByRole('textbox', { name: 'Company' })
    const slugField = screen.getByRole('textbox', { name: 'Slug' })
    const invitationLink = screen.getByRole('textbox', { name: 'Invitation link' })
    const saveButton = screen.getByRole('button', { name: 'Save' })

    expect(companyField).toHaveValue('Google')
    expect(slugField).toHaveValue('google')
    expect(invitationLink).toHaveValue('http://localhost:3000/google/team/invite/ckyh7z75t000609lb5vkvhmxq')

    userEvent.clear(companyField)
    userEvent.type(companyField, 'Alphabet')
    userEvent.clear(slugField)
    userEvent.type(slugField, 'alphabet')

    userEvent.click(saveButton)

    await waitFor(() => expect(routerPush).toHaveBeenNthCalledWith(1, '/alphabet/team'))
  })
})
