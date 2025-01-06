import { render, screen, waitFor, within } from '@testing-library/react'
import { ParsedUrlQuery } from 'querystring'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import '../../frontend/mocks/mockServer'
import { default as WeekPage } from './index.page'

const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

const testRouterQuery: ParsedUrlQuery = {}
const testRouterPush = jest.fn()

jest.mock('next/router', () => ({ useRouter: () => ({ query: testRouterQuery, push: testRouterPush }) }))

describe('The week page...', () => {
  it('...displays the correct week, start and end dates', () => {
    testRouterQuery.day = '2023-11-15'
    render(<WeekPage />, { wrapper })
    const dateRangeDisplay = screen.getByText(/november 12 – 18, 2023/i)
    expect(dateRangeDisplay).toBeInTheDocument()
  })

  it('...renders the current projects table', async () => {
    render(<WeekPage />, { wrapper })
    const table = await screen.findByRole('table')
    expect(table).toBeVisible()
    const projectCell = await screen.findByRole('cell', { name: /project 1/i })
    const taskCell = await screen.findByRole('cell', { name: /task 1/i })
    expect(projectCell).toBeVisible()
    expect(taskCell).toBeVisible()
  })

  it('should disable inputs when a report is locking the month', async () => {
    testRouterQuery.day = '2023-02-27'
    render(<WeekPage />, { wrapper })

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
