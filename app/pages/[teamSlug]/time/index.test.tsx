import { render, screen } from '@testing-library/react'
import MaintainWorkHoursPage from './index.page'
import '../../../frontend/mocks/mockServer'
import { Client, Provider } from 'urql'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>
describe('The workhours time page', () => {
  it('should render the add entry button', async () => {
    render(<MaintainWorkHoursPage />, { wrapper })
    const selectDateButton = screen.getByRole('button', {
      name: /select date/i,
    })
    expect(selectDateButton).toBeInTheDocument()
    // screen.logTestingPlaygroundURL()
  })
})
