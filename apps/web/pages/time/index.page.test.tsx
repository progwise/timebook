import { render, screen } from '@testing-library/react'
import TimePage from './index.page'
import '../../frontend/mocks/mockServer'
import { Client, Provider } from 'urql'

const now = new Date()
const start = new Date(now.getFullYear(), 0, 1)
const weekNumber = Math.floor(((now.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7)
const yearNumber = now.getFullYear()
const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated' }),
}))
describe('The time page...', () => {
  it('...renders the week selector with today', () => {
    render(<TimePage />)
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
    const cell = await screen.findByRole('cell', { name: /project 1 task 1/i })
    expect(cell).toBeVisible()
  })
})
