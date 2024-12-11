import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import '../../mocks/mockServer'
import { isLocked } from '../../mocks/reportHandlers'
import { ReportForm } from './reportForm'

jest.mock('next/router', () => ({ useRouter: () => ({ isReady: true, push: jest.fn() }) }))

const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

it('should be possible to lock and unlock a report', async () => {
  const user = userEvent.setup()
  render(<ReportForm date={new Date()} projectId="project1" userId="1" />, { wrapper })

  const lockButton = await screen.findByRole('button', { name: /^Lock/ })

  await user.click(lockButton)
  await waitFor(() => expect(lockButton).toHaveTextContent(/^Unlock/))
  expect(isLocked).toBeTruthy()

  await user.click(lockButton)
  await waitFor(() => expect(lockButton).not.toBeChecked())
  expect(isLocked).toBeFalsy()
})

it('should be possible to group by task', async () => {
  const user = userEvent.setup()
  render(<ReportForm date={new Date()} projectId="project1" userId="1" />, { wrapper })

  const groupedByButton = await screen.findByRole('button', { name: /^All Details/ })
  await user.click(groupedByButton)

  const groupedByTask = await screen.findByText('Grouped by Task')
  await user.click(groupedByTask)

  const cell = await screen.findByRole('cell', {
    name: /user 1, user 2/i,
  })
  expect(cell).toBeInTheDocument()
})

it('should be possible to group by user', async () => {
  const user = userEvent.setup()
  render(<ReportForm date={new Date()} projectId="project1" userId="1" />, { wrapper })

  const groupedByButton = await screen.findByRole('button', { name: /^All Details/ })
  await user.click(groupedByButton)

  const groupedByUser = await screen.findByText('Grouped by User')
  await user.click(groupedByUser)

  const cell = await screen.findByRole('cell', {
    name: /task 1, task 2/i,
  })
  expect(cell).toBeInTheDocument()
})
