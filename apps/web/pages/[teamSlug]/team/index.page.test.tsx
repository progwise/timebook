import { screen, render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import '../../../frontend/mocks/mockServer'
import TeamPage from './index.page'

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    query: { teamSlug: 'progwise' },
  }),
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

describe('TeamPage', () => {
  it('Should be possible to archive and then restore a team', async () => {
    render(<TeamPage />, { wrapper })
    const archiveButton = await screen.findByRole('button', { name: 'Archive' })
    await userEvent.click(archiveButton)

    const modalHeader = screen.getByText('Are you sure you want to archive testTeam1?')

    expect(modalHeader).toBeInTheDocument()

    const modal = screen.getByRole('dialog')
    const confirmButton = within(modal).getByRole('button', { name: 'Archive' })

    await userEvent.click(confirmButton)

    const restoreButton = await screen.findByRole('button', { name: 'Restore' })

    expect(restoreButton).toBeInTheDocument()

    await userEvent.click(restoreButton)

    expect(archiveButton).toBeInTheDocument()
  })
})
