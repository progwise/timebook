import { render, screen, waitFor, within } from '@testing-library/react'
import { Client, Provider } from 'urql'

import { WeekSelector } from '../../frontend/components/weekSelector'
import { mockServer } from '../../frontend/mocks/mockServer'
import { mockIsLockedQuery } from '../../frontend/mocks/mocks.generated'
import TimePage from './index.page'

const now = new Date()
const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

beforeEach(() => {
  mockServer.use(
    mockIsLockedQuery((request, response, context) =>
      response(
        context.data({
          report: { isLocked: request.variables.month === 1, __typename: 'Report' },
          task: { isLockedByUser: false, __typename: 'Task' },
          __typename: 'Query',
        }),
      ),
    ),
  )
})

describe('The time page...', () => {
  it('...displays the correct week, start and end dates', () => {
    const handleWeekSelect = jest.fn()
    render(<WeekSelector value={now} onChange={handleWeekSelect} />)

    const weekDisplay = screen.getByText(/week \d+\/\d{4}/i)
    const dateRangeDisplay = screen.getByText(/\d{2}\.\d{2} - (?:\d{2}\.){2}\d{4}/i)

    expect(weekDisplay).toBeInTheDocument()
    expect(dateRangeDisplay).toBeInTheDocument()
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

  it('should disable inputs when a report is locking the month', async () => {
    render(<TimePage day={new Date(2023, 1, 27)} />, { wrapper })

    const task1Row = await screen.findByRole('row', { name: /task 1/i })
    const hourInputs = within(task1Row).queryAllByRole('textbox')
    expect(hourInputs).toHaveLength(7)

    // expect first two to be disabled, because these inputs are from February (27th & 28th)
    await waitFor(() => expect(hourInputs[0]).toBeDisabled())
    expect(hourInputs[1]).toBeDisabled()

    // expect last five to be enabled, because these inputs are from March
    expect(hourInputs[2]).toBeEnabled()
    expect(hourInputs[3]).toBeEnabled()
    expect(hourInputs[4]).toBeEnabled()
    expect(hourInputs[5]).toBeEnabled()
    expect(hourInputs[6]).toBeEnabled()
  })
})
