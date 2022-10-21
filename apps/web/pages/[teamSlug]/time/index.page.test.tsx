import { render, screen } from '@testing-library/react'
import { Client, Provider } from 'urql'

import '../../../frontend/mocks/mockServer'
import MaintainWorkHoursPage from './index.page'

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { teamSLug: 'test1' },
    }
  },
}))

const client = new Client({ url: '/api/team1/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>
describe('The workhours time page', () => {
  it('should render the select date button', async () => {
    render(<MaintainWorkHoursPage />, { wrapper })
    const button = screen.getByRole('button', {
      name: /select date/i,
    })
    expect(button).toBeEnabled()
  })

  it('should render the add item button', () => {
    render(<MaintainWorkHoursPage />, { wrapper })
    const button = screen.getByRole('button', {
      name: /add work item/i,
    })
    expect(button).toBeEnabled()
  })

  it('should render the edit item button', async () => {
    render(<MaintainWorkHoursPage />, { wrapper })
    const button = await screen.findByRole('button', {
      name: /edit/i,
    })
    expect(button).toBeEnabled()
  })

  it('should render the work hour entry', async () => {
    render(<MaintainWorkHoursPage />, { wrapper })
    const heading = await screen.findByRole('heading', {
      name: /task 1/i,
    })
    expect(heading).toBeVisible()
  })

  it('should render the work hour total', async () => {
    render(<MaintainWorkHoursPage />, { wrapper })
    const taskDurations = await screen.findAllByTitle('Task work for the selected day')
    const totalDuration = await screen.findByTitle('Total work for the selected day')
    expect(taskDurations.length === 1).toBeTruthy()
    expect(totalDuration).toHaveTextContent('2:03')
  })
})
