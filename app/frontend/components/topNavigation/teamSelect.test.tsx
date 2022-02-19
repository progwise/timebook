import { render, screen, waitFor } from '@testing-library/react'
import { Client, Provider } from 'urql'
import { TeamSelect } from './teamSelect'
import '../../mocks/mockServer'
import userEvent from '@testing-library/user-event'

jest.mock('next/router', () => ({
  pathname: '/[teamSlug]/team',
  useRouter: () => ({}),
}))
const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

describe('The Team select component', () => {
  it('should render my team as button', async () => {
    render(<TeamSelect />, { wrapper })

    const yourTeamLink = await screen.findByRole('button', { name: /testteam1/i })
    expect(yourTeamLink).toBeInTheDocument()
  })
  it('should render other teams if clicked on my team', async () => {
    render(<TeamSelect />, { wrapper })

    const yourTeamButton = await screen.findByRole('button', { name: /testteam1/i })
    userEvent.click(yourTeamButton)

    const menu = screen.getByRole('menu')
    expect(menu).toHaveTextContent('testTeam1')
    expect(menu).toHaveTextContent('testTeam2')
    expect(menu).toHaveTextContent('Create new team')
  })
})
