import { render, screen } from '@testing-library/react'
import TimePage from './index.page'
import '../../frontend/mocks/mockServer'
import { Client, Provider } from 'urql'
import { getWeek, getYear } from 'date-fns'

const now = new Date()
const weekNumber = getWeek(now, { firstWeekContainsDate: 7, weekStartsOn: 1 })
const yearNumber = getYear(now)
const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))
describe('The time page...', () => {
  it('...renders the week selector with today', () => {
    render(<TimePage />, { wrapper })
    const weekCombo = screen.getByRole('combobox', {
      name: /week/i,
    })
    const yearCombo = screen.getByRole('combobox', {
      name: /year/i,
    })
    expect(weekCombo).toHaveValue(weekNumber.toString())
    expect(yearCombo).toHaveValue(yearNumber.toString())
  })
  it('...renders the current projects table', async () => {
    render(<TimePage />, { wrapper })
    const table = await screen.findByRole('table')
    expect(table).toBeVisible()
    const projectCell = await screen.findByRole('cell', { name: /project 1/i })
    const taskCell = await screen.findByRole('cell', { name: /task 1/i })
    expect(projectCell).toBeVisible()
    expect(taskCell).toBeVisible()
  })
})
